import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import { Link } from "react-router-dom";
import axios from "axios";
import "./style.css";

const SinglePageSlider = () => {
  const [news, setNews] = useState([]); // State to store news data

  // Custom arrow components
  const CustomPrevArrow = ({ onClick }) => (
    <button className="slick-prev" onClick={onClick}>
      &#9664; {/* Unicode for left arrow */}
    </button>
  );

  const CustomNextArrow = ({ onClick }) => (
    <button className="slick-next" onClick={onClick}>
      &#9654; {/* Unicode for right arrow */}
    </button>
  );

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 7,
    slidesToScroll: 2,
    prevArrow: <CustomPrevArrow />,
    nextArrow: <CustomNextArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 5,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
    ],
  };
  

  // Fetch data from the API
  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/news/");
        setNews(response.data.news || []); // Assuming news is in the `news` key of the response
      } catch (error) {
        console.error("Error fetching news data:", error);
      }
    };

    fetchNews();
  }, []);

  return (
    <section className="singlePopular">
      <div className="content">
        <Slider {...settings}>
          {news.map((item) => (
            <div className="items" key={item.id}>
              <Link to={`/news-detail/${item.id}`}>
                <div className="box">
                  <div className="images">
                    <img src={item.image_url} alt={item.title} /> {/* Adjust property names as per API */}
                  </div>
                  <div className="text">
                    <h1 className="title">{item.title}</h1>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
};

export default SinglePageSlider;
