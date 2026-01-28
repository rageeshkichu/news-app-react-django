import React from "react";

const Head = () => {
  return (
    <>
      <section 
        className="head" 
        style={{
          marginTop: "100px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          className="container"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
          }}
        >
          <div className="logo">
            <img
              src="../images/logo2.png"
              alt=""
              style={{
                width: "500px",
                maxWidth: "100%",
              }}
            />
          </div>
        </div>
      </section>
    </>
  );
};

export default Head;
