import React from "react";
import { Link } from "react-router-dom";
import './Navbar.css'
<style>
	
</style>

const Navbar = () => {
	return (
		<div>
			<nav className="navbar fixed-top navbar-expand-lg navbar-dark bg-black example" data-bs-theme="dark">
				<div className="container-fluid">
					<Link className="navbar-brand" style={{ fontSize: "25px",marginLeft:'20px' }} to="/">
						News 24
					</Link>
					<button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
						<span className="navbar-toggler-icon"></span>
					</button>
					<div className="collapse navbar-collapse nav-center " id="navbarSupportedContent">
						<ul className="navbar-nav me-auto mb-2 mb-lg-0">
							<li className="nav-item ">
								<Link className="nav-link" aria-current="page" to="/home">
									Home
								</Link>
							</li>
							<li className="nav-item">
								<Link className="nav-link " to="/login">
									Login
								</Link>
							</li>
						</ul>
					</div>
				</div>
			</nav>
		</div>
	);
};

export default Navbar;
