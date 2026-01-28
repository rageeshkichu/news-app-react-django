import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FiFileText, FiMonitor } from 'react-icons/fi'; // Add icons
import './AdminHome.css';
import AdminNav from './AdminNav';
import Footer from './common/footer/Footer';

const AdminHome = () => {
    const [newsCount, setNewsCount] = useState(0);
    const [adsCount, setAdsCount] = useState(0);

    useEffect(() => {
        const fetchCounts = async () => {
            try {
                const newsResponse = await axios.get('http://localhost:8000/api/news/count/');
                setNewsCount(newsResponse.data.count);

                const adsResponse = await axios.get('http://localhost:8000/api/ads/count/');
                setAdsCount(adsResponse.data.count);
            } catch (error) {
                console.error('Error fetching counts:', error);
            }
        };

        fetchCounts();
    }, []);

    return (
        <>
            <AdminNav />
            <div className="admin-container">
                <h2 className="admin-title">Admin Dashboard</h2>
                <div className="admin-stats">
                    <div className="admin-card news-card">
                        <div className="admin-card-icon">
                            <FiFileText size={40} />
                        </div>
                        <div className="admin-card-body">
                            <h5 className="admin-card-title">Total News Articles</h5>
                            <p className="admin-card-count" data-count={newsCount}>
                                {newsCount.toLocaleString()}
                            </p>
                        </div>
                    </div>
                    <div className="admin-card ads-card">
                        <div className="admin-card-icon">
                            <FiMonitor size={40} />
                        </div>
                        <div className="admin-card-body">
                            <h5 className="admin-card-title">Total Ads</h5>
                            <p className="admin-card-count" data-count={adsCount}>
                                {adsCount.toLocaleString()}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <Footer/>
        </>
    );
};

export default AdminHome;
