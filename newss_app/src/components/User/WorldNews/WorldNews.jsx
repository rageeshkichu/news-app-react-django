import React from 'react';
import SinglePageSlider from '../../singlePage/slider/SinglePageSlider';
import UserNavbar from '../Navbar/UserNavbar';
import Side from '../../home/sideContent/side/Side';
import '../GeneralNews/GeneralNews.css'
import World from './World';
import Footer from '../../common/footer/Footer';

function WorldNews() {
  return (
    <div>
      <UserNavbar />
      <br />
      <br />
      <br />
      <SinglePageSlider />
      <div className="main-container">
        <section className="main-content">
          <World />
        </section>
        <section className="sideContent">
          <Side />
        </section>
      </div>
      <Footer/>
    </div>
  );
}

export default WorldNews;
