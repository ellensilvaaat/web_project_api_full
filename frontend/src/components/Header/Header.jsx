import React from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../../images/Vector-3.svg";
import line from "../../images/Line.png";
import "../../blocks/header.css";

export default function Header({ loggedIn, userEmail, onLogout }) {
  const location = useLocation();

  return (
    <header className="header">
  <div className="header__top">
    <img className="header__logo" src={logo} alt="logo" />

    <nav className="header__nav">
      {!loggedIn && location.pathname === "/" && (
        <Link to="/signin" className="header__link">Faça o login</Link>
      )}

      {!loggedIn && location.pathname === "/signin" && (
        <Link to="/signup" className="header__link">Entrar</Link>
      )}

      {!loggedIn && location.pathname === "/signup" && (
        <Link to="/signin" className="header__link">Faça o login</Link>
      )}

      {loggedIn && (
        <div className="header__user">
          <span className="header__email">{userEmail}</span>
          <span className="header__logout" onClick={onLogout}> Sair</span>
        </div>
      )}
    </nav>
  </div>

  <img className="header__line" src={line} alt="line" />
</header>
  );
}





