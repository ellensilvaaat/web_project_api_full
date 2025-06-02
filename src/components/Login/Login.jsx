import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import lineImg from "../../images/Line.png";
import InfoTooltip from "../InfoTooltip/InfoTooltip";
import "../../blocks/login.css";

export default function Login({ onLogin }) {
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
      await onLogin(form.email, form.password);
    } catch (err) {
      setTooltipType("login-error");
      setIsTooltipOpen(true);
    }
  };

  return (
    <div className="login-auth">
      <h2 className="login-auth__title">Entrar</h2>
      <form onSubmit={handleSubmit} className="login-auth__form">
        <div className="login-auth__field">
          <input
            type="email"
            name="email"
            placeholder="E-mail"
            value={form.email}
            onChange={handleChange}
            required
            className="login-auth__input"
          />
          <img src={lineImg} alt="" className="login-auth__underline" />
        </div>

        <div className="login-auth__field">
          <input
            type="password"
            name="password"
            placeholder="Senha"
            value={form.password}
            onChange={handleChange}
            required
            className="login-auth__input"
          />
          <img src={lineImg} alt="" className="login-auth__underline" />
        </div>

        <button type="submit" className="login-auth__submit-button">
          Entrar
        </button>

        <p className="login-auth__redirect">
          Ainda não é membro?{" "}
          <span
            className="login-auth__register-link"
            onClick={() => navigate("/signup")}
          >
            Inscreva-se aqui!
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




