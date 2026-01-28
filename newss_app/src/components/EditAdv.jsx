import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './EditAdv.css'; // Make sure to create this CSS file
import AdminNav from './AdminNav';
import Footer from './common/footer/Footer';

const EditAdv = () => {
    const { id } = useParams(); // Get the advertisement ID from the URL
    const navigate = useNavigate(); // Hook for navigation
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        content: '',
        image: null,
    });
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        // Fetch existing advertisement data by ID
        const fetchAdvData = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/api/adv/${id}/`);
                const { title, description, content } = response.data;
                setFormData({ title, description, content, image: null });
            } catch (error) {
                console.error('Error fetching advertisement data:', error);
                setErrorMessage('Failed to load advertisement data.');
            }
        };

        fetchAdvData();
    }, [id]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleImageChange = (event) => {
        setFormData({ ...formData, image: event.target.files[0] });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setSuccessMessage('');
        setErrorMessage('');

        const advData = new FormData();
        advData.append('title', formData.title);
        advData.append('description', formData.description);
        advData.append('content', formData.content);
        if (formData.image) {
            advData.append('image', formData.image);
        }

        try {
            const response = await axios.post(`http://localhost:8000/api/advv/${id}/`, advData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            if (response.data.success) {
                setSuccessMessage('Advertisement updated successfully!');
                // Redirect to the advertisement listing or detail page
                navigate('/ViewAdv'); // Adjust the path as necessary
            } else {
                setErrorMessage('Failed to update advertisement. Please try again.');
            }
        } catch (error) {
            console.error('An error occurred:', error);
            setErrorMessage('An error occurred while updating the advertisement.');
        }
    };

    return (
        <>
            <AdminNav />
            <div className="edit-adv-container">
                <h2 className="text-center">Edit Advertisement</h2>
                {successMessage && <div className="alert success">{successMessage}</div>}
                {errorMessage && <div className="alert error">{errorMessage}</div>}
                <form onSubmit={handleSubmit} className="edit-adv-form">
                    <div className="form-group">
                        <label htmlFor="title">Title</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            className="form-control"
                            id="title"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="description">Description</label>
                        <input
                            type="text"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            className="form-control"
                            id="description"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="content">Content</label>
                        <textarea
                            name="content"
                            value={formData.content}
                            onChange={handleChange}
                            className="form-control"
                            id="content"
                            rows="6"
                            required
                        ></textarea>
                    </div>
                    <div className="form-group">
                        <label htmlFor="image">Upload Image</label>
                        <input
                            type="file"
                            name="image"
                            onChange={handleImageChange}
                            className="form-control-file"
                            id="image"
                            accept="image/*"
                        />
                    </div>
                    <button type="submit" className="btn-submit">
                        Update Advertisement
                    </button>
                </form>
            </div>
            <Footer/>
        </>
    );
};

export default EditAdv;
