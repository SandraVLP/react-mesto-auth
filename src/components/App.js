import Header from "./Header";
import Main from "./Main";
import Footer from "./Footer";
import PopupWithForm from "./PopupWithForm";
import ImagePopup from "./ImagePopup";
import React, { useState } from "react";
import api from "../utils/Api.js";
import Card from "./Card";
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import EditProfilePopup from "./EditProfilePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import AddPlacePopup from "./AddPlacePopup";

function App() {
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setisAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setisEditAvatarPopupOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [cards, setCards] = useState([]);
  function closeAllPopups() {
    setisEditAvatarPopupOpen(false);
    setisAddPlacePopupOpen(false);
    setIsEditProfilePopupOpen(false);
    setSelectedCard(null);
  }

  function handleCardClick(selectedCard) {
    setSelectedCard(selectedCard);
  }


  function handleUpdateUser(data) {
    api.setProfileData(data).then((profile) => {
      setCurrentUser(profile);
      closeAllPopups();
    })
    .catch((err) => {
      console.log(`Ошибка; ${err}`);
    });
  }

  function handleUpdateAvatar(data) {
    api.setUserAvatar(data).then((profile) => {
      setCurrentUser(profile);
      closeAllPopups();
    })
    .catch((err) => {
      console.log(`Ошибка; ${err}`);
    });
  }

  function handleCardLike(card) {
    const isLiked = card.likes.some((i) => i._id === currentUser._id);
    api.changeLikeCardStatus(card._id, isLiked).then((newCard) => {
      const newCards = cards.map((c) => (c._id === card._id ? newCard : c));
      setCards(newCards);
    })
    .catch((err) => {
      console.log(`Ошибка; ${err}`);
    });
  }

  function handleCardDelete(card) {
    api.deleteCard(card._id).then(() => {
      const newCards = cards.filter((c) => (c._id !== card._id ? c : null));
      setCards(newCards);
    })
    .catch((err) => {
      console.log(`Ошибка; ${err}`);
    });
  }

  function handleAddPlaceSubmit(data) {
    api.setNewCards(data).then((newCard) =>{
      setCards([newCard,...cards]);
      closeAllPopups();
    })
    .catch((err) => {
      console.log(`Ошибка; ${err}`);
    });
  }

  React.useEffect(() => {
    Promise.all([api.getInitialCards()])
      .then(([cards]) => {
        setCards(cards);
      })
      .catch((err) => {
        console.log(`Ошибка; ${err}`);
      });
  }, []);

  React.useEffect(() => {
    Promise.all([api.getProfileData()])
      .then(([profile]) => {
        setCurrentUser(profile);
      })
      .catch((err) => {
        console.log(`Ошибка; ${err}`);
      });
  }, []);

  return (
    <div className="App">
      <CurrentUserContext.Provider value={currentUser}>
        <Header />
        <Main
          onEditAvatar={() => setisEditAvatarPopupOpen(true)}
          onEditProfile={() => setIsEditProfilePopupOpen(true)}
          onAddPlace={() => setisAddPlacePopupOpen(true)}
          onCardClick={(selectedCard) => handleCardClick(selectedCard)}
          onCardLike={handleCardLike}
          onCardDelete={handleCardDelete}
          cards={cards}
        />

        <Footer />
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
