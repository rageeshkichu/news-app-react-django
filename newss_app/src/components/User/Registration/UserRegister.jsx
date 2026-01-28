import React, { useState } from 'react';
import api from "../../../api/client";
import './UserRegister.css';
import Navbar from '../../Navbar';

function UserRegister() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 2, // Static role value
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setMessage('');
    try {
      const response = await api.post(
        "/api/register/",
        JSON.stringify(formData),
      );

      // Handle success
      setMessage(response.data.message);
    } catch (error) {
      // Handle error
      setError(error.response?.data?.message || 'Failed to register user');
    }
  };

  return (
    <>
      <Navbar />
      <div className="register-container">
        <form className="register-card" onSubmit={handleSubmit}>
          <h2 className="register-header">Sign Up</h2>

          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="register-input"
              id="username"
              placeholder="Enter username"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="register-input"
              id="email"
              placeholder="Enter email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="register-input"
              id="password"
              placeholder="Enter password"
            />
          </div>

          {/* Hidden input field with a static value of 2 */}
          <input type="hidden" name="role" value="2" />

          <button type="submit" className="register-button">Register</button>

          {message && <div className="success-message">{message}</div>}
          {error && <div className="error-message">{error}</div>}
        </form>
      </div>
    </>
  );
}

export default UserRegister;
