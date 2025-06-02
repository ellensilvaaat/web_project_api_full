import React, { useEffect, useState } from "react";
import Main from "../../components/Main/Main";
import Footer from "../../components/Footer/Footer";
import api from "../../utils/api";
import CurrentUserContext from "../../contexts/CurrentUserContext";
import "../../index.css";

export default function Home({ loggedIn }) {
  const [currentUser, setCurrentUser] = useState({
    name: "Jacques Cousteau",
    about: "Explorador",
    avatar: "",
  });

  const [cards, setCards] = useState([]);
  const [popup, setPopup] = useState("");

  useEffect(() => {
    api
      .getInitialCards()
      .then((initialCards) =>
        setCards(
          initialCards
            .map((card) => ({
              ...card,
              likes: Array.isArray(card.likes) ? card.likes : [],
              isLiked: false,
            }))
            .reverse()
        )
      )
      .catch((error) => console.error("Erro ao carregar cards:", error));
  }, []);  

  useEffect(() => {
    if (loggedIn) {
      api
        .getUserInfo()
        .then((user) => setCurrentUser(user))
        .catch((error) => console.error("Erro ao carregar usuário:", error));
    }
  }, [loggedIn]);

  const handleOpenPopup = (name) => setPopup(name);
  const handleClosePopup = () => setPopup("");

  const handleUpdateUser = async (data) => {
    if (!loggedIn) return;
    try {
      const updatedUser = await api.setUserInfo(data);
      setCurrentUser(updatedUser);
      handleClosePopup();
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
    }
  };

  const handleUpdateAvatar = async (url) => {
    if (!loggedIn) return;
    try {
      const updatedUser = await api.setAvatar(url);
      setCurrentUser(updatedUser);
      handleClosePopup();
    } catch (error) {
      console.error("Erro ao atualizar avatar:", error);
    }
  };

  const handleAddPlace = async (newCard) => {
    if (!loggedIn) return;
    try {
      const createdCard = await api.addCard(newCard);

      const safeCard = {
        ...createdCard,
        likes: Array.isArray(createdCard.likes) ? createdCard.likes : [],
        isLiked: false,
      };

      setCards((prev) => [safeCard, ...prev]);
      handleClosePopup();
    } catch (error) {
      console.error("Erro ao adicionar card:", error);
    }
  };

  const handleCardLike = async (card) => {
    if (!loggedIn) return;
  
    const likes = Array.isArray(card.likes) ? card.likes : [];
  
    const isLiked = likes.some((like) => like._id === currentUser._id);
    try {
      const updatedCard = await api.changeLikeCardStatus(card._id, !isLiked);
  
      const updatedWithIsLiked = {
        ...updatedCard,
        isLiked: !isLiked,
        likes: Array.isArray(updatedCard.likes) ? updatedCard.likes : [],
      };
  
      setCards((prevCards) =>
        prevCards.map((c) => (c._id === card._id ? updatedWithIsLiked : c))
      );
    } catch (error) {
      console.error("Erro ao curtir/descurtir:", error);
    }
  };
  
  const handleCardDelete = async (cardId) => {
    if (!loggedIn) return;
    try {
      await api.deleteCard(cardId);
      setCards((prev) => prev.filter((c) => c._id !== cardId));
    } catch (error) {
      console.error("Erro ao deletar card:", error);
    }
  };

  return (
    <CurrentUserContext.Provider
      value={{
        currentUser,
        handleUpdateUser,
        handleUpdateAvatar,
      }}
    >
      <div className="page__content">
        <Main
          popup={popup}
          onOpenPopup={handleOpenPopup}
          onClosePopup={handleClosePopup}
          cards={cards}
          onAddPlace={handleAddPlace}
          onCardLike={handleCardLike}
          onCardDelete={handleCardDelete}
          currentUser={currentUser}
          onUpdateUser={handleUpdateUser}
          onUpdateAvatar={handleUpdateAvatar}
        />
        <Footer />
      </div>
    </CurrentUserContext.Provider>
  );
}
