import React, { useEffect, useState } from 'react';
import api from "../../../api/client";
import { Link } from 'react-router-dom';
import '../GeneralNews/General.css';


function Sports() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch news data when the component mounts
  useEffect(() => {
    api
      .get('/api/news/category/Sports/')
      .then((response) => {
        setNews(response.data.data);
        setLoading(false);
      })
      .catch((error) => {
        setError('Failed to load news');
        setLoading(false);
      });
  }, []); // Empty dependency array means this runs only once when the component mounts

  useEffect(() => {
    window.scrollTo(0, 0);
}, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <>
      <div className="general-news-container">
        <h2 className="news-header">Sports</h2>
        <div className="news-list">
          {news.length > 0 ? (
            news.map((item, index) => (
              <div key={index} className="news-item">
                <h3 className="news-title">{item.title}</h3>
                {item.image && <img className="news-image" src={item.image} alt={item.title} />}
                <p className="news-description">{item.description}</p>
                <p className="news-content">{item.content}</p>
                <div className="news-meta">
                  <span>{new Date(item.date_published).toLocaleDateString()}</span>
                </div>
                <Link to={`/news-detail/${item.id}`} className="btn btn-primary">
                                    Read More
                </Link>
              </div>
            ))
          ) : (
            <p>No news available</p>
          )}
        </div>
      </div>
    </>
  );
}

export default Sports;
