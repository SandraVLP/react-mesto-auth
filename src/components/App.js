import Header from "./Header";
import Main from "./Main";
import Footer from "./Footer";
import PopupWithForm from "./PopupWithForm";
import ImagePopup from "./ImagePopup";
import React, { useState } from "react";
import { Route, useNavigate, Navigate, Routes } from "react-router-dom";
import api from "../utils/Api.js";
import Card from "./Card";
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import EditProfilePopup from "./EditProfilePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import AddPlacePopup from "./AddPlacePopup";
import Login from "./Login";
import Register from "./Register";
import ProtectedRoute from "./ProtectedRoute";
import InfoTooltip from "./InfoTooltip";
import * as auth from "../auth.js";

function App() {
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setisAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setisEditAvatarPopupOpen] = useState(false);
  // const [isInfoToolTipOpen, setisInfoToolTipOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [cards, setCards] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);
  const [email, setEmail] = useState(null);
  const navigate = useNavigate();

  function closeAllPopups() {
    setisEditAvatarPopupOpen(false);
    setisAddPlacePopupOpen(false);
    setIsEditProfilePopupOpen(false);
    // setisInfoToolTipOpen(false);
    setSelectedCard(null);
  }

  function handleCardClick(selectedCard) {
    setSelectedCard(selectedCard);
  }

  function handleUpdateUser(data) {
    api
      .setProfileData(data)
      .then((profile) => {
        setCurrentUser(profile);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(`Ошибка; ${err}`);
      });
  }

  function handleUpdateAvatar(data) {
    api
      .setUserAvatar(data)
      .then((profile) => {
        setCurrentUser(profile);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(`Ошибка; ${err}`);
      });
  }

  function handleCardLike(card) {
    const isLiked = card.likes.some((i) => i._id === currentUser._id);
    api
      .changeLikeCardStatus(card._id, isLiked)
      .then((newCard) => {
        const newCards = cards.map((c) => (c._id === card._id ? newCard : c));
        setCards(newCards);
      })
      .catch((err) => {
        console.log(`Ошибка; ${err}`);
      });
  }

  function handleCardDelete(card) {
    api
      .deleteCard(card._id)
      .then(() => {
        const newCards = cards.filter((c) => (c._id !== card._id ? c : null));
        setCards(newCards);
      })
      .catch((err) => {
        console.log(`Ошибка; ${err}`);
      });
  }

  function handleAddPlaceSubmit(data) {
    api
      .setNewCards(data)
      .then((newCard) => {
        setCards([newCard, ...cards]);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(`Ошибка; ${err}`);
      });
  }

  const handleLoginClick = () => {
    navigate("/signin");
  };

  const handleEnterClick = () => {
    console.log("handleEnterClick");
    navigate("*");
  };
  function signOut() {
    localStorage.removeItem('jwt');
    handleLoginClick();
  }


  const handleTokenCheck = () => {
    if (localStorage.getItem("jwt")) {
      const jwt = localStorage.getItem("jwt");
      // проверяем токен пользователя
      auth.checkToken(jwt).then((res) => {
        if (res) {
          setEmail(res.data.email);
          setLoggedIn(true);

        }
      });
    }
  };

  React.useEffect(() => {
    handleTokenCheck();
  }, []);

  React.useEffect(() => {
    Promise.all([api.getInitialCards()])
      .then(([cards]) => {
        setCards(cards);
      })
      .catch((err) => {
        console.log(`Ошибка; ${err}`);
      });
  }, [loggedIn]);

  React.useEffect(() => {
    Promise.all([api.getProfileData()])
      .then(([profile]) => {
        setCurrentUser(profile);
      })
      .catch((err) => {
        console.log(`Ошибка; ${err}`);
      });
  }, [loggedIn]);

  return (
    <div className="App">
      <CurrentUserContext.Provider value={currentUser}>
        <Header isLoggedIn={loggedIn} email={email} signOut={signOut}/>
        <Routes>
          <Route
            path="*"
            element={
              <ProtectedRoute hasAccess={true} component={Main} 
                  onEditAvatar={() => setisEditAvatarPopupOpen(true)}
                  onEditProfile={() => setIsEditProfilePopupOpen(true)}
                  onAddPlace={() => setisAddPlacePopupOpen(true)}
                  onCardClick={(selectedCard) => handleCardClick(selectedCard)}
                  onCardLike={handleCardLike}
                  onCardDelete={handleCardDelete}
                  cards={cards}
              />
            }
          />
          <Route
            path="/signup"
            element={<Register onRegSuccess={() => handleLoginClick()} />}
          />
          <Route
            path="/signin"
            element={<Login onLoginSuccess={() => handleEnterClick()} />}
          />
          <Route
            path="*"
            element={loggedIn ? <Navigate to="*" /> : <Navigate to="/signin" />}
          ></Route>
        </Routes>

        <Footer />
        {/* <InfoTooltip isOpen={isInfoToolTipOpen} onClose={closeAllPopups}/> */}
        <EditProfilePopup
          isOpen={isEditProfilePopupOpen}
          onClose={closeAllPopups}
          onUpdateUser={handleUpdateUser}
        />

        <AddPlacePopup
          isOpen={isAddPlacePopupOpen}
          onClose={closeAllPopups}
          onAddPlace={handleAddPlaceSubmit}
        />

        <EditAvatarPopup
          isOpen={isEditAvatarPopupOpen}
          onClose={closeAllPopups}
          onUpdateAvatar={handleUpdateAvatar}
        />

        {/* 
    <PopupWithForm 
    name='popup_sure' 
    title='Обновить Вы уверены?' 
    submitname='Да'
    isOpen={}
    /> */}
        <ImagePopup card={selectedCard} onClose={() => closeAllPopups(true)} />
      </CurrentUserContext.Provider>
    </div>
  );
}

export default App;




// if (path="*")  {
//   return 
//     <header className="header">
//     <img className="header__logo" src={logo} alt="Логотип" />
//   <div>
//     {" "}
//     <p className="header__login">{props.email}</p>{" "}
//     <button onClick={props.signOut}  className="header__login">
//       Выйти
//     </button>
//     </div>
//      </header>
//  } if (path="/signup") {
//    return
//   <header className="header">
//   <img className="header__logo" src={logo} alt="Логотип" />
//   <Link to="/signin" className="header__login">
//     Войти
//   </Link>
//   </header>
// } else {
// return
// (  <header className="header">
// <img className="header__logo" src={logo} alt="Логотип" />
// <Link to="/signup" className="header__login">
// Регистрация
// </Link>
// </header>)
// }