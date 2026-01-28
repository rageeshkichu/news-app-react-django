import React, { useState, useRef,useEffect } from 'react';
import api from "../api/client";
import './AddNews.css';
import AdminNav from './AdminNav';
import Footer from './common/footer/Footer';

const AddNews = () => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        content: '',
        image: null,
        category: 'general',
        authorName: '',
        authorImage: null,
        time: '',
        place: '',
    });
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    // Create refs for the file inputs
    const imageInputRef = useRef(null);
    const authorImageInputRef = useRef(null);

    const CATEGORY_CHOICES = [
        { value: 'General', label: 'General' },
        { value: 'Technology', label: 'Technology' },
        { value: 'Sports', label: 'Sports' },
        { value: 'Politics', label: 'Politics' },
        { value: 'Health', label: 'Health' },
        { value: 'Local News', label: 'Local News' },
        { value: 'World News', label: 'World News' },
    ];

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (event) => {
        const { name, files } = event.target;
        setFormData({ ...formData, [name]: files[0] });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setSuccessMessage('');
        setErrorMessage('');

        const newsData = new FormData();
        newsData.append('title', formData.title);
        newsData.append('description', formData.description);
        newsData.append('content', formData.content);
        newsData.append('category', formData.category);
        newsData.append('authorName', formData.authorName);
        newsData.append('time', formData.time);
        newsData.append('place', formData.place);

        if (formData.image) {
            newsData.append('image', formData.image);
        }
        if (formData.authorImage) {
            newsData.append('authorImage', formData.authorImage);
        }

        try {
            const response = await api.post("/api/addNews/", newsData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            if (response.data.success) {
                setSuccessMessage('News added successfully!');
                setFormData({
                    title: '',
                    description: '',
                    content: '',
                    image: null,
                    category: 'general',
                    authorName: '',
                    authorImage: null,
                    time: '',
                    place: '',
                });

                // Clear file input fields
                if (imageInputRef.current) {
                    imageInputRef.current.value = '';
                }
                if (authorImageInputRef.current) {
                    authorImageInputRef.current.value = '';
                }
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
                setErrorMessage('Failed to add news. Please try again.');
            }
        } catch (error) {
            console.error('An error occurred:', error.response ? error.response.data : error.message);
            setErrorMessage('An error occurred while adding news.');
        }
    };

    return (
        <>
            <AdminNav />
            <div className="add-news-container">
                <h2 className="text-center">Add News</h2>
                {successMessage && <div className="alert success">{successMessage}</div>}
                {errorMessage && <div className="alert error">{errorMessage}</div>}
                <form onSubmit={handleSubmit} className="add-news-form">
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
                        <label htmlFor="category">Category</label>
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            className="form-control"
                            id="category"
                            required
                        >
                            {CATEGORY_CHOICES.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="image">Upload News Image</label>
                        <input
                            type="file"
                            name="image"
                            onChange={handleFileChange}
                            className="form-control-file"
                            id="image"
                            ref={imageInputRef} // Assign ref to input
                            accept="image/*"
                        />
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
                            placeholder="Enter author name"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="authorImage">Upload Author Image</label>
                        <input
                            type="file"
                            name="authorImage"
                            onChange={handleFileChange}
                            className="form-control-file"
                            id="authorImage"
                            ref={authorImageInputRef} // Assign ref to input
                            accept="image/*"
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
                            placeholder="Enter the time (e.g., 2:30 PM)"
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
                            placeholder="Enter the place"
                            required
                        />
                    </div>
                    <button type="submit" className="btn-submit">
                        Add News
                    </button>
                </form>
            </div>
            <Footer />
        </>
    );
};

export default AddNews;
