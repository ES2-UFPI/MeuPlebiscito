"use client";

import { useState, useRef, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";

const MainNav = () => {
  const location = useLocation();
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [hoverStyle, setHoverStyle] = useState({});
  const [activeStyle, setActiveStyle] = useState({ left: "0px", width: "0px" });
  const tabRefs = useRef([]);

  const navItems = [
    { path: "/congresso", label: "Meu Congresso" },
    { path: "/historia", label: "Minha História" },
    { path: "/projetos", label: "Minhas Leis" },
    { path: "/tempo-real", label: "Em Tempo Real" },
  ];

  // Determine active index based on current location
  const activeIndex = navItems.findIndex(
    (item) => location.pathname === item.path
  );

  useEffect(() => {
    if (hoveredIndex !== null) {
      const hoveredElement = tabRefs.current[hoveredIndex];
      if (hoveredElement) {
        const { offsetLeft, offsetWidth } = hoveredElement;
        setHoverStyle({
          left: `${offsetLeft}px`,
          width: `${offsetWidth}px`,
        });
      }
    }
  }, [hoveredIndex]);

  useEffect(() => {
    if (activeIndex >= 0) {
      const activeElement = tabRefs.current[activeIndex];
      if (activeElement) {
        const { offsetLeft, offsetWidth } = activeElement;
        setActiveStyle({
          left: `${offsetLeft}px`,
          width: `${offsetWidth}px`,
        });
      }
    }
  }, [activeIndex, location.pathname]);

  return (
    <div className="main-nav-container">
      <div className="main-nav">
        <div className="main-nav__tabs">
          {/* Hover Highlight */}
          <div
            className="main-nav__hover-highlight"
            style={{
              ...hoverStyle,
              opacity: hoveredIndex !== null ? 1 : 0,
            }}
          />

          {/* Active Indicator */}
          <div className="main-nav__active-indicator" style={activeStyle} />

          {/* Navigation Items */}
          <div className="main-nav__items">
            {navItems.map((item, index) => (
              <NavLink
                key={item.path}
                to={item.path}
                className="main-nav__link"
                ref={(el) => (tabRefs.current[index] = el)}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {item.label}
              </NavLink>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainNav;
