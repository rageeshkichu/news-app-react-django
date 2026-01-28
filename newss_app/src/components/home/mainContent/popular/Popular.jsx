import React, { useState, useEffect } from "react";
import "./Popular.css";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Link } from "react-router-dom";
import axios from "axios";
import Heading from "../../../common/heading/Heading";

const Popular = () => {
  const [popular, setPopular] = useState([]);

  const settings = {
    infinite: true,
    slidesToShow: 2, // Number of columns
    slidesToScroll: 1,
    speed: 500,
    rows: 2, // Number of rows
    slidesPerRow: 1, // Items per row
    responsive: [
      {
        breakpoint: 800,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          rows: 2,
        },
      },
    ],
  };

  useEffect(() => {
    const fetchAllNews = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/news/");
        setPopular(response.data.news || []);
      } catch (error) {
        console.error("Error fetching news:", error);
      }
    };

    fetchAllNews();
  }, []);

  return (
    <section className="popular">
      <Heading title="Latest" />
      <div className="content">
        <Slider {...settings}>
          {Array.isArray(popular) &&
            popular.map((newsItem) => {
              // Check if user_id exists in sessionStorage
              const userId = sessionStorage.getItem("user_id");

              // Conditionally set the redirect path
              const redirectTo = userId
                ? `/news-detail/${newsItem.id}`
                : "/login";

              return (
                <div className="items" key={newsItem.id}>
                  <Link
                    to={redirectTo} // Set the path dynamically based on user_id
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    <div className="box shadow">
                      <div className="images row">
                        <div className="img">
                          <img
                            src={newsItem.image_url}
                            alt={newsItem.title}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "/default-image.jpg";
                            }}
                          />
                        </div>
                        <div className="category category1">
                          <span>{newsItem.category}</span>
                        </div>
                      </div>
                      <div className="text row">
                        <h1 className="title">
                          {newsItem.title.length > 40
                            ? `${newsItem.title.slice(0, 40)}...`
                            : newsItem.title}
                        </h1>
                        <div className="author">
                          <i className="fas fa-user"></i>
                          <label>{newsItem.author_name}</label>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              );
            })}
        </Slider>
      </div>
    </section>
  );
};

export default Popular;
