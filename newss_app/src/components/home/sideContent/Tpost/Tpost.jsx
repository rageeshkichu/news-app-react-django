import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Heading from "../../../common/heading/Heading";
import "./tpost.css";

const Tpost = () => {
  const [techNews, setTechNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTechNews = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/news/category/Technology/");
        if (response.data.success) {
          setTechNews(response.data.data || []);
        } else {
          setError("Failed to fetch technology news.");
        }
      } catch (err) {
        setError("Error occurred while fetching news.");
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTechNews();
  }, []);

  const userId = sessionStorage.getItem("user_id"); // Check for user_id in sessionStorage

  if (loading) {
    return <div className="tpost-loading">Loading...</div>;
  }

  if (error) {
    return <div className="tpost-error">{error}</div>;
  }

  return (
    <section className="tpost">
      <Heading title="Tech" />
      {techNews.length > 0 ? (
        techNews.map((news) => (
          <Link
            to={userId ? `/news-detail/${news.id}` : "/login"}
            key={news.id}
            className="box flexSB tpost-card"
          >
            <div className="img">
              <img src={news.image || "/placeholder.jpg"} alt={news.title} />
            </div>
            <div className="text">
              <h1 className="title">
                {news.title.length > 35 ? `${news.title.slice(0, 35)}...` : news.title}
              </h1>
              <span>{new Date(news.date_published).toLocaleDateString()}</span>
            </div>
          </Link>
        ))
      ) : (
        <p className="tpost-no-news">No technology news available at the moment.</p>
      )}
    </section>
  );
};

export default Tpost;
