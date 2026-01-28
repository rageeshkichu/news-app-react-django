import React from 'react';
import SinglePageSlider from '../../singlePage/slider/SinglePageSlider';
import UserNavbar from '../Navbar/UserNavbar';
import Side from '../../home/sideContent/side/Side';
import General from './General';
import './GeneralNews.css'
import Footer from '../../common/footer/Footer';

function GeneralNews() {
  return (
    <div>
      <UserNavbar />
      <br />
      <br />
      <br />
      <SinglePageSlider />
      <div className="main-container">
        <section className="main-content">
          <General />
        </section>
        <section className="sideContent">
          <Side />
        </section>
      </div>
      <Footer/>
    </div>
  );
}

export default GeneralNews;
