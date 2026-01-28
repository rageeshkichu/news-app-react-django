import React from "react";
import Discover from "../../discover/Discover";
import Side from "../../sideContent/side/Side";
import Life from "../life/Life";
import Music from "../musics/Music";
import Popular from "../popular/Popular";
import Ppost from "../Ppost/Ppost";
import "./style.css";
import News from "../../../News";
import News2 from "../../../News2";

const Homes = () => {
  // Check if user_id is present in sessionStorage
  const userId = sessionStorage.getItem("user_id");

  return (
    <>
      <main>
        <div className="container">
          <section className="mainContent">
            <Popular />
            {/* Conditionally render News or News2 based on user_id */}
            {userId ? <News2 /> : <News />}
          </section>
          <section className="sideContent">
            <Side />
          </section>
        </div>
      </main>
    </>
  );
};

export default Homes;
