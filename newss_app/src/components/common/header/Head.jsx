import React from "react";
import ModernLogo from "./ModernLogo";

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
          padding: "40px 20px",
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
          <div className="logo" style={{ maxWidth: "600px", width: "100%" }}>
            <ModernLogo width="100%" height="auto" navBar={false} />
          </div>
        </div>
      </section>
    </>
  );
};

export default Head;
