import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../../api/client";

const Card = () => {
  const [news, setNews] = useState([]); 

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await api.get("/api/news/");

        if (response.data && Array.isArray(response.data.news)) {
          
          const firstFourNews = response.data.news.slice(0, 4);
          
          setNews(firstFourNews); 
        } else {
          console.error("News data is not in the expected format.");
        }
      } catch (error) {
        console.error("Error fetching news:", error);
      }
    };

    fetchNews(); 
  }, []); 

  return (    <>      {news.length === 0 ? (
        <p>Loading news...</p>       ) : (        news.map((item) => (          <div className="box" style={{ position: "relative" }} key={item.id}>
            {}
            <Link              to={`/SinglePage/${item.id}`}
              style={{
                position: "absolute",                top: 0,                left: 0,                width: "100%",                height: "100%",                zIndex: 1,                textDecoration: "none",              }}
            />            <div className="img">              {}
              <img                src={item.image_url || "/default-image.jpg"} 
                alt={item.title}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/default-image.jpg"; 
                }}
              />            </div>            <div className="text">              <span className="category">{item.category}</span>
              <h1 className="titleBg">                {item.title.length > 40 ? `${item.title.slice(0, 40)}...` : item.title}
              </h1>              <div className="author flex">                <span>by {item.author_name}</span>
                <span>{item.time}</span>
              </div>            </div>          </div>        ))      )}
    </>  );
};

export default Card;
