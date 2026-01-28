import React from "react";
import { Link } from "react-router-dom";

const UserNavbar = () => {
  const categories = [
    { name: "General", link: "/news/general" },
    { name: "Politics", link: "/news/politics" },
    { name: "Sports", link: "/news/sports" },
    { name: "Technology", link: "/news/technology" },
    { name: "Health", link: "/news/health" },
    { name: "Local News", link: "/news/local" },
    { name: "World News", link: "/news/world" },
  ];

  return (
    <div>
      <nav
        className="navbar fixed-top navbar-expand-lg navbar-dark bg-black example"
        data-bs-theme="dark"
      >
        <div className="container-fluid">
          {/* Added ms-3 to create space on the left */}
          <Link className="navbar-brand ms-3" style={{ fontSize: "25px" }} to="/">
            News 24
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div
            className="collapse navbar-collapse nav-center"
            id="navbarSupportedContent"
          >
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link className="nav-link" aria-current="page" to="/user-home">
                  Home
                </Link>
              </li>

              {/* Dropdown for News Categories */}
              <li className="nav-item dropdown">
                <Link
                  className="nav-link dropdown-toggle"
                  to="/"
                  id="navbarDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  News
                </Link>
                <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                  {categories.map((category, index) => (
                    <li key={index}>
                      <Link className="dropdown-item" to={category.link}>
                        {category.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
            </ul>

            {/* Account menu with space on the right */}
            <ul className="navbar-nav ms-auto me-3">
              <li className="nav-item">
                <Link className="nav-link" to="/user-profile">
                  Account
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default UserNavbar;
