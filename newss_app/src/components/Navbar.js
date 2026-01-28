import React, { useState } from "react";
import { Link } from "react-router-dom";
import ModernLogo from "./common/header/ModernLogo";
import './Navbar.css'const Navbar = () => {
	const [isOpen, setIsOpen] = useState(false);

	const toggleMenu = () => {
		setIsOpen(!isOpen);
	};

	return (		<nav className="navbar-professional">			<div className="navbar-container">				{}
				<Link to="/" className="navbar-logo-link">					<div className="navbar-logo">						<ModernLogo width="180" height="50" navBar={true} />
					</div>				</Link>				{}
				<button 					className={`navbar-toggle ${isOpen ? 'active' : ''}`}
					onClick={toggleMenu}
					aria-label="Toggle navigation"				>					<span className="hamburger-line"></span>					<span className="hamburger-line"></span>					<span className="hamburger-line"></span>				</button>				{}
				<div className={`navbar-menu ${isOpen ? 'active' : ''}`}>
					<ul className="navbar-nav">						<li className="navbar-item">							<Link 								to="/home" 								className="navbar-link"								onClick={() => setIsOpen(false)}
							>								<span className="nav-icon">🏠</span>								Home							</Link>						</li>						<li className="navbar-item">							<Link 								to="/login" 								className="navbar-link"								onClick={() => setIsOpen(false)}
							>								<span className="nav-icon">🔐</span>								Login							</Link>						</li>						<li className="navbar-item">							<Link 								to="/" 								className="navbar-link"								onClick={() => setIsOpen(false)}
							>								<span className="nav-icon">📰</span>								News							</Link>						</li>					</ul>					{}
					<div className="navbar-cta">						<Link to="/login" className="cta-button">							Subscribe						</Link>					</div>				</div>			</div>		</nav>	);
};

export default Navbar;
