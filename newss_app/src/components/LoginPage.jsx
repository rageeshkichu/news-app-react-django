import React, { useState, useEffect } from 'react';
import api from "../api/client";
import { useNavigate, Link } from "react-router-dom";
import Navbar from './Navbar';
import './LoginPage.css';
import Footer from './common/footer/Footer';
import { handleApiError, validateFormInput, isAuthError } from '../api/errorHandler';
import { saveTokens, isAuthenticated } from '../utils/tokenStorage';

const LoginPage = () => {
    const [formData, setFormData] = useState({
        username: '',        password: '',    });
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [fieldErrors, setFieldErrors] = useState({});

    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo(0, 0);
        if (isAuthenticated()) {
            
            navigate('/user-home');
        }
    }, [navigate]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
        
        if (fieldErrors[name]) {
            setFieldErrors({ ...fieldErrors, [name]: '' });
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setErrorMessage('');
        setFieldErrors({});

        const { isValid, errors } = validateFormInput(formData, ['username', 'password']);
        if (!isValid) {
            setFieldErrors(errors);
            setErrorMessage('Please fix the errors below');
            return;
        }

        setIsLoading(true);
        try {
            const loginResponse = await api.post("/api/loginUser/", formData);

            if (loginResponse.data.success) {
                const { 
                    access_token,                     refresh_token,                     user_id,                     is_superuser,                    username                 } = loginResponse.data;
                
                saveTokens(access_token, refresh_token, user_id, is_superuser, username);
                
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
            const { message, status } = handleApiError(error);
            
            if (isAuthError(status)) {
                setErrorMessage('Invalid username or password');
            } else {
                setErrorMessage(message);
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (        <>            <Navbar />            <div className="login-container">                <form onSubmit={handleSubmit} className="login-form">
                    <div className="login-card">                        <h3 className="login-header">News24 Login</h3>                        {errorMessage && (
                            <div className="login-alert alert-error" role="alert">                                {errorMessage}
                            </div>                        )}
                        <div className="form-group">                            <label htmlFor="username">Username</label>                            <input                                type="text"                                name="username"                                value={formData.username}
                                onChange={handleChange}
                                className={`login-input ${fieldErrors.username ? 'input-error' : ''}`}
                                id="username"                                placeholder="Enter username"                                disabled={isLoading}
                                required                            />                            {fieldErrors.username && (
                                <span className="error-text">{fieldErrors.username}</span>
                            )}
                        </div>                        <div className="form-group">                            <label htmlFor="password">Password</label>                            <input                                type="password"                                name="password"                                value={formData.password}
                                onChange={handleChange}
                                className={`login-input ${fieldErrors.password ? 'input-error' : ''}`}
                                id="password"                                placeholder="Password"                                disabled={isLoading}
                                required                            />                            {fieldErrors.password && (
                                <span className="error-text">{fieldErrors.password}</span>
                            )}
                        </div>                        <button type="submit" className="login-button" disabled={isLoading}>
                            {isLoading ? 'Logging in...' : 'Login'}
                        </button>                        <div className="signup-link">                            <Link to="/user-register">New User? Sign Up here</Link>                        </div>                    </div>                </form>            </div>            <Footer />        </>    );
};

export default LoginPage;
