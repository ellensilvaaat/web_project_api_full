import React from "react";
import trashIcon from "../../../../images/Trash.png";
import likeIcon from "../../../../images/Group.png";
import likedIcon from "../../../../images/Union.png";
import rectangle from "../../../../images/Rectangle.png";
 
export default function Card({ card, onCardClick, onCardDelete, onCardLike }) {
  const handleLikeClick = () => {
    onCardLike(card);
  };
 
  const handleDeleteClick = () => {
    onCardDelete(card._id);
  };
 
  return (
    <div className="element">
      <img
        src={trashIcon}
        className="element__delete"
        alt="Excluir"
        onClick={handleDeleteClick}
      />
      <img
        className="element__rectangle"
        src={rectangle}
        alt="Fundo do cartão"
      />
      <img
        className="element__local"
        src={card.link}
        alt={card.name}
        onClick={() => onCardClick(card)}
      />
      <div className="element__conteiner">
        <h3 className="element__title">{card.name}</h3>
        <img
          className="element__like"
          src={card.isLiked ? likedIcon : likeIcon}
          alt="Curtir"
          onClick={handleLikeClick}
        />
      </div>
    </div>
  );
}













