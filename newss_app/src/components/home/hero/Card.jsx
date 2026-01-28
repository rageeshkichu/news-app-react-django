import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Card = () => {
  const [news, setNews] = useState([]); // State to store news data

  useEffect(() => {
    console.log("useEffect triggered"); // Debugging: Check if useEffect runs only once
    
    const fetchNews = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/news/");

        // Check if the response data is as expected
        console.log("Fetched news:", response.data);

        // Only update the state if the response is valid
        if (response.data && Array.isArray(response.data.news)) {
          // Slice the first 4 news items directly here
          const firstFourNews = response.data.news.slice(0, 4);
          
          // Update the state with the first 4 items
          setNews(firstFourNews); 
        } else {
          console.error("News data is not in the expected format.");
        }
      } catch (error) {
        console.error("Error fetching news:", error);
      }
    };

    fetchNews(); // Run fetchNews on component mount
  }, []); // Empty dependency array to run the effect only once

  return (
    <>
      {news.length === 0 ? (
        <p>Loading news...</p> // Show loading text if news is empty
      ) : (
        // Only map through the first 4 news items
        news.map((item) => (
          <div className="box" style={{ position: "relative" }} key={item.id}>
            {/* Wrap the card in a Link to navigate */}
            <Link
              to={`/SinglePage/${item.id}`}
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
                <span>{item.time}</span>
              </div>
            </div>
          </div>
        ))
      )}
    </>
  );
};

export default Card;
