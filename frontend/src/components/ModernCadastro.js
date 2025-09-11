import { useState } from "react";
import { apiFetch } from "../api";
import "./RentalAuth.css";

export default function ModernCadastro({ setToken, switchToLogin }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    cpf: "",
    cnpj: "",
    celular: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (formData.password !== formData.confirmPassword) {
      setError("As senhas não coincidem");
      return;
    }
    if (formData.password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres");
      return;
    }

    if (!formData.cpf && !formData.cnpj) {
      setError("Preencha CPF ou CNPJ");
      return;
    }
    if (formData.cpf && formData.cpf.length !== 11) {
      setError("CPF deve ter 11 dígitos");
      return;
    }
    if (formData.cnpj && formData.cnpj.length !== 14) {
      setError("CNPJ deve ter 14 dígitos");
      return;
    }

    setLoading(true);

    try {
      await apiFetch("cadastros", {
        method: "POST",
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          cpf: formData.cpf || null,
          cnpj: formData.cnpj || null,
          celular: formData.celular || null,
        }),
      });

      setSuccess("Conta criada com sucesso! Redirecionando...");

      setTimeout(async () => {
        try {
          const loginData = await apiFetch("login", {
            method: "POST",
            body: JSON.stringify({
              email: formData.email,
              password: formData.password,
            }),
          });
          setToken(loginData.token);
          localStorage.setItem("token", loginData.token);
          localStorage.setItem("userEmail", formData.email);
        } catch {
          setError("Conta criada, mas erro no login automático");
        }
      }, 1500);
    } catch (err) {
      setError(err.message || "Erro ao criar conta");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rental-auth-container">
      <div className="rental-auth-card">
        <div className="rental-logo">
          <h1>DoutorRent</h1>
          <p className="rental-tagline">Alugue o look perfeito</p>
        </div>

        <div className="rental-auth-content">
          <h2>Criar sua conta</h2>
          <p>Comece a alugar looks incríveis</p>
          {error && <div className="rental-error">{error}</div>}
          {success && <div className="rental-success">{success}</div>}

          <form onSubmit={handleSubmit} className="rental-form">
            <input
              type="text"
              name="name"
              placeholder="Nome completo"
              value={formData.name}
              onChange={handleChange}
              required
              className="rental-input"
            />

            <input
              type="email"
              name="email"
              placeholder="Seu email"
              value={formData.email}
              onChange={handleChange}
              required
              className="rental-input"
            />

            <input
              type="text"
              name="cpf"
              placeholder="CPF (somente números)"
              value={formData.cpf}
              onChange={handleChange}
              className="rental-input"
            />

            <input
              type="text"
              name="cnpj"
              placeholder="CNPJ (somente números)"
              value={formData.cnpj}
              onChange={handleChange}
              className="rental-input"
            />

            <input
              type="text"
              name="celular"
              placeholder="Celular (somente números)"
              value={formData.celular}
              onChange={handleChange}
              className="rental-input"
            />

            <input
              type="password"
              name="password"
              placeholder="Criar senha"
              value={formData.password}
              onChange={handleChange}
              required
              className="rental-input"
            />

            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirmar senha"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="rental-input"
            />

            <button type="submit" className="continue-btn" disabled={loading}>
              {loading ? "Criando conta..." : "Criar conta gratuita"}
            </button>
          </form>

          <div className="rental-footer">
            <a href="#" className="footer-link">
              Política de Privacidade
            </a>
            <a href="#" className="footer-link">
              Termos de Uso
            </a>
          </div>

          <div className="auth-switch-rental">
            <p>Já tem uma conta?</p>
            <button className="switch-button-rental" onClick={switchToLogin}>
              Fazer login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
