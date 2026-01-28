import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import { Link } from "react-router-dom";
import api from "../../../../api/client";
import Heading from "../../../common/heading/Heading";
import "./ppost.css";

const Ppost = () => {
  const [localNews, setLocalNews] = useState([]);

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 2, // Number of columns
    slidesToScroll: 1,
    rows: 2, // Number of rows
  };

  useEffect(() => {
    const fetchLocalNews = async () => {
      try {
        const response = await api.get("/api/news/");
        const filteredNews = response.data.news.filter(
          (newsItem) => newsItem.category.toLowerCase() === "general"
        );
        setLocalNews(filteredNews);
      } catch (error) {
        console.error("Error fetching local news:", error);
      }
    };

    fetchLocalNews();
  }, []);

  return (
    <>
      <section className="popularPost">
        <Heading title="General News" />
        <div className="content">
          <Slider {...settings}>
            {localNews.map((newsItem) => (
              <div className="items" key={newsItem.id}>
                <Link to={`/singlepage2/${newsItem.id}`} className="card-link">
                  <div className="box shadow">
                    <div className="images">
                      <div className="img">
                        <img
                          src={newsItem.image_url}
                          alt={newsItem.title}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "/default-image.jpg"; // Fallback image
                          }}
                        />
                      </div>
                      <div className="category category1">
                        <span>{newsItem.category}</span>
                      </div>
                    </div>
                    <div className="text">
                      <h1 className="title">
                        {newsItem.title.length > 40
                          ? `${newsItem.title.slice(0, 40)}...`
                          : newsItem.title}
                      </h1>
                      <div className="date">
                        <i className="fas fa-calendar-days"></i>
                        <label>{newsItem.time}</label>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </Slider>
        </div>
      </section>
    </>
  );
};

export default Ppost;
