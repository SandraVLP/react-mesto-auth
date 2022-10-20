import logo from "../images/logo.svg";
import React, { useState } from "react";

import { CurrentUserContext } from "../contexts/CurrentUserContext";

function Header() {
  const currentUser = React.useContext(CurrentUserContext);

  return (
    <header className="header">
      <img className="header__logo" src={logo} alt="Логотип" />
      {currentUser ? <span>{currentUser.name}</span> : <a className="header__login">Войти</a>}
    </header>
  );
}

export default Header;
