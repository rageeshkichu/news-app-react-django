import React, { useState } from 'react';
import api from "../api/client";
import './AddAdv.css'; // Make sure to create this CSS file
import AdminNav from './AdminNav';
import Footer from './common/footer/Footer';

const AddAdv = () => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        content: '',
        image: null,
    });
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

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
        advData.append('image', formData.image);

        try {
            const response = await api.post("/api/addAdv/", advData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            if (response.data.success) {
                setSuccessMessage('Advertisement added successfully!');
                setFormData({ title: '', description: '', content: '', image: null });
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
                setErrorMessage('Failed to add advertisement. Please try again.');
            }
        } catch (error) {
            console.error('An error occurred:', error);
            setErrorMessage('An error occurred while adding advertisement.');
        }
    };

    return (
        <>
        <AdminNav />
        <div className="add-adv-container">
            <h2 className="text-center">Add Advertisement</h2>
            {successMessage && <div className="alert success">{successMessage}</div>}
            {errorMessage && <div className="alert error">{errorMessage}</div>}
            <form onSubmit={handleSubmit} className="add-adv-form">
                <div className="form-group">
                    <label htmlFor="title">Title</label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        className="form-control"
                        id="title"
                        placeholder="Enter title"
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
                        placeholder="Enter a short description"
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
                        placeholder="Enter the content"
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
                        required
                    />
                </div>
                <button type="submit" className="btn-submit">
                    Add Advertisement
                </button>
            </form>
        </div>
        <Footer/>
        </>
    );
};

export default AddAdv;
