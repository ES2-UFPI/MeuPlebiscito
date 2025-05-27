import React from "react";
import { NavLink } from "react-router-dom";

const MainNav = () => {
  return (
    <div className="main-nav">
      <NavLink
        to="/estado"
        className={({ isActive }) =>
          isActive ? "main-nav__link active" : "main-nav__link"
        }
      >
        Meu Estado
      </NavLink>
      <NavLink
        to="/congresso"
        className={({ isActive }) =>
          isActive ? "main-nav__link active" : "main-nav__link"
        }
      >
        Congresso Nacional
      </NavLink>
      <NavLink
        to="/projetos"
        className={({ isActive }) =>
          isActive ? "main-nav__link active" : "main-nav__link"
        }
      >
        Projetos de Lei
      </NavLink>
      <NavLink
        to="/tempo-real"
        className={({ isActive }) =>
          isActive ? "main-nav__link active" : "main-nav__link"
        }
      >
        Em Tempo Real
      </NavLink>
    </div>
  );
};

export default MainNav;
