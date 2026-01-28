import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { lifestyle } from "../../dummyData"; // Import the ppost data
import Side from "../home/sideContent/side/Side";
import "../home/mainContent/homes/style.css";
import "./singlepage.css";
import "../home/sideContent/side/side.css";
import SinglePageSlider from "./slider/SinglePageSlider";
import Footer from "../common/footer/Footer";

const SinglePage3 = () => {
  const { id } = useParams(); // Get the ID from the URL params
  const [item, setItem] = useState(null); // State to hold the selected item

  useEffect(() => {
    // Find the item in ppost using the ID
    const selectedItem = lifestyle.find((item) => item.id === parseInt(id));
    window.scrollTo(0, 0); // Scroll to the top of the page when the component loads
    if (selectedItem) {
      setItem(selectedItem); // Set the selected item
    }
  }, [id]);

  return (
    <>
      {item ? (
        <main>
          <SinglePageSlider />
          <div className="container">
            <section className="mainContent details">
              <h1 className="title">{item.title}</h1>

              <div className="author">
                <span>by</span>
                <img src={item.authorImg || "../images/default-author.jpg"} alt="" />
                <p> {item.authorName || "Unknown Author"} on</p>
                <label>{item.time}</label>
              </div>

              <div className="social">
                <div className="socBox">
                  <i className="fab fa-facebook-f"></i>
                  <span>SHARE</span>
                </div>
                <div className="socBox">
                  <i className="fab fa-twitter"></i>
                  <span>TWITTER</span>
                </div>
                <div className="socBox">
                  <i className="fab fa-pinterest"></i>
                </div>
                <div className="socBox">
                  <i className="fa fa-envelope"></i>
                </div>
              </div>

              {/* Paragraphs before the image */}
              <div className="desctop">
                {item.desc.map((paragraph, index) => (
                  <div key={index}>
                    <p>{paragraph.para1}</p>
                    <p>{paragraph.para2}</p>
                  </div>
                ))}
              </div>

              {/* Display the image */}
              <img src={item.cover} alt="Post Cover" />

              {/* Paragraphs after the image */}
              <div className="desctop">
                {item.desc.map((paragraph, index) => (
                  <div key={index}>
                    <p>{paragraph.para3}</p>
                  </div>
                ))}
              </div>
            </section>
            <section className="sideContent">
              <Side />
            </section>
          </div>
        </main>
      ) : (
        <h1>Not Found</h1>
      )}
      <Footer/>
    </>
  );
};

export default SinglePage3;
