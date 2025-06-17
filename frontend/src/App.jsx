// frontend/src/App.jsx

import React, { useState, useEffect } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';

// Importando componentes
import Header from './components/Header/Header';
import Main from './components/Main/Main';
import Footer from './components/Footer/Footer';
import Login from './components/Login/Login';
import Register from './components/Register/Register';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';

// Importando utils e contextos
import { authorize, register, checkToken } from './utils/auth';
import api from './utils/api';
import CurrentUserContext from './contexts/CurrentUserContext'; 

function App() {
  // Estados da aplicação
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState({});
  const [cards, setCards] = useState([]);
  const [popup, setPopup] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const navigate = useNavigate();

  // Efeito para verificar o token no localStorage ao carregar a aplicação
  useEffect(() => {
    const token = localStorage.getItem('jwt');
    if (token) {
      checkToken(token)
        .then((res) => {
          if (res) {
            setIsLoggedIn(true);
            setUserEmail(res.email); // O backend retorna o email diretamente
            navigate('/');
          }
        })
        .catch((err) => {
          console.error('Erro ao verificar token:', err);
          setIsLoggedIn(false);
        });
    }
  }, [navigate]);

  // Efeito para buscar dados iniciais (info do usuário e cartões) quando logado
  useEffect(() => {
    if (isLoggedIn) {
      Promise.all([api.getUserInfo(), api.getInitialCards()])
        .then(([userInfo, cardList]) => {
          setCurrentUser(userInfo);
          setCards(cardList);
        })
        .catch((err) => console.error('Erro ao carregar dados iniciais:', err));
    }
  }, [isLoggedIn]);

  // Funções de Autenticação
  const handleRegister = (email, password) => {
    register(email, password)
      .then(() => {
        // Lógica de sucesso (ex: abrir popup de sucesso)
        navigate('/signin');
      })
      .catch((err) => console.error('Erro no cadastro:', err));
  };

  const handleLogin = (email, password) => {
    authorize(email, password)
      .then((data) => {
        if (data.token) {
          localStorage.setItem('jwt', data.token);
          setIsLoggedIn(true);
          setUserEmail(email);
          navigate('/');
        }
      })
      .catch((err) => console.error('Erro no login:', err));
  };

  const handleSignOut = () => {
    localStorage.removeItem('jwt');
    setIsLoggedIn(false);
    setUserEmail('');
    setCurrentUser({});
    setCards([]);
    navigate('/signin');
  };

  // Funções de Manipulação de Cartões
  const handleCardLike = (card) => {
    const isLiked = card.likes.some((i) => i === currentUser._id);
    // A lógica de like não foi implementada no backend ainda
    // api.changeLikeCardStatus(card._id, !isLiked) ...
    console.log('Funcionalidade de Like a ser implementada no backend.');
  };

  const handleCardDelete = (card) => {
    api
      .deleteCard(card._id)
      .then(() => {
        setCards((state) => state.filter((c) => c._id !== card._id));
      })
      .catch((err) => console.error('Erro ao deletar cartão:', err));
  };

  const handleAddPlaceSubmit = (cardData) => {
    api
      .addCard(cardData)
      .then((newCard) => {
        setCards([newCard, ...cards]);
        closeAllPopups();
      })
      .catch((err) => console.error('Erro ao adicionar cartão:', err));
  };

  // Funções de Manipulação do Perfil
  const handleUpdateUser = (userData) => {
    api
      .editProfile(userData)
      .then((updatedUser) => {
        setCurrentUser(updatedUser);
        closeAllPopups();
      })
      .catch((err) => console.error('Erro ao atualizar perfil:', err));
  };

  const handleUpdateAvatar = (avatarData) => {
    api
      .updateAvatar(avatarData)
      .then((updatedUser) => {
        setCurrentUser(updatedUser);
        closeAllPopups();
      })
      .catch((err) => console.error('Erro ao atualizar avatar:', err));
  };

  // Funções de Popup
  const handleEditAvatarClick = () => setPopup('edit-avatar');
  const handleEditProfileClick = () => setPopup('edit-profile');
  const handleAddPlaceClick = () => setPopup('add-place');
  const handleCardClick = (card) => setPopup({ type: 'image', card: card });
  const closeAllPopups = () => setPopup('');

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className='page'>
        <Header userEmail={userEmail} onSignOut={handleSignOut} />
        <Routes>
          <Route
            path='/'
            element={
              <ProtectedRoute isLoggedIn={isLoggedIn}>
                <Main
                  onEditProfileClick={handleEditProfileClick}
                  onAddPlaceClick={handleAddPlaceClick}
                  onEditAvatarClick={handleEditAvatarClick}
                  onCardClick={handleCardClick}
                  cards={cards}
                  onCardLike={handleCardLike}
                  onCardDelete={handleCardDelete}
                  // Passa os estados e handlers para os popups
                  popupState={popup}
                  closeAllPopups={closeAllPopups}
                  onUpdateUser={handleUpdateUser}
                  onUpdateAvatar={handleUpdateAvatar}
                  onAddPlaceSubmit={handleAddPlaceSubmit}
                />
                <Footer />
              </ProtectedRoute>
            }
          />
          <Route path='/signin' element={<Login onLogin={handleLogin} />} />
          <Route path='/signup' element={<Register onRegister={handleRegister} />} />
        </Routes>
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;



