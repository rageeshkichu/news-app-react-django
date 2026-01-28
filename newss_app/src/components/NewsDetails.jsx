import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './NewsDetails.css';
import SinglePageSlider from './singlePage/slider/SinglePageSlider';
import Side from './home/sideContent/side/Side';
import Footer from './common/footer/Footer'; 
import UserNavbar from './User/Navbar/UserNavbar';

function NewsDetails() {
  const { id } = useParams();
  const [newsDetail, setNewsDetail] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchNewsDetail = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/newsdetails/${id}/`);
        setNewsDetail(response.data);
        window.scrollTo(0, 0);
      } catch (error) {
        setErrorMessage('Failed to fetch news details. Please try again later.');
      }
    };

    fetchNewsDetail();
  }, [id]);

  if (errorMessage) {
    return <div className="alert alert-danger">{errorMessage}</div>;
  }

  if (!newsDetail) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <UserNavbar />
      <br />
      <br />
      <br />
      <SinglePageSlider />
      <main>
        <div className="news-details-container">
          <section className="news-details-mainContent details">
            <h1 className="news-details-title">{newsDetail.title}</h1>

            <div className="news-details-author">
              <span>by</span>
              <img
                src={newsDetail.author_image || './default-author.jpg'}
                alt="Author"
              />
              <p>{newsDetail.author_name || 'Unknown Author'}</p>
              <label>
                on {new Date(newsDetail.date_published).toLocaleDateString()} - {newsDetail.place}
              </label>
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

            <div className="desctop">
              <p>{newsDetail.description}</p>
            </div>

            <img
              src={newsDetail.image_url}
              alt={newsDetail.title}
              className="news-details-image"
            />

            <div
              className="news-details-content"
              dangerouslySetInnerHTML={{ __html: newsDetail.content }}
            ></div>
          </section>

          <section className="news-details-sideContent">
            <Side />
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default NewsDetails;
