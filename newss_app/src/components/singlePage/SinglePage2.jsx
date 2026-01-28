import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ppost } from "../../dummyData"; 
import Side from "../home/sideContent/side/Side";
import "../home/mainContent/homes/style.css";
import "./singlepage.css";
import "../home/sideContent/side/side.css";
import SinglePageSlider from "./slider/SinglePageSlider";
import Footer from "../common/footer/Footer";

const SinglePage2 = () => {
  const { id } = useParams(); 
  const [item, setItem] = useState(null); 

  useEffect(() => {
    
    const selectedItem = ppost.find((item) => item.id === parseInt(id));
    window.scrollTo(0, 0); 
    if (selectedItem) {
      setItem(selectedItem); 
    }
  }, [id]);

  return (    <>      {item ? (
        <main>          <SinglePageSlider />          <div className="container">            <section className="mainContent details">              <h1 className="title">{item.title}</h1>

              <div className="author">                <span>by</span>                <img src={item.authorImg || "../images/default-author.jpg"} alt="" />
                <p> {item.authorName || "Unknown Author"} on</p>
                <label>{item.time}</label>
              </div>              <div className="social">                <div className="socBox">                  <i className="fab fa-facebook-f"></i>                  <span>SHARE</span>                </div>                <div className="socBox">                  <i className="fab fa-twitter"></i>                  <span>TWITTER</span>                </div>                <div className="socBox">                  <i className="fab fa-pinterest"></i>                </div>                <div className="socBox">                  <i className="fa fa-envelope"></i>                </div>              </div>              {}
              <div className="desctop">                {item.desc.map((paragraph, index) => (
                  <div key={index}>
                    <p>{paragraph.para1}</p>
                    <p>{paragraph.para2}</p>
                  </div>                ))}
              </div>              {}
              <img src={item.cover} alt="Post Cover" />

              {}
              <div className="desctop">                {item.desc.map((paragraph, index) => (
                  <div key={index}>
                    <p>{paragraph.para3}</p>
                  </div>                ))}
              </div>            </section>            <section className="sideContent">              <Side />            </section>          </div>        </main>      ) : (        <h1>Not Found</h1>      )}
      <Footer/>    </>  );
};

export default SinglePage2;
