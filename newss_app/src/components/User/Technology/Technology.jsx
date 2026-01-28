import React, { useEffect, useState } from 'react';
import api from "../../../api/client";
import { Link } from 'react-router-dom';
import '../GeneralNews/General.css';
import { handleApiError, isNetworkError } from '../../../api/errorHandler';

function Technology() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get('/api/news/category/Technology/');
        
        if (response.data.success) {
          setNews(response.data.data || []);
        } else {
          setError(response.data.message || 'Failed to load news');
        }
      } catch (err) {
        const { message } = handleApiError(err);
        
        if (isNetworkError(err)) {
          setError('Network error. Please check your internet connection.');
        } else {
          setError(message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (loading) {
    return (      <div className="loading-container">        <div className="spinner"></div>        <p>Loading news...</p>      </div>    );
  }

  if (error) {
    return (      <div className="error-container" role="alert">        <h3>Unable to load news</h3>        <p>{error}</p>
        <button           onClick={() => window.location.reload()}
          className="btn btn-primary"        >          Try Again        </button>      </div>    );
  }

  return (    <>      <div className="general-news-container">        <h2 className="news-header">Technology</h2>        <div className="news-list">          {news.length > 0 ? (
            news.map((item) => (              <div key={item.id} className="news-item">
                <h3 className="news-title">{item.title}</h3>
                {item.image_url && (
                  <img                     className="news-image"                     src={item.image_url} 
                    alt={item.title}
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />                )}
                <p className="news-description">{item.description}</p>
                <p className="news-content">{item.content}</p>
                <div className="news-meta">                  <span>{new Date(item.date_published).toLocaleDateString()}</span>
                  {item.author_name && <span> by {item.author_name}</span>}
                </div>                <Link to={`/news-detail/${item.id}`} className="btn btn-primary">
                  Read More                </Link>              </div>            ))          ) : (            <div className="no-news">              <p>No news available at this time.</p>            </div>          )}
        </div>      </div>    </>  );
}

export default Technology;
