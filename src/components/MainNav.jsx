import React from "react";
import { NavLink } from "react-router-dom";

const MainNav = () => {
  return (
    <div className="main-nav">
      <NavLink
        to="/meu-estado"
        className={({ isActive }) =>
          isActive ? "main-nav__link active" : "main-nav__link"
        }
      >
        Meu Congresso
      </NavLink>
      <NavLink
        to="/congresso"
        className={({ isActive }) =>
          isActive ? "main-nav__link active" : "main-nav__link"
        }
      >
        Minha História
      </NavLink>
      <NavLink
        to="/projetos"
        className={({ isActive }) =>
          isActive ? "main-nav__link active" : "main-nav__link"
        }
      >
        Minhas Leis
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
