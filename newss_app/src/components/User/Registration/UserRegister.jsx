import React, { useState } from 'react';
import api from "../../../api/client";
import './UserRegister.css';
import Navbar from '../../Navbar';
import { handleApiError, validateFormInput } from '../../../api/errorHandler';

function UserRegister() {
  const [formData, setFormData] = useState({
    username: '',    email: '',    password: '',    role: 2,  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
    
    if (fieldErrors[name]) {
      setFieldErrors({ ...fieldErrors, [name]: '' });
    }
    
    if (error) setError('');
    if (message) setMessage('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setMessage('');
    setFieldErrors({});

    const { isValid, errors } = validateFormInput(formData, ['username', 'email', 'password']);
    if (!isValid) {
      setFieldErrors(errors);
      setError('Please fix the errors below');
      return;
    }

    if (formData.username.length < 3) {
      setFieldErrors({ ...fieldErrors, username: 'Username must be at least 3 characters' });
      setError('Please fix the errors below');
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.post(        "/api/register/",        JSON.stringify(formData),      );

      if (response.data.success) {
        setMessage(response.data.message || 'Registration successful! You can now log in.');
        
        setFormData({
          username: '',          email: '',          password: '',          role: 2,        });
        
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
      } else {
        setError(response.data.message || 'Registration failed');
      }
    } catch (err) {
      const { message: errorMsg, status } = handleApiError(err);
      
      if (status === 400) {
        
        if (errorMsg.includes('username')) {
          setFieldErrors({ ...fieldErrors, username: 'Username already taken' });
        } else if (errorMsg.includes('email')) {
          setFieldErrors({ ...fieldErrors, email: 'Email already registered' });
        }
        setError(errorMsg);
      } else {
        setError(errorMsg);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (    <>      <Navbar />      <div className="register-container">        <form className="register-card" onSubmit={handleSubmit}>
          <h2 className="register-header">Sign Up</h2>          {message && (
            <div className="success-message" role="alert">              {message}
            </div>          )}
          {error && (
            <div className="error-message" role="alert">              {error}
            </div>          )}

          <div className="form-group">            <label htmlFor="username">Username</label>            <input              type="text"              name="username"              value={formData.username}
              onChange={handleChange}
              className={`register-input ${fieldErrors.username ? 'input-error' : ''}`}
              id="username"              placeholder="Enter username (min 3 characters)"              disabled={isLoading}
              required            />            {fieldErrors.username && (
              <span className="error-text">{fieldErrors.username}</span>
            )}
          </div>          <div className="form-group">            <label htmlFor="email">Email</label>            <input              type="email"              name="email"              value={formData.email}
              onChange={handleChange}
              className={`register-input ${fieldErrors.email ? 'input-error' : ''}`}
              id="email"              placeholder="Enter email"              disabled={isLoading}
              required            />            {fieldErrors.email && (
              <span className="error-text">{fieldErrors.email}</span>
            )}
          </div>          <div className="form-group">            <label htmlFor="password">Password</label>            <input              type="password"              name="password"              value={formData.password}
              onChange={handleChange}
              className={`register-input ${fieldErrors.password ? 'input-error' : ''}`}
              id="password"              placeholder="Enter password (min 6 characters)"              disabled={isLoading}
              required            />            {fieldErrors.password && (
              <span className="error-text">{fieldErrors.password}</span>
            )}
          </div>          <input type="hidden" name="role" value="2" />          <button type="submit" className="register-button" disabled={isLoading}>
            {isLoading ? 'Registering...' : 'Register'}
          </button>        </form>      </div>    </>  );
}

export default UserRegister;
