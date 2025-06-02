import React, { useRef, useState, useEffect } from "react";

export default function EditAvatar({ currentAvatar, onUpdateAvatar, onClose }) {
  const inputRef = useRef(null);
  const [avatarError, setAvatarError] = useState("");
  const [isTouched, setIsTouched] = useState(false);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }, [currentAvatar]);

  const validateUrl = (value) => {
    const urlPattern = /^https?:\/\/[^ "]+$/i;
    if (!value.trim()) return "Por favor, insira um link válido.";
    if (!urlPattern.test(value)) return "O link deve ser uma URL válida de imagem.";
    return "";
  };

  const handleAvatarChange = () => {
    const value = inputRef.current.value;
    setIsTouched(true);
    setAvatarError(validateUrl(value));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const value = inputRef.current.value;
    const error = validateUrl(value);
    setAvatarError(error);
    if (error) return;

    onUpdateAvatar(value);
    handleClose();
  };

  const handleClose = () => {
    if (inputRef.current) inputRef.current.value = "";
    setAvatarError("");
    setIsTouched(false);
    onClose();
  };

  return (
    <div id="modal-avatar" className="popup-avatar popup-avatar_opened">
      <div className="popup-avatar__content">
        <button className="popup__close-button" onClick={handleClose}>
          &times;
        </button>
        <h2 className="popup-avatar__title">Alterar foto do perfil</h2>
        <form id="form-avatar" className="popup-avatar__form" onSubmit={handleSubmit}>
          <div className="modal-content__field">
            <input
              type="url"
              id="avatar-link"
              className="popup-avatar__input"
              placeholder="https://somewebsite.com/someimage.jpg"
              ref={inputRef}
              onChange={handleAvatarChange}
              required
            />
            <div className="modal-content__line"></div>
            {avatarError && isTouched && (
              <div
                className="error-message popup__error_visible"
                id="locationName-error"
              >
                {avatarError}
              </div>
            )}
          </div>
          <button type="submit" className="popup-avatar__save">
            Salvar
          </button>
        </form>
      </div>
      <div className="overlay" onClick={handleClose}></div>
    </div>
  );
}





