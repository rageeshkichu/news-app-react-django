import React, { useEffect, useState } from 'react';
import api from "../api/client";
import { Link } from 'react-router-dom';
import './News.css'; 

function News2() {
    const [newsList, setNewsList] = useState([]);
    const [ads, setAds] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const response = await api.get("/api/news/");
                setNewsList(response.data.news);
            } catch (error) {
                setErrorMessage('Failed to fetch news. Please try again later.');
                console.error(error);
            }
        };

        const fetchAds = async () => {
            try {
                const response = await api.get("/api/ads/");
                setAds(response.data.ads);
            } catch (error) {
                console.error("Failed to fetch ads", error);
            }
        };

        fetchNews();
        fetchAds();
    }, []);

    const categorizeNews = () => {
        const categorized = {};
        newsList.forEach((item) => {
            const category = item.category || 'Uncategorized';
            if (!categorized[category]) {
                categorized[category] = [];
            }
            categorized[category].push(item);
        });

        const sortedCategories = Object.keys(categorized).sort((a, b) => {
            if (a === 'General') return -1;
            if (b === 'General') return 1;
            return a.localeCompare(b);
        });

        return sortedCategories.reduce((acc, category) => {
            acc[category] = categorized[category];
            return acc;
        }, {});
    };

    return (
        <>
            <div className="news-container">
                <h2 className="text-center">
                    News
                </h2>
                {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

                {}
                <div className="ads-section">
                    <h3 className="ads-title">Sponsored</h3>
                    {ads.length > 0 && ads.map((ad) => (
                        <div className="ads-content" key={ad.id}>
                            <a href={ad.link_url} target="_blank" rel="noopener noreferrer">
                                <img src={ad.image_url} alt={ad.title} className="ad-image" />
                            </a>
                            {ad.description && <p>{ad.description}</p>}
                            <p>{ad.content}</p>
                        </div>
                    ))}
                </div>
                {Object.keys(categorizeNews()).map((category) => (
                    <div key={category} className="category-section">
                        <h3 className="category-heading">{category}</h3>
                        <div className="news-cards-container">
                            {categorizeNews()[category].map((news) => (
                                <Link 
                                    to={`/news-detail/${news.id}`} 
                                    key={news.id} 
                                    className="news-cardd"
                                >
                                    <div>
                                        <img 
                                            src={news.image_url || "/placeholder.jpg"}
                                            alt={news.title} 
                                            className="news-image" 
                                        />
                                        <h3 className="news-title">{news.title}</h3>
                                        <p className="news-description">{news.description}</p>
                                        <p className="news-content">{news.content}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}

export default News2;
