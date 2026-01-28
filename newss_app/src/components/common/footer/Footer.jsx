import React from "react";
import "./footer.css";

const Footer = () => {
  return (
    <>
      <footer>
        <div className="container">
          {/* Logo and Contact Information */}
          <div className="box logo">
            <img src="../images/tech-logo-footer.png" alt="Footer Logo" />
            <p>
              A modern and customizable theme designed to meet your needs.
            </p>
            <div className="contact-info">
              <i className="fa fa-envelope"></i>
              <span> hello@company.com </span> <br />
              <i className="fa fa-headphones"></i>
              <span> +91 60521488</span>
            </div>
          </div>
          {/* Quick Links */}
          <div className="box">
            <h3>QUICK LINKS</h3>
            <ul>
              <li>
                <span>About Us</span>
              </li>
              <li>
                <span>Contact</span>
              </li>
              <li>
                <span>Privacy Policy</span>
              </li>
              <li>
                <span>Terms of Service</span>
              </li>
            </ul>
          </div>
          {/* Categories */}
          <div className="box">
            <h3>CATEGORIES</h3>
            <ul>
              <li>
                <span>Technology</span>
              </li>
              <li>
                <span>Health</span>
              </li>
              <li>
                <span>Lifestyle</span>
              </li>
              <li>
                <span>Business</span>
              </li>
            </ul>
          </div>
          {/* Social Media Links */}
          <div className="box">
            <h3>FOLLOW US</h3>
            <div className="box">
            <ul>
              <li>
                <span>Facebook</span>
              </li>
              <li>
                <span>Twitter</span>
              </li>
              <li>
                <span>Instagram</span>
              </li>
            </ul>
          </div>
          </div>
        </div>
      </footer>
      <div className="legal">
        <div className="container flexSB">
          <p>© {new Date().getFullYear()} All Rights Reserved</p>
          <p>News24</p>
        </div>
      </div>
    </>
  );
};

export default Footer;
