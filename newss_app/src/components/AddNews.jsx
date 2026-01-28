import React, { useState, useRef, useEffect } from 'react';
import api from "../api/client";
import './AddNews.css';
import AdminNav from './AdminNav';
import Footer from './common/footer/Footer';
import { handleApiError, validateFormInput } from '../api/errorHandler';

const AddNews = () => {
    const [formData, setFormData] = useState({
        title: '',        description: '',        content: '',        image: null,        category: 'general',        authorName: '',        authorImage: null,        time: '',        place: '',    });
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [fieldErrors, setFieldErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const imageInputRef = useRef(null);
    const authorImageInputRef = useRef(null);

    const CATEGORY_CHOICES = [        { value: 'General', label: 'General' },
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
        
        if (fieldErrors[name]) {
            setFieldErrors({ ...fieldErrors, [name]: '' });
        }
    };

    const handleFileChange = (event) => {
        const { name, files } = event.target;
        const file = files[0];
        
        const MAX_FILE_SIZE = 5 * 1024 * 1024;
        if (file && file.size > MAX_FILE_SIZE) {
            setFieldErrors({ ...fieldErrors, [name]: 'File size must be less than 5MB' });
            event.target.value = '';
            return;
        }
        
        const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
        if (file && !validTypes.includes(file.type)) {
            setFieldErrors({ ...fieldErrors, [name]: 'File must be an image (JPG, PNG, WebP)' });
            event.target.value = '';
            return;
        }
        
        setFormData({ ...formData, [name]: file });
        if (fieldErrors[name]) {
            setFieldErrors({ ...fieldErrors, [name]: '' });
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setSuccessMessage('');
        setErrorMessage('');
        setFieldErrors({});

        const requiredFields = ['title', 'description', 'content', 'authorName', 'time', 'place'];
        const { isValid, errors } = validateFormInput(formData, requiredFields);
        
        if (!isValid) {
            setFieldErrors(errors);
            setErrorMessage('Please fill in all required fields');
            return;
        }

        if (formData.title.length > 500) {
            setFieldErrors({ ...fieldErrors, title: 'Title must be less than 500 characters' });
            setErrorMessage('Please check field errors');
            return;
        }

        if (formData.description.length > 500) {
            setFieldErrors({ ...fieldErrors, description: 'Description must be less than 500 characters' });
            setErrorMessage('Please check field errors');
            return;
        }

        setIsLoading(true);

        try {
            const newsData = new FormData();
            newsData.append('title', formData.title.trim());
            newsData.append('description', formData.description.trim());
            newsData.append('content', formData.content.trim());
            newsData.append('category', formData.category);
            newsData.append('authorName', formData.authorName.trim());
            newsData.append('time', formData.time.trim());
            newsData.append('place', formData.place.trim());

            if (formData.image) {
                newsData.append('image', formData.image);
            }
            if (formData.authorImage) {
                newsData.append('authorImage', formData.authorImage);
            }

            const response = await api.post("/api/addNews/", newsData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            if (response.data.success) {
                setSuccessMessage('News added successfully!');
                setFormData({
                    title: '',                    description: '',                    content: '',                    image: null,                    category: 'general',                    authorName: '',                    authorImage: null,                    time: '',                    place: '',                });

                if (imageInputRef.current) {
                    imageInputRef.current.value = '';
                }
                if (authorImageInputRef.current) {
                    authorImageInputRef.current.value = '';
                }
                window.scrollTo({ top: 0, behavior: 'smooth' });
                
                setTimeout(() => setSuccessMessage(''), 3000);
            } else {
                setErrorMessage(response.data.message || 'Failed to add news. Please try again.');
            }
        } catch (error) {
            const { message } = handleApiError(error);
            setErrorMessage(message);
        } finally {
            setIsLoading(false);
        }
    };

    return (        <>            <AdminNav />            <div className="add-news-container">                <h2 className="text-center">Add News</h2>                {successMessage && <div className="alert success">{successMessage}</div>}
                {errorMessage && <div className="alert error">{errorMessage}</div>}
                <form onSubmit={handleSubmit} className="add-news-form">
                    <div className="form-group">                        <label htmlFor="title">Title</label>                        <input                            type="text"                            name="title"                            value={formData.title}
                            onChange={handleChange}
                            className="form-control"                            id="title"                            placeholder="Enter title"                            required                        />                    </div>                    <div className="form-group">                        <label htmlFor="description">Description</label>                        <input                            type="text"                            name="description"                            value={formData.description}
                            onChange={handleChange}
                            className="form-control"                            id="description"                            placeholder="Enter a short description"                            required                        />                    </div>                    <div className="form-group">                        <label htmlFor="content">Content</label>                        <textarea                            name="content"                            value={formData.content}
                            onChange={handleChange}
                            className="form-control"                            id="content"                            rows="6"                            placeholder="Enter the content"                            required                        ></textarea>                    </div>                    <div className="form-group">                        <label htmlFor="category">Category</label>                        <select                            name="category"                            value={formData.category}
                            onChange={handleChange}
                            className="form-control"                            id="category"                            required                        >                            {CATEGORY_CHOICES.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>                            ))}
                        </select>                    </div>                    <div className="form-group">                        <label htmlFor="image">Upload News Image (Max 5MB)</label>                        <input                            type="file"                            name="image"                            onChange={handleFileChange}
                            className={`form-control-file ${fieldErrors.image ? 'input-error' : ''}`}
                            id="image"                            ref={imageInputRef}
                            accept="image/jpeg,image/png,image/webp"                            disabled={isLoading}
                        />                        {fieldErrors.image && <span className="error-text">{fieldErrors.image}</span>}
                    </div>                    <div className="form-group">                        <label htmlFor="authorName">Author Name *</label>                        <input                            type="text"                            name="authorName"                            value={formData.authorName}
                            onChange={handleChange}
                            className={`form-control ${fieldErrors.authorName ? 'input-error' : ''}`}
                            id="authorName"                            placeholder="Enter author name"                            disabled={isLoading}
                            required                        />                        {fieldErrors.authorName && <span className="error-text">{fieldErrors.authorName}</span>}
                    </div>                    <div className="form-group">                        <label htmlFor="authorImage">Upload Author Image (Max 5MB)</label>                        <input                            type="file"                            name="authorImage"                            onChange={handleFileChange}
                            className={`form-control-file ${fieldErrors.authorImage ? 'input-error' : ''}`}
                            id="authorImage"                            ref={authorImageInputRef}
                            accept="image/jpeg,image/png,image/webp"                            disabled={isLoading}
                        />                        {fieldErrors.authorImage && <span className="error-text">{fieldErrors.authorImage}</span>}
                    </div>                    <div className="form-group">                        <label htmlFor="time">Time *</label>                        <input                            type="time"                            name="time"                            value={formData.time}
                            onChange={handleChange}
                            className={`form-control ${fieldErrors.time ? 'input-error' : ''}`}
                            id="time"                            disabled={isLoading}
                            required                        />                        {fieldErrors.time && <span className="error-text">{fieldErrors.time}</span>}
                    </div>                    <div className="form-group">                        <label htmlFor="place">Place *</label>                        <input                            type="text"                            name="place"                            value={formData.place}
                            onChange={handleChange}
                            className={`form-control ${fieldErrors.place ? 'input-error' : ''}`}
                            id="place"                            placeholder="Enter location"                            disabled={isLoading}
                            required                        />                        {fieldErrors.place && <span className="error-text">{fieldErrors.place}</span>}
                    </div>                    <button type="submit" className="btn-submit" disabled={isLoading}>
                        {isLoading ? 'Adding News...' : 'Add News'}
                    </button>                </form>            </div>            <Footer />        </>    );
};

export default AddNews;
