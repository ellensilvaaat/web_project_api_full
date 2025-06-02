import React from "react";

export default function Popup({ onClose, title, children }) {
  const handleOverlayClick = (e) => {
    if (e.target.classList.contains("popup")) {
      onClose();
    }
  };

  return (
    <div className="popup popup_opened" onClick={handleOverlayClick}>
      <div className="popup__content">
        {title && <h3 className="popup__title">{title}</h3>}
        {children} {}
      </div>
    </div>
  );
}



  

