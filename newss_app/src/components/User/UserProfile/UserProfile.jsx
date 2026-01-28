import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./UserProfile.css";
import UserNavbar from "../Navbar/UserNavbar";
import Footer from "../../common/footer/Footer";

function UserProfile() {
    const [userDetails, setUserDetails] = useState({
        firstName: "",
        lastName: "",
        username: "",
        email: "",
        password: "",
    });
    const [userId, setUserId] = useState(null);
    const [isModalOpen, setModalOpen] = useState(false); // State for modal
    const [newPassword, setNewPassword] = useState(""); // State for new password
    const [confirmPassword, setConfirmPassword] = useState(""); // State for confirm password
    const navigate = useNavigate();

    useEffect(() => {
        const storedUserId = sessionStorage.getItem("user_id");
        if (storedUserId) {
            setUserId(storedUserId);
            fetchUserData(storedUserId);
        } else {
            alert("Please log in first.");
            navigate("/login");
        }
    }, [navigate]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const fetchUserData = async (userId) => {
        try {
            const response = await axios.get(
                `http://localhost:8000/api/get-userprofile-details/${userId}`
            );
            if (response.data.status === "success") {
                setUserDetails({
                    firstName: response.data.data.first_name,
                    lastName: response.data.data.last_name,
                    username: response.data.data.username,
                    email: response.data.data.email,
                    password: "",
                });
            } else {
                alert("Failed to fetch user data");
            }
        } catch (error) {
            console.error("Error fetching user profile:", error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserDetails((prevDetails) => ({
            ...prevDetails,
            [name]: value,
        }));
    };

    const handleUpdate = async () => {
        if (!userId) {
            alert("User ID not found!");
            return;
        }

        try {
            const response = await axios.post(
                "http://localhost:8000/api/update-user-details/",
                {
                    user_id: userId,
                    first_name: userDetails.firstName,
                    last_name: userDetails.lastName,
                    username: userDetails.username,
                    email: userDetails.email,
                    password: userDetails.password,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                    }
                }
            );

            if (response.data.status === "success") {
                alert(response.data.message);
                navigate("/user-home");
            } else {
                alert(response.data.message || "Failed to update details");
            }
        } catch (error) {
            console.error("Error updating user details:", error);
            alert("Failed to update details.");
        }
    };

    const handlePasswordReset = async () => {
        if (!userId) {
            alert("User ID not found!");
            return;
        }

        if (newPassword !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        try {
            const response = await axios.post(
                "http://localhost:8000/api/reset-password/",
                {
                    user_id: userId,
                    new_password: newPassword,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                    }
                }
            );

            if (response.data.status === "success") {
                alert("Password updated successfully!");
                setModalOpen(false);
            } else {
                alert(response.data.message || "Failed to reset password.");
            }
        } catch (error) {
            console.error("Error resetting password:", error);
            alert("Failed to reset password.");
        }
    };

    const handleLogout = async () => {
        try {
            await axios.post("http://localhost:8000/api/logout/");
            sessionStorage.removeItem("user_id");
            alert("You have been logged out.");
            navigate("/login");
        } catch (error) {
            console.error("Error logging out:", error);
            alert("Failed to log out.");
        }
    };

    return (
        <>
            <UserNavbar />
            <div className="profile-container">
                <h2 className="profile-header">User Profile</h2>
                <form className="profile-form">
                    {[
                        { label: "Username", name: "username" },
                        { label: "Email", name: "email", type: "email" },
                    ].map(({ label, name, type = "text" }) => (
                        <div className="form-group" key={name}>
                            <label htmlFor={name} className="form-label">
                                {label}
                            </label>
                            <input
                                type={type}
                                className="form-input"
                                id={name}
                                name={name}
                                value={userDetails[name]}
                                onChange={handleInputChange}
                            />
                        </div>
                    ))}
                    <div className="button-group">
                        <button
                            type="button"
                            className="btn btn-primary update-btn"
                            onClick={handleUpdate}
                        >
                            Update
                        </button>
                        <button
                            type="button"
                            className="btn btn-secondary reset-btn"
                            onClick={() => setModalOpen(true)} // Open modal on click
                        >
                            Reset Password
                        </button>
                        <button
                            type="button"
                            className="btn btn-danger logout-btn"
                            onClick={handleLogout}
                        >
                            Logout
                        </button>
                    </div>
                </form>
            </div>

            {/* Modal for Reset Password */}
            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Reset Password</h3>
                        <div className="form-group">
                            <label htmlFor="new-password">New Password</label>
                            <input
                                type="password"
                                id="new-password"
                                className="form-input"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="Enter new password"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="confirm-password">Confirm Password</label>
                            <input
                                type="password"
                                id="confirm-password"
                                className="form-input"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Confirm new password"
                            />
                        </div>
                        <div className="button-group">
                            <button
                                className="btn btn-secondary"
                                onClick={handlePasswordReset}
                            >
                                Submit
                            </button>
                            <button
                                className="btn btn-secondary"
                                onClick={() => setModalOpen(false)} // Close modal on click
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </>
    );
}

export default UserProfile;
