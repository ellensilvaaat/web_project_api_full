import React, { useState } from "react";

export default function NewCard({ onAddPlace, onClose }) {
  const [locationName, setLocationName] = useState("");
  const [locationImage, setLocationImage] = useState("");
  const [nameError, setNameError] = useState("");
  const [imageError, setImageError] = useState("");
  const [isTouchedName, setIsTouchedName] = useState(false);
  const [isTouchedImage, setIsTouchedImage] = useState(false);

  const validateName = (value) => {
    if (!value.trim()) return "Preencha esse campo.";
    if (value.length < 2) return "O nome deve ter pelo menos 2 caracteres.";
    if (value.length > 30) return "O nome deve ter no máximo 30 caracteres.";
    return "";
  };

  const validateImage = (value) => {
    const urlPattern = /^https?:\/\/[^ "]+$/;
    if (!value.trim()) return "Preencha esse campo.";
    if (!urlPattern.test(value)) return "O link deve ser uma URL válida.";
    return "";
  };  

  const handleNameChange = (event) => {
    const value = event.target.value;
    setLocationName(value);
    setIsTouchedName(true);

    const error = validateName(value);
    setNameError(error);

    const errorElement = document.getElementById("locationName-error");
    if (errorElement) {
      if (error && isTouchedName) {
        errorElement.classList.add("popup__error_visible");
      } else {
        errorElement.classList.remove("popup__error_visible");
      }
    }
  };

  const handleImageChange = (event) => {
    const value = event.target.value;
    setLocationImage(value);
    setIsTouchedImage(true);

    const error = validateImage(value);
    setImageError(error);

    const errorElement = document.getElementById("locationImage-error");
    if (errorElement) {
      if (error && isTouchedImage) {
        errorElement.classList.add("popup__error_visible");
      } else {
        errorElement.classList.remove("popup__error_visible");
      }
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const nameValidationError = validateName(locationName);
    const imageValidationError = validateImage(locationImage);

    if (nameValidationError || imageValidationError) {
      setNameError(nameValidationError);
      setImageError(imageValidationError);

      document.getElementById("locationName-error").style.display = nameValidationError ? "block" : "none";
      document.getElementById("locationImage-error").style.display = imageValidationError ? "block" : "none";
      return;
    }

    onAddPlace({
      name: locationName,
      link: locationImage,
    });

    setLocationName("");
    setLocationImage("");
    setNameError("");
    setImageError("");
    setIsTouchedName(false);
    setIsTouchedImage(false);
    onClose();
  };

  return (
    <div id="addModal" className="form modal_opened">
      <div className="modal-content addModal">
        <span className="close" onClick={onClose}>&times;</span>
        <h2 className="modal-content__title">Adicionar Novo Local</h2>
        <form id="addForm" className="popup-avatar__form" onSubmit={handleSubmit}>
          <div className="modal-content__field">
            <input
              type="text"
              id="locationName"
              className="modal-content__name"
              placeholder="Nome do local"
              value={locationName}
              onChange={handleNameChange}
              required
              minLength="2"
              maxLength="30"
            />
            <div className="modal-content__line"></div>
            <div 
              className="error-message" 
              id="locationName-error" 
              style={{ display: nameError ? "block" : "none" }}
            >
              {nameError}
            </div>
          </div>
          <div className="modal-content__field">
            <input
              type="url"
              id="locationImage"
              className="modal-content__text"
              placeholder="Link da imagem"
              value={locationImage}
              onChange={handleImageChange}
              required
            />
            <div className="modal-content__line"></div>
            <div 
              className="error-message" 
              id="locationImage-error" 
              style={{ display: imageError ? "block" : "none" }}
            >
              {imageError}
            </div>
          </div>
          <button type="submit" className="modal-content__button">Criar</button>
        </form>
      </div>
      <div className="overlay" onClick={onClose}></div>
    </div>
  );
}
