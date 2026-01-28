import React from 'react';
import SinglePageSlider from '../../singlePage/slider/SinglePageSlider';
import UserNavbar from '../Navbar/UserNavbar';
import Side from '../../home/sideContent/side/Side';
import '../GeneralNews/GeneralNews.css'
import Sports from './Sports';
import Footer from '../../common/footer/Footer';

function SportsNews() {
  return (
    <div>
      <UserNavbar />
      <br />
      <br />
      <br />
      <SinglePageSlider />
      <div className="main-container">
        <section className="main-content">
          <Sports />
        </section>
        <section className="sideContent">
          <Side />
        </section>
      </div>
      <Footer/>
    </div>
  );
}

export default SportsNews;
