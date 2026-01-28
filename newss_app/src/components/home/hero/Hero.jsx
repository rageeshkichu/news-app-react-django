import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./hero.css";

const Hero = () => {
  const [news, setNews] = useState([]);

  const fetchNews = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/news/");
      if (response.data && Array.isArray(response.data.news)) {
        setNews(response.data.news.slice(0, 4));
      } else {
        console.error("News data is not in the expected format.");
      }
    } catch (error) {
      console.error("Error fetching news:", error);
    }
  };
  useEffect(() => {
    fetchNews();
  }, []);

  return (
    <section className="hero">
      <div className="container">
        {/* Display news items directly */}
        {news.length === 0 ? (
          <p>Loading news...</p> // Show loading text if news is empty
        ) : (
          news.map((item) => {
            // Check if user_id is available in session storage
            const userId = sessionStorage.getItem("user_id");

            // Conditionally set the redirect path based on user_id
            const redirectPath = userId ? `/news-detail/${item.id}` : "/login";

            return (
              <div className="box" style={{ position: "relative" }} key={item.id}>
                {/* Use Link for navigation */}
                <Link
                  to={redirectPath}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    zIndex: 1,
                    textDecoration: "none",
                  }}
                />
                <div className="img">
                  {/* Image with fallback */}
                  <img
                    src={item.image_url || "/default-image.jpg"} // Use default image if API image is not available
                    alt={item.title}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/default-image.jpg"; // Fallback image on error
                    }}
                  />
                </div>
                <div className="text">
                  <span className="category">{item.category}</span>
                  <h1 className="titleBg">
                    {item.title.length > 40 ? `${item.title.slice(0, 40)}...` : item.title}
                  </h1>
                  <div className="author flex">
                    <span>by {item.author_name}</span>
                    <span>{new Date(item.date_published).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
};

export default Hero;
