import React from "react";

export default function ImagePopup({ isOpen, onClose, imageSrc, imageAlt }) {
  const modalClass = isOpen ? "enlargeModal show-modal" : "enlargeModal";

  return (
    <div className={modalClass}>
      <div className="enlargeModal__content" onClick={(e) => e.stopPropagation()}>
        <button className="fechar" onClick={onClose}>&times;</button>
        <img id="Myplace" className="Myplace" src={imageSrc} alt={imageAlt} />
        {imageAlt && <p id="captar" className="captar__text">{imageAlt}</p>} {}
      </div>
    </div>
  );
}



