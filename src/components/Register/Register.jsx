import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import lineImg from "../../images/Line.png";
import InfoTooltip from "../InfoTooltip/InfoTooltip";
import "../../blocks/register.css";

export default function Register({ onRegister }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);
  const [tooltipType, setTooltipType] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await onRegister(form.email, form.password);
      setTooltipType("register-success");
      setIsTooltipOpen(true);
      setTimeout(() => {
        setIsTooltipOpen(false);
        navigate("/signin");
      }, 2000);
    } catch (err) {
      console.error("Erro no registro:", err);
    }
  };

  return (
    <div className="register-auth">
      <h2 className="register-auth__title">Inscrever-se</h2>
      <form onSubmit={handleSubmit} className="register-auth__form">
        <div className="register-auth__field">
          <input
            type="email"
            name="email"
            placeholder="E-mail"
            value={form.email}
            onChange={handleChange}
            required
            className="register-auth__input"
          />
          <img src={lineImg} alt="" className="register-auth__underline" />
        </div>

        <div className="register-auth__field">
          <input
            type="password"
            name="password"
            placeholder="Senha"
            value={form.password}
            onChange={handleChange}
            required
            className="register-auth__input"
          />
          <img src={lineImg} alt="" className="register-auth__underline" />
        </div>

        <button type="submit" className="register-auth__submit-button">
          Inscrever-se
        </button>

        <p className="register-auth__redirect">
          Já é membro?{" "}
          <span
            className="register-auth__login-link"
            onClick={() => navigate("/signin")}
          >
            Faça login aqui!
          </span>
        </p>
      </form>

      <InfoTooltip
        isOpen={isTooltipOpen}
        type={tooltipType}
        onClose={() => setIsTooltipOpen(false)}
      />
    </div>
  );
}


