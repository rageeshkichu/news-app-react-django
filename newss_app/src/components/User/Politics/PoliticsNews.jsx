import React from 'react';
import SinglePageSlider from '../../singlePage/slider/SinglePageSlider';
import UserNavbar from '../Navbar/UserNavbar';
import Side from '../../home/sideContent/side/Side';
import '../GeneralNews/GeneralNews.css'import Politics from './Politics';
import Footer from '../../common/footer/Footer';

function PoliticsNews() {
  return (    <div>      <UserNavbar />      <br />      <br />      <br />      <SinglePageSlider />      <div className="main-container">        <section className="main-content">          <Politics />        </section>        <section className="sideContent">          <Side />        </section>      </div>      <Footer/>    </div>  );
}

export default PoliticsNews;
