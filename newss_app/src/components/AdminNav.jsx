import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from "../api/client";
import './AdminNav.css';

const AdminNav = () => {
    const navigate = useNavigate();

    const handleLogout = async () => { // Marking the function as async
        try {
            await api.post("/api/logout/");
            sessionStorage.removeItem("user_id");
            alert("You have been logged out.");
            navigate("/login");
        } catch (error) {
            console.error("Error logging out:", error);
            alert("Failed to log out.");
        }
    };

    return (
        <nav className="admin-nav navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container">
                <Link to="/admin/home" className="navbar-brand">Admin</Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto">
                        <li className="nav-item">
                            <Link to="/login/admin-home" className="nav-link">Home</Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/AddNews" className="nav-link">Add News</Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/AddAdv" className="nav-link">Add Advertisement</Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/ViewNews" className="nav-link">View News</Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/ViewAdv" className="nav-link">View Advertisement</Link>
                        </li>
                        <li className="nav-item">
                            <button onClick={handleLogout} className="nav-link btn btn-link text-light">Logout</button>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default AdminNav;
