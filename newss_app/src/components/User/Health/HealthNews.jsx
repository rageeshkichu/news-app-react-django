import React from 'react';
import SinglePageSlider from '../../singlePage/slider/SinglePageSlider';
import UserNavbar from '../Navbar/UserNavbar';
import Side from '../../home/sideContent/side/Side';
import '../GeneralNews/GeneralNews.css'import Health from './Health';
import Footer from '../../common/footer/Footer';

function HealthNews() {
  return (    <div>      <UserNavbar />      <br />      <br />      <br />      <SinglePageSlider />      <div className="main-container">        <section className="main-content">          <Health />        </section>        <section className="sideContent">          <Side />        </section>      </div>      <Footer/>    </div>  );
}

export default HealthNews;
