import React, { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Header from "./components/Header/Header";
import Main from "./components/Main/Main";
import Footer from "./components/Footer/Footer";
import Login from "./components/Login/Login";
import Register from "./components/Register/Register";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import { authorize, register, checkToken } from "./utils/auth";
import api from "./utils/api";
import CurrentUserContext from "./contexts/CurrentUserContext";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState({});
  const [cards, setCards] = useState([]);
  const [popup, setPopup] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (token) {
      checkToken(token)
        .then((res) => {
          setIsLoggedIn(true);
          setCurrentUser({ email: res.data.email });
        })
        .catch((err) => {
          console.error("Erro ao verificar token:", err);
          setIsLoggedIn(false);
        });
    }
  }, [navigate]);

  useEffect(() => {
    if (isLoggedIn) {
      Promise.all([api.getUserInfo(), api.getInitialCards()])
        .then(([userInfo, cardList]) => {
          setCurrentUser((prev) => ({
            ...userInfo,
            email: prev.email || "",
          }));
          setCards(cardList);
        })
        .catch((err) => console.error("Erro ao carregar dados:", err));
    }
  }, [isLoggedIn]);

  const handleRegister = (email, password) => {
    register(email, password)
      .then(() => {
        navigate("/signin");
      })
      .catch((err) => console.error("Erro no cadastro:", err));
  };

  const handleLogin = (email, password) => {
    return authorize(email, password)
      .then((data) => {
        localStorage.setItem("jwt", data.token);
        return checkToken(data.token);
      })
      .then((res) => {
        setCurrentUser({ email: res.data.email });
        setIsLoggedIn(true);
        navigate("/"); // ✅ Redireciona imediatamente após login
      })
      .catch((err) => {
        console.error("Erro no login:", err);
        throw err; 
      });
  };
  

  
  const handleLogout = () => {
    localStorage.removeItem("jwt");
    setIsLoggedIn(false);
    setCurrentUser({});
    navigate("/signin");
  };

  const handleCardLike = (card) => {
    const isLiked = card.likes.some(i => i._id === currentUser._id);
    api.changeLikeCardStatus(card._id, !isLiked)
      .then((newCard) => {
        setCards((prev) => prev.map((c) => c._id === card._id ? newCard : c));
      })
      .catch(console.error);
  };

  const handleCardDelete = (cardId) => {
    api.deleteCard(cardId)
      .then(() => {
        setCards((prev) => prev.filter((c) => c._id !== cardId));
      })
      .catch(console.error);
  };

  const handleAddPlace = (cardData) => {
    api.addCard(cardData)
      .then((newCard) => {
        setCards([newCard, ...cards]);
        setPopup("");
      })
      .catch(console.error);
  };

  const handleUpdateUser = (userData) => {
    api.setUserInfo(userData)
      .then((updatedUser) => {
        setCurrentUser((prev) => ({ ...updatedUser, email: prev.email }));
        setPopup("");
      })
      .catch(console.error);
  };

  const handleUpdateAvatar = (avatarData) => {
    api.setAvatar(avatarData)
      .then((updatedUser) => {
        setCurrentUser((prev) => ({ ...updatedUser, email: prev.email }));
        setPopup("");
      })
      .catch(console.error);
  };

  const handleOpenPopup = (type) => setPopup(type);
  const handleClosePopup = () => setPopup("");

  return (
    <CurrentUserContext.Provider
  value={{
    currentUser,
    handleUpdateUser,
    handleUpdateAvatar
  }}
>
  <Header
    loggedIn={isLoggedIn}
    onLogout={handleLogout}
    userEmail={currentUser.email}
  />

  <Routes>
    <Route
      path="/"
      element={
        <ProtectedRoute isLoggedIn={isLoggedIn}>
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
        </ProtectedRoute>
      }
    />
    <Route path="/signup" element={<Register onRegister={handleRegister} />} />
    <Route path="/signin" element={<Login onLogin={handleLogin} />} />
  </Routes>
</CurrentUserContext.Provider>
  );
}



