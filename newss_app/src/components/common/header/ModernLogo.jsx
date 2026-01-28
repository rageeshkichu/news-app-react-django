import React from "react";

const ModernLogo = ({ width = "300", height = "80", navBar = false }) => {
  const logoGradientId = `logoGradient-${Math.random()}`;
  const textGradientId = `textGradient-${Math.random()}`;
  const accentGradientId = `accentGradient-${Math.random()}`;

  return (
    <svg
      viewBox="0 0 400 100"
      width={width}
      height={height}
      xmlns="http://www.w3.org/2000/svg"
      style={{ maxWidth: "100%", height: "auto" }}
    >
      {/* Background gradient definition */}
      <defs>
        <linearGradient id={logoGradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={navBar ? "#fff" : "#1a73e8"} />
          <stop offset="100%" stopColor={navBar ? "#f0f0f0" : "#ea4335"} />
        </linearGradient>
        <linearGradient id={textGradientId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={navBar ? "#fff" : "#1a73e8"} />
          <stop offset="100%" stopColor={navBar ? "#e8e8e8" : "#ea4335"} />
        </linearGradient>
        <linearGradient id={accentGradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fbbc04" />
          <stop offset="100%" stopColor="#ea4335" />
        </linearGradient>
      </defs>

      {/* Main icon/symbol */}
      <g>
        {/* Icon background circle */}
        <circle
          cx="35"
          cy="50"
          r="28"
          fill={navBar ? "#fff" : "#1a73e8"}
          opacity={navBar ? 0.15 : 0.1}
          style={{ transition: "opacity 0.3s ease" }}
        />

        {/* Outer circle border */}
        <circle
          cx="35"
          cy="50"
          r="28"
          fill="none"
          stroke={navBar ? "#fff" : "#1a73e8"}
          strokeWidth="2"
          opacity={navBar ? 0.8 : 1}
        />

        {/* Newspaper/document icon */}
        <g transform="translate(20, 35)">
          {/* Main document shape */}
          <rect 
            x="0" 
            y="0" 
            width="30" 
            height="30" 
            rx="2" 
            fill={navBar ? "#fff" : "#1a73e8"} 
          />

          {/* Lines representing text */}
          <line
            x1="4"
            y1="6"
            x2="26"
            y2="6"
            stroke={navBar ? "#1a73e8" : "#fff"}
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <line
            x1="4"
            y1="12"
            x2="26"
            y2="12"
            stroke={navBar ? "#1a73e8" : "#fff"}
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <line
            x1="4"
            y1="18"
            x2="20"
            y2="18"
            stroke={navBar ? "#1a73e8" : "#fff"}
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <line
            x1="4"
            y1="24"
            x2="26"
            y2="24"
            stroke={navBar ? "#1a73e8" : "#fff"}
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </g>
      </g>

      {/* Text "NEWS" */}
      <text
        x="75"
        y="60"
        fontSize="42"
        fontWeight="800"
        fill={navBar ? "#fff" : "#1a73e8"}
        fontFamily="'Playfair Display', serif"
        letterSpacing="-1"
      >
        NEWS
      </text>

      {/* Text "24" - accent */}
      <text
        x="340"
        y="60"
        fontSize="32"
        fontWeight="700"
        fill={navBar ? "#fbbc04" : "#ea4335"}
        fontFamily="'Inter', sans-serif"
      >
        24
      </text>

      {/* Decorative line under text */}
      <line
        x1="75"
        y1="72"
        x2="175"
        y2="72"
        stroke={navBar ? "url(#" + accentGradientId + ")" : "#ea4335"}
        strokeWidth="3"
        strokeLinecap="round"
      />

      {/* Tagline/subtitle */}
      <text
        x="75"
        y="92"
        fontSize="10"
        fontWeight="600"
        fill={navBar ? "rgba(255,255,255,0.8)" : "#202124"}
        fontFamily="'Inter', sans-serif"
        letterSpacing="1"
      >
        BREAKING NEWS &amp; UPDATES
      </text>
    </svg>
  );
};

export default ModernLogo;
