import "./App.css";
import "./index.css";
import React, { Suspense, lazy, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoadingBar from "react-top-loading-bar";
import LoadingFallback from "./components/LoadingFallback";
import HomePage from "./components/HomePage";
import LoginPage from "./components/LoginPage";

const AdminHome = lazy(() => import("./components/adminHome"));
const AdminNav = lazy(() => import("./components/AdminNav"));
const AddNews = lazy(() => import("./components/AddNews"));
const AddAdv = lazy(() => import("./components/AddAdv"));
const AdminViewNews = lazy(() => import("./components/AdminViewNews"));
const EditNews = lazy(() => import("./components/EditNews"));
const EditAdv = lazy(() => import("./components/EditAdv"));
const AdminViewAds = lazy(() => import("./components/ViewAdv"));
const NewsDetails = lazy(() => import("./components/NewsDetails"));
const SinglePage = lazy(() => import("./components/singlePage/SinglePage"));
const SinglePage2 = lazy(() => import("./components/singlePage/SinglePage2"));
const SinglePage3 = lazy(() => import("./components/singlePage/SinglePage3"));
const UserRegister = lazy(() => import("./components/User/Registration/UserRegister"));
const UserHome = lazy(() => import("./components/User/Home/UserHome"));
const GeneralNews = lazy(() => import("./components/User/GeneralNews/GeneralNews"));
const PoliticsNews = lazy(() => import("./components/User/Politics/PoliticsNews"));
const SportsNews = lazy(() => import("./components/User/Sports/SportsNews"));
const TechnologyNews = lazy(() => import("./components/User/Technology/TechnologyNews"));
const HealthNews = lazy(() => import("./components/User/Health/HealthNews"));
const LocalNews = lazy(() => import("./components/User/LocalNews/LocalNews"));
const WorldNews = lazy(() => import("./components/User/WorldNews/WorldNews"));
const UserProfile = lazy(() => import("./components/User/UserProfile/UserProfile"));

const App = () => {
  const [progress, setProgress] = useState(0);

  return (
    <Router>
      <LoadingBar color="#f11946" progress={progress} height={3} />
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/login/admin-home" element={<AdminHome />} />
          <Route path="/AdminNav" element={<AdminNav />} />
          <Route path="/AddNews" element={<AddNews />} />
          <Route path="/AddAdv" element={<AddAdv />} />
          <Route path="/ViewNews" element={<AdminViewNews />} />
          <Route path="/ViewAdv" element={<AdminViewAds />} />
          <Route path="/edit-news/:id" element={<EditNews />} />
          <Route path="/edit-adv/:id" element={<EditAdv />} />
          <Route path="/user-register" element={<UserRegister />} />
          <Route path="/user-home" element={<UserHome />} />
          <Route path="/user-profile" element={<UserProfile />} />
          <Route path="/news/general" element={<GeneralNews />} />
          <Route path="/news/politics" element={<PoliticsNews />} />
          <Route path="/news/sports" element={<SportsNews />} />
          <Route path="/news/technology" element={<TechnologyNews />} />
          <Route path="/news/health" element={<HealthNews />} />
          <Route path="/news/local" element={<LocalNews />} />
          <Route path="/news/world" element={<WorldNews />} />
          <Route path="/news-detail/:id" element={<NewsDetails />} />
          <Route path="/SinglePage/:id" element={<SinglePage />} />
          <Route path="/SinglePage2/:id" element={<SinglePage2 />} />
          <Route path="/SinglePage3/:id" element={<SinglePage3 />} />
        </Routes>
      </Suspense>
    </Router>
  );
};

export default App;
