import React, { useState, useEffect } from "react";
import "./AdminDashboard.css";

const AdminDashboard = ({ adminToken, onLogout }) => {
  const [activeTab, setActiveTab] = useState("produtos");
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [produtoForm, setProdutoForm] = useState({
    categoria: "",
    tamanho: "",
    cores: "",
    tempoValor: "",
    status: "disponivel",
    localizacao: "",
  });

  const categorias = [
    "Vestido",
    "Camisa",
    "Calça",
    "Saia",
    "Blazer",
    "Casaco",
    "Acessório",
  ];
  const tamanhos = ["PP", "P", "M", "G", "GG", "XG"];
  const cores = [
    "Preto",
    "Branco",
    "Azul",
    "Vermelho",
    "Verde",
    "Amarelo",
    "Rosa",
    "Roxo",
    "Cinza",
    "Marrom",
  ];
  const statusOptions = ["disponivel", "alugado", "manutencao"];

  const handleProdutoChange = (e) => {
    const { name, value } = e.target;
    setProdutoForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmitProduto = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const produtoData = {
        ...produtoForm,
        tempoValor: parseInt(produtoForm.tempoValor),
      };

      const response = await fetch("http://localhost:8080/api/v1/produtos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(produtoData),
      });

      if (response.ok) {
        const data = await response.json();
        setSuccess("Produto cadastrado com sucesso!");
        setProdutoForm({
          categoria: "",
          tamanho: "",
          cores: "",
          tempoValor: "",
          status: "disponivel",
          localizacao: "",
        });
        setTimeout(() => setSuccess(""), 3000);
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Erro ao cadastrar produto");
      }
    } catch (error) {
      setError("Erro ao conectar com o servidor");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminEmail");
    onLogout();
  };

  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <div className="admin-header-content">
          <h1>Painel Administrativo</h1>
          <div className="admin-user-info">
            <span>Admin: {localStorage.getItem("adminEmail")}</span>
            <button onClick={handleLogout} className="logout-btn">
              Sair
            </button>
          </div>
        </div>
      </header>

      <div className="admin-content">
        <nav className="admin-sidebar">
          <ul className="admin-nav">
            <li>
              <button
                className={`nav-btn ${
                  activeTab === "produtos" ? "active" : ""
                }`}
                onClick={() => setActiveTab("produtos")}
              >
                📦 Produtos
              </button>
            </li>
            <li>
              <button
                className={`nav-btn ${
                  activeTab === "relatorios" ? "active" : ""
                }`}
                onClick={() => setActiveTab("relatorios")}
              >
                📊 Relatórios
              </button>
            </li>
          </ul>
        </nav>

        <main className="admin-main">
          {activeTab === "produtos" && (
            <div className="produtos-section">
              <div className="section-header">
                <h2>Cadastro de Produtos</h2>
                <p>Adicione novos produtos ao catálogo</p>
              </div>

              <div className="produto-form-container">
                <form onSubmit={handleSubmitProduto} className="produto-form">
                  {error && <div className="error-message">{error}</div>}
                  {success && <div className="success-message">{success}</div>}

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="categoria">Categoria</label>
                      <select
                        id="categoria"
                        name="categoria"
                        value={produtoForm.categoria}
                        onChange={handleProdutoChange}
                        required
                      >
                        <option value="">Selecione uma categoria</option>
                        {categorias.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label htmlFor="tamanho">Tamanho</label>
                      <select
                        id="tamanho"
                        name="tamanho"
                        value={produtoForm.tamanho}
                        onChange={handleProdutoChange}
                        required
                      >
                        <option value="">Selecione um tamanho</option>
                        {tamanhos.map((tam) => (
                          <option key={tam} value={tam}>
                            {tam}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="cores">Cor</label>
                      <select
                        id="cores"
                        name="cores"
                        value={produtoForm.cores}
                        onChange={handleProdutoChange}
                        required
                      >
                        <option value="">Selecione uma cor</option>
                        {cores.map((cor) => (
                          <option key={cor} value={cor}>
                            {cor}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label htmlFor="tempoValor">Valor por Dia (R$)</label>
                      <input
                        type="number"
                        id="tempoValor"
                        name="tempoValor"
                        value={produtoForm.tempoValor}
                        onChange={handleProdutoChange}
                        required
                        min="1"
                        placeholder="Ex: 50"
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="status">Status</label>
                      <select
                        id="status"
                        name="status"
                        value={produtoForm.status}
                        onChange={handleProdutoChange}
                        required
                      >
                        {statusOptions.map((status) => (
                          <option key={status} value={status}>
                            {status === "disponivel"
                              ? "Disponível"
                              : status === "alugado"
                              ? "Alugado"
                              : "Manutenção"}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label htmlFor="localizacao">Localização</label>
                      <input
                        type="text"
                        id="localizacao"
                        name="localizacao"
                        value={produtoForm.localizacao}
                        onChange={handleProdutoChange}
                        required
                        placeholder="Ex: Estoque A - Prateleira 1"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="submit-btn"
                    disabled={loading}
                  >
                    {loading ? "Cadastrando..." : "Cadastrar Produto"}
                  </button>
                </form>
              </div>
            </div>
          )}

          {activeTab === "relatorios" && (
            <div className="relatorios-section">
              <div className="section-header">
                <h2>Relatórios</h2>
                <p>Visualize estatísticas e relatórios do sistema</p>
              </div>
              <div className="coming-soon">
                <p>📊 Relatórios em desenvolvimento...</p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
