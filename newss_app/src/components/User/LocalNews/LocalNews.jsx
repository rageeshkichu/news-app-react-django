import React from 'react';
import SinglePageSlider from '../../singlePage/slider/SinglePageSlider';
import UserNavbar from '../Navbar/UserNavbar';
import Side from '../../home/sideContent/side/Side';
import '../GeneralNews/GeneralNews.css'
import Local from './Local';
import Footer from '../../common/footer/Footer';

function LocalNews() {
  return (
    <div>
      <UserNavbar />
      <br />
      <br />
      <br />
      <SinglePageSlider />
      <div className="main-container">
        <section className="main-content">
          <Local />
        </section>
        <section className="sideContent">
          <Side />
        </section>
      </div>
      <Footer/>
    </div>
  );
}

export default LocalNews;
