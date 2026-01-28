import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from "react-router-dom";
import Navbar from './Navbar';
import './LoginPage.css';
import Footer from './common/footer/Footer';

const LoginPage = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });
    const [errorMessage, setErrorMessage] = useState('');

    const navigate = useNavigate();

    // Scroll to top on page load
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const loginResponse = await axios.post('http://localhost:8000/api/loginUser/', formData);
            console.log("Response from backend:", loginResponse);

            if (loginResponse.data.success) {
                const { user_id, is_superuser } = loginResponse.data;
                sessionStorage.setItem('user_id', user_id);
                sessionStorage.setItem('is_superuser', is_superuser);

                if (is_superuser) {
                    navigate('/login/admin-home');
                } else {
                    navigate('/user-home');
                }
            } else {
                setErrorMessage(loginResponse.data.message || 'Invalid username or password');
            }
        } catch (error) {
            console.error('An error occurred:', error);
            setErrorMessage('Invalid username or password');
        }
    };

    return (
        <>
            <Navbar />
            <div className="login-container">
                <form onSubmit={handleSubmit} className="login-form">
                    <div className="login-card">
                        <h3 className="login-header">News24 Login</h3>
                        {errorMessage && <div className="login-alert">{errorMessage}</div>}
                        <div className="form-group">
                            <label htmlFor="username">Username</label>
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                className="login-input"
                                id="username"
                                placeholder="Enter username"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="login-input"
                                id="password"
                                placeholder="Password"
                            />
                        </div>
                        <button type="submit" className="login-button">Login</button>
                        <div className="signup-link">
                            <Link to="/user-register">New User? Sign Up here</Link>
                        </div>
                    </div>
                </form>
            </div>
            <Footer />
        </>
    );
};

export default LoginPage;
