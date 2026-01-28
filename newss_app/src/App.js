import "./App.css";
import "./index.css";
import React from "react";
import Navbar from "./components/Navbar";
import News from "./components/News";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoadingBar from "react-top-loading-bar";
import { useState } from "react";
import LoginPage from "./components/LoginPage";
import AdminHome from "./components/adminHome";
import AdminNav from "./components/AdminNav";
import AddNews from "./components/AddNews";
import AddAdv from "./components/AddAdv";
import AdminViewNews from "./components/AdminViewNews";
import EditNews from "./components/EditNews";
import EditAdv from "./components/EditAdv";
import AdminViewAds from "./components/ViewAdv";
import NewsDetails from "./components/NewsDetails";
import HomePage from "./components/HomePage";
import SinglePage from "./components/singlePage/SinglePage";
import UserRegister from "./components/User/Registration/UserRegister";
import UserHome from "./components/User/Home/UserHome";
import GeneralNews from "./components/User/GeneralNews/GeneralNews";
import Politics from "./components/User/Politics/Politics";
import PoliticsNews from "./components/User/Politics/PoliticsNews";
import SportsNews from "./components/User/Sports/SportsNews";
import TechnologyNews from "./components/User/Technology/TechnologyNews";
import HealthNews from "./components/User/Health/HealthNews";
import LocalNews from "./components/User/LocalNews/LocalNews";
import WorldNews from "./components/User/WorldNews/WorldNews";
import UserProfile from "./components/User/UserProfile/UserProfile";
import SinglePage2 from "./components/singlePage/SinglePage2";
import SinglePage3 from "./components/singlePage/SinglePage3";

const App = () => {
	const pageSize = 9;
	const apiKey = process.env.REACT_APP_NEWS_API;
	const [progress, setProgress] = useState(0);

	return (
		<div>
			<Router>
				{/* <Navbar /> */}
				<div>
					<LoadingBar color="#f11946" progress={progress} height={3} />
				</div>
				<Routes>
					<Route path="/" element={<HomePage/>}></Route>
					<Route path="/login" element={<LoginPage/>}></Route>
					<Route path="/login/admin-home" element={<AdminHome />}></Route>
					<Route path="/AdminNav" element={<AdminNav />}></Route>
					<Route path="/AddNews" element={<AddNews />}></Route>
					<Route path="/AddAdv" element={<AddAdv />}></Route>
					<Route path="/ViewNews" element={<AdminViewNews />}></Route>
					<Route path="/ViewAdv" element={<AdminViewAds />}></Route>
					<Route path="/edit-news/:id" element={<EditNews />}></Route>
					<Route path="/edit-adv/:id" element={<EditAdv />}></Route>
					<Route path="/news-detail/:id" element={<NewsDetails />} />
					<Route path="/home" element={<HomePage />} />
					<Route path="/SinglePage/:id" element={<SinglePage />} />
					<Route path="/SinglePage2/:id" element={<SinglePage2 />} />
					<Route path="/SinglePage3/:id" element={<SinglePage3 />} />
					<Route path="/user-register" element={<UserRegister />} />
					<Route path="/user-home" element={<UserHome />} />
					<Route path="/news/general" element={<GeneralNews />} />
					<Route path="/news/politics" element={<PoliticsNews/ >} />
					<Route path="/news/sports" element={<SportsNews/ >} />
					<Route path="/news/technology" element={<TechnologyNews/ >} />
					<Route path="/news/health" element={<HealthNews/ >} />
					<Route path="/news/local" element={<LocalNews/ >} />
					<Route path="/news/world" element={<WorldNews/ >} />
					<Route path="/user-profile" element={<UserProfile/ >} />
				</Routes>
			</Router>
		</div>
	);
};

export default App;
