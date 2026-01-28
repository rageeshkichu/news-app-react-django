import React, { useEffect, useState } from "react";
import api from "../api/client";
import { Link } from "react-router-dom";
import "./AdminViewNews.css";
import AdminNav from "./AdminNav";
import Footer from "./common/footer/Footer";

function AdminViewNews() {
  const [newsList, setNewsList] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState(""); // State for success popup
  
  useEffect(() => {
    // Fetch the list of news on component mount
    const fetchNews = async () => {
      try {
        const response = await api.get("/api/news/");
        setNewsList(response.data.news); // Assuming response contains a 'news' array
      } catch (error) {
        setErrorMessage("Failed to fetch news. Please try again later.");
        console.error(error);
      }
    };

    fetchNews();
  }, []);

  // Function to handle news deletion
  const handleDelete = async (id) => {
    try {
      await api.delete(`/api/news/${id}/`);
      setNewsList(newsList.filter((news) => news.id !== id)); // Update state after deletion
      setSuccessMessage("News deleted successfully!"); // Show success popup
      setTimeout(() => {
        setSuccessMessage(""); // Hide popup after 3 seconds
      }, 3000);
    } catch (error) {
      console.error("Failed to delete news:", error);
      setErrorMessage("Failed to delete news. Please try again.");
    }
  };

  return (
    <>
      <AdminNav />
      <div className="admin-view-news">
        <h2 className="text-center">Admin - View News</h2>
        {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
        {successMessage && (
          <div className="alert alert-success popup-success">{successMessage}</div>
        )}
        <div className="news-cards-container">
          {newsList.map((news) => (
            <div key={news.id} className="news-cardd">
              <img src={news.image_url} alt={news.title} className="news-image" />
              <h3 className="news-title">Title: {news.title}</h3>
              <p className="news-category">
                <strong>Category:</strong> {news.category}
              </p>
              <p className="news-author">
                <strong>Author:</strong> {news.author_name}
              </p>
              <p className="news-time">
                <strong>Time:</strong> {news.time}
              </p>
              <p className="news-place">
                <strong>Place:</strong> {news.place}
              </p>
              <p className="news-description">Description: {news.description}</p>
              <p className="news-content">Content: {news.content}</p>
              <div className="news-card-actions">
                <Link to={`/edit-news/${news.id}`} className="btn btn-primary">
                  Edit
                </Link>
                <button
                  className="btn btn-danger"
                  onClick={() => handleDelete(news.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
}

export default AdminViewNews;
