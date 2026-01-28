import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { hero, popular } from "../../dummyData"; // Assuming hero and popular are arrays
import Side from "../home/sideContent/side/Side";
import "./singlepage.css";
import "../home/sideContent/side/side.css";
import SinglePageSlider from "./slider/SinglePageSlider";
import Footer from "../common/footer/Footer";

const SinglePage = () => {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [isHero, setIsHero] = useState(false);

  useEffect(() => {
    // Search both hero and popular lists for the item with matching id
    const foundItem = hero.find((item) => item.id === parseInt(id));
    if (foundItem) {
      setItem(foundItem);
      setIsHero(true); // Indicates the item is from the hero array
    } else {
      const popularItem = popular.find((item) => item.id === parseInt(id));
      if (popularItem) {
        setItem(popularItem);
        setIsHero(false); // Indicates the item is from the popular array
      }
    }
    window.scrollTo(0, 0);
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
                <img src={item.authorImg} alt="" />
                <p> {item.authorName} on</p>
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

              {/* Render `desc` differently based on whether the item is from hero or popular */}
              <div className="desctop">
                {isHero ? (
                  item.desc.map((val, index) => (
                    <React.Fragment key={index}>
                      <p>{val.para1}</p>
                      <p>{val.para2}</p>
                    </React.Fragment>
                  ))
                ) : (
                  <p>{item.desc}</p> // For popular, `desc` is a single value
                )}
              </div>
              <img src={item.cover} alt="" />
              {isHero &&
                item.desc.map((val, index) => <p key={index}>{val.para3}</p>)}

              {/* Render `details` only if the item is from hero */}
              {isHero && (
                <>
                  <div className="descbot">
                    {item.details.map((data, index) => (
                      <React.Fragment key={index}>
                        <h1>{data.title}</h1>
                        <p>{data.para1}</p>
                      </React.Fragment>
                    ))}
                  </div>

                  <div className="quote">
                    <i className="fa fa-quote-left"></i>
                    {item.details.map((data, index) => (
                      <p key={index}>{data.quote}</p>
                    ))}
                  </div>

                  <div className="desctop">
                    {item.details.map((data, index) => (
                      <React.Fragment key={index}>
                        <p>{data.para2}</p>
                        <p>{data.para3}</p>
                      </React.Fragment>
                    ))}
                  </div>
                </>
              )}
            </section>
            <section className="sideContent">
              <Side />
            </section>
          </div>
        </main>
      ) : (
        <h1>not found</h1>
      )}
      <Footer/>
    </>
  );
};

export default SinglePage;
