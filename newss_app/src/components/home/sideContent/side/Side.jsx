import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../../api/client";
import "./side.css";
import Slider from "react-slick";
import Heading from "../../../common/heading/Heading";
import Tpost from "../Tpost/Tpost";
import SocialMedia from "../social/SocialMedia";

const Side = () => {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [ads, setAds] = useState([]); // State for ads
  const [galleryImages, setGalleryImages] = useState([]); // State for gallery images
  const navigate = useNavigate();

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  const catgeory = [
    "General",
    "Politics",
    "Health",
    "Technology",
    "Sports",
    "Local",
    "World",
  ];

  useEffect(() => {
    // Fetch ads from API
    const fetchAds = async () => {
      try {
        const response = await api.get("/api/ads/");
        setAds(response.data.ads || []); // Assuming ads are in the `ads` key of the response
      } catch (error) {
        console.error("Error fetching ads:", error);
      }
    };

    // Fetch gallery images from API
    const fetchGalleryImages = async () => {
      try {
        const response = await api.get("/api/news/");
        setGalleryImages(response.data.news || []); // Assuming news images are in the `news` key
      } catch (error) {
        console.error("Error fetching gallery images:", error);
      }
    };

    fetchAds();
    fetchGalleryImages();
  }, []);

  const handleSubscribe = (e) => {
    e.preventDefault();
    setIsSubscribed(true);
    setTimeout(() => {
      setIsSubscribed(false);
    }, 3000);
  };

  const handleCategoryClick = (category) => {
    const userId = sessionStorage.getItem("user_id");
    if (userId) {
      navigate(`/news/${category.toLowerCase()}`);
    } else {
      navigate("/login");
    }
  };

  return (
    <>
      <Heading title="Stay Connected" />
      <SocialMedia />

      <Heading title="Subscribe" />

      <section className="subscribe">
        <h1 className="title">Subscribe to our New Stories</h1>
        <form onSubmit={handleSubscribe}>
          <input type="email" placeholder="Email Address..." required />
          <button type="submit">
            <i className="fa fa-paper-plane"></i> SUBMIT
          </button>
        </form>
        {isSubscribed && (
          <div className="popup">
            <p>You have subscribed to our new stories!</p>
          </div>
        )}
      </section>

      <section className="banner">
        <p>Advertise here</p>
        {ads.length > 0 ? (
          ads.map((ad, index) => (
            <div className="ad-item" key={index}>
              <img src={ad.image_url} alt={`Ad ${index + 1}`} />
              <p>{ad.title}</p>
            </div>
          ))
        ) : (
          <p>Loading ads...</p>
        )}
      </section>

      <Tpost />

      <section className="catgorys">
        <Heading title="Catgeorys" />
        {catgeory.map((val) => (
          <div
            className="category category1"
            key={val}
            onClick={() => handleCategoryClick(val)}
          >
            <span>{val}</span>
          </div>
        ))}
      </section>

      <section className="gallery">
        <Heading title="Gallery" />
        <Slider {...settings}>
          {galleryImages.length > 0 ? (
            galleryImages.map((item, index) => (
              <div className="img" key={index}>
                <img src={item.image_url} alt={item.title || `Gallery ${index + 1}`} />
              </div>
            ))
          ) : (
            <p>Loading gallery...</p>
          )}
        </Slider>
      </section>
    </>
  );
};

export default Side;
