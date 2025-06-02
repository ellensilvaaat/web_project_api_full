import { useState, useEffect } from 'react';

export default function EditProfile({ onClose, currentUser, onUpdateUser }) {
  const [name, setName] = useState("");
  const [job, setJob] = useState("");
  const [nameError, setNameError] = useState("");
  const [jobError, setJobError] = useState("");
  const [isTouchedName, setIsTouchedName] = useState(false);
  const [isTouchedJob, setIsTouchedJob] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setName(""); // ← campo vazio
      setJob("");  // ← campo vazio
    }
  }, [currentUser]);

  const validateName = (value) => {
    if (!value.trim()) return "Preencha esse campo.";
    if (value.length < 2) return "O nome deve ter pelo menos 2 caracteres.";
    if (value.length > 40) return "O nome deve ter no máximo 40 caracteres.";
    return "";
  };

  const validateJob = (value) => {
    if (!value.trim()) return "Preencha esse campo.";
    if (value.length < 2) return "A profissão deve ter pelo menos 2 caracteres.";
    if (value.length > 200) return "A profissão deve ter no máximo 200 caracteres.";
    return "";
  };

  const handleNameChange = (e) => {
    const value = e.target.value;
    setName(value);
    setIsTouchedName(true);
    setNameError(validateName(value));
  };

  const handleJobChange = (e) => {
    const value = e.target.value;
    setJob(value);
    setIsTouchedJob(true);
    setJobError(validateJob(value));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const nameErr = validateName(name);
    const jobErr = validateJob(job);

    if (nameErr || jobErr) {
      setNameError(nameErr);
      setJobError(jobErr);
      return;
    }

    onUpdateUser({ name, about: job });
  };

  const handleClose = () => {
    setName("");
    setJob("");
    setNameError("");
    setJobError("");
    setIsTouchedName(false);
    setIsTouchedJob(false);
    onClose();
  };

  return (
    <div id="Modal" className="form modal_opened">
      <div className="modal-content">
        <span className="close" onClick={handleClose}>&times;</span>
        <form id="form" onSubmit={handleSubmit} autoComplete="off">
          <h2 className="modal-content__title">Editar perfil</h2>
          <div className="modal-content__field">
            <input
              type="text"
              name="name"
              className="modal-content__name"
              placeholder="Digite seu nome"
              value={name}
              onChange={handleNameChange}
              required
              minLength="2"
              maxLength="40"
            />
            <div className="modal-content__line"></div>
            {nameError && isTouchedName && (
              <div className="error-message popup__error_visible">{nameError}</div>
            )}
          </div>
          <div className="modal-content__field">
            <input
              type="text"
              name="job"
              className="modal-content__text"
              placeholder="Digite sua profissão"
              value={job}
              onChange={handleJobChange}
              required
              minLength="2"
              maxLength="200"
            />
            <div className="modal-content__line"></div>
            {jobError && isTouchedJob && (
              <div className="error-message popup__error_visible">{jobError}</div>
            )}
          </div>
          <button type="submit" className="modal-content__button">
            Salvar
          </button>
        </form>
      </div>
      <div className="overlay" onClick={handleClose}></div>
    </div>
  );
}


