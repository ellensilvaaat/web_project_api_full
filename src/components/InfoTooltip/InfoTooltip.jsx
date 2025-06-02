import React from "react";
import successDesktop from "../../images/Form.png";
import errorDesktop from "../../images/Form-2.png";
import successMobile from "../../images/Form-3.png";
import errorMobile from "../../images/Form-4.png";
import "../../blocks/InfoTooltip.css";

export default function InfoTooltip({ isOpen, type, onClose }) {
  if (!isOpen) return null;

  const isMobile = window.innerWidth <= 320;

  const getImage = () => {
    if (type === "register-success") return isMobile ? successMobile : successDesktop;
    if (type === "login-error") return isMobile ? errorMobile : errorDesktop;
    return null;
  };

  return (
    <div className="tooltip">
      <div className="tooltip__box">
        <button
          className="tooltip__close-button"
          onClick={onClose}
          aria-label="Fechar"
        >
          ×
        </button>
        <img
          src={getImage()}
          alt="Mensagem"
          className="tooltip__image"
        />
      </div>
      <div className="overlay" onClick={onClose}></div>
    </div>
  );
}
