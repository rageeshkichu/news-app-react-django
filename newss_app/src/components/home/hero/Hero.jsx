import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Bounce, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./hero.css";
import { fetchNews } from "../../../redux/actions/NewsActions";
import Loader from "../../common/loader/Loader";

const Hero = () => {

    const { news, loading, error } = useSelector(( state ) => state.newsData );
    const dispatch = useDispatch();

    useEffect( () => {
      dispatch( fetchNews() );
    }, [ dispatch ]);

    useEffect(() => {
      if (error) {
    toast.error(error);}
    }, [error]);

  if( loading ) {
    return < Loader />;
  }

  return (    <>    <section className="hero">      <div className="container">        {news.length === 0 && !loading ? (
          <p>No news available</p>        ) : (          news.slice(0, 4).map((item) => {
            const userId = sessionStorage.getItem("user_id");
            const redirectPath = userId ? `/news-detail/${item.id}` : "/login";

            return (              <div className="box" style={{ position: "relative" }} key={item.id}>
                <Link                  to={redirectPath}
                  style={{
                    position: "absolute",                    top: 0,                    left: 0,                    width: "100%",                    height: "100%",                    zIndex: 1,                    textDecoration: "none",                  }}
                />                <div className="img">                  <img                    src={item.image_url || "/default-image.jpg"}
                    alt={item.title}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/default-image.jpg";
                    }}
                  />                </div>                <div className="text">                  <span className="category">{item.category}</span>
                  <h1 className="titleBg">                    {item.title.length > 40 ? `${item.title.slice(0, 40)}...` : item.title}
                  </h1>                  <div className="author flex">                    <span>by {item.author_name}</span>
                    <span>{new Date(item.date_published).toLocaleDateString()}</span>
                  </div>                </div>              </div>            );
          })
        )}
      </div>    </section>    <ToastContainer    position="top-right"    autoClose={3000}
    theme="dark"    transition={Bounce}
  />  </>  );
};
export default Hero;
