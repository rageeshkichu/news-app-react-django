import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './EditNews.css';
import AdminNav from './AdminNav';
import Footer from './common/footer/Footer';

const EditNews = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        content: '',
        category: '', // Default category
        image: null,
        authorName: '', // New field
        authorImage: null, // New field
        time: '', // New field
        place: '', // New field
    });
    const [categories, setCategories] = useState(['General', 'Sports', 'Health', 'Technology', 'Politics', 'Local News', 'World News']); // Example categories
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const fetchNewsData = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/api/news/${id}/`);
                const { title, description, content, category, authorName, time, place } = response.data;
                setFormData({
                    title,
                    description,
                    content,
                    category,
                    image: null,
                    authorName: authorName || '', // Populate new fields
                    time: time || '',
                    place: place || '',
                });
            } catch (error) {
                console.error('Error fetching news data:', error);
                setErrorMessage('Failed to load news data.');
            }
        };

        fetchNewsData();
    }, [id]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleImageChange = (event) => {
        const { name } = event.target;
        setFormData({ ...formData, [name]: event.target.files[0] });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setSuccessMessage('');
        setErrorMessage('');

        const newsData = new FormData();
        Object.keys(formData).forEach((key) => {
            if (formData[key]) {
                newsData.append(key, formData[key]);
            }
        });

        try {
            const response = await axios.post(`http://localhost:8000/api/newss/${id}/`, newsData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            if (response.data.success) {
                setSuccessMessage('News updated successfully!');
                navigate('/ViewNews'); // Redirect to news listing after success
            } else {
                setErrorMessage('Failed to update news. Please try again.');
            }
        } catch (error) {
            console.error('An error occurred:', error.response ? error.response.data : error.message);
            setErrorMessage('An error occurred while updating news.');
        }
    };

    return (
        <>
            <AdminNav />
            <div className="edit-news-container">
                <h2 className="text-center">Edit News</h2>
                {successMessage && <div className="alert success">{successMessage}</div>}
                {errorMessage && <div className="alert error">{errorMessage}</div>}
                <form onSubmit={handleSubmit} className="edit-news-form">
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
                        <label htmlFor="category">Category</label>
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            className="form-control"
                            id="category"
                            required
                        >
                            {categories.map((cat) => (
                                <option key={cat} value={cat}>
                                    {cat}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="authorName">Author Name</label>
                        <input
                            type="text"
                            name="authorName"
                            value={formData.authorName}
                            onChange={handleChange}
                            className="form-control"
                            id="authorName"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="time">Time</label>
                        <input
                            type="text"
                            name="time"
                            value={formData.time}
                            onChange={handleChange}
                            className="form-control"
                            id="time"
                            placeholder="e.g., 10:30 AM"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="place">Place</label>
                        <input
                            type="text"
                            name="place"
                            value={formData.place}
                            onChange={handleChange}
                            className="form-control"
                            id="place"
                            required
                        />
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
                        Update News
                    </button>
                </form>
            </div>
            <Footer />
        </>
    );
};

export default EditNews;
