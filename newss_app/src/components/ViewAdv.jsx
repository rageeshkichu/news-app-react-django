import React, { useEffect, useState } from "react";
import api from "../api/client";
import { Link } from "react-router-dom";
import "./AdminViewAds.css";
import AdminNav from "./AdminNav";
import Footer from "./common/footer/Footer";

function AdminViewAds() {
  const [adsList, setAdsList] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState(""); // State for success popup

  useEffect(() => {
    // Fetch the list of ads on component mount
    const fetchAds = async () => {
      try {
        const response = await api.get("/api/ads/");
        setAdsList(response.data.ads); // Assuming response contains an 'ads' array
      } catch (error) {
        setErrorMessage("Failed to fetch ads. Please try again later.");
        console.error(error);
      }
    };

    fetchAds();
  }, []);

  // Function to handle ad deletion
  const handleDelete = async (id) => {
    try {
      await api.delete(`/api/ads/${id}/`);
      setAdsList(adsList.filter((ad) => ad.id !== id)); // Update state after deletion
      setSuccessMessage("Ad deleted successfully!"); // Show success popup
      setTimeout(() => {
        setSuccessMessage(""); // Hide popup after 3 seconds
      }, 3000);
    } catch (error) {
      console.error("Failed to delete ad:", error);
      setErrorMessage("Failed to delete ad. Please try again.");
    }
  };

  return (
    <>
      <AdminNav />
      <div className="admin-view-ads">
        <h2 className="text-center">Admin - View Ads</h2>
        {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
        {successMessage && (
          <div className="alert alert-success popup-success">{successMessage}</div>
        )}
        <div className="ads-cards-container">
          {adsList.map((ad) => (
            <div key={ad.id} className="ad-card">
              <img src={ad.image_url} alt={ad.title} className="ad-image" />
              <h3 className="ad-title">Title: {ad.title}</h3>
              <p className="ad-description">Description: {ad.description}</p>
              <p className="ad-content">Content: {ad.content}</p>
              <div className="ad-card-actions">
                <Link to={`/edit-adv/${ad.id}`} className="btn btn-primary">
                  Edit
                </Link>
                <button
                  className="btn btn-danger"
                  onClick={() => handleDelete(ad.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer/>
    </>
  );
}

export default AdminViewAds;
