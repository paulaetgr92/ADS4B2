import React, { useState, useEffect } from "react";
import {
  criarProduto,
  listarProdutos,
  buscarProdutoPorId,
  atualizarProduto,
  inativarProduto,
} from "./produtos";
import "./AdminDashboard.css";

const AdminDashboard = ({ adminToken, onLogout }) => {
  const [activeTab, setActiveTab] = useState("listar");
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [viewingProduct, setViewingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const [produtoForm, setProdutoForm] = useState({
    categoria: "",
    tamanho: "",
    cores: "",
    tempoValor: "",
    status: "disponivel",
    localizacao: "",
    imagem_url: "",
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

  const fetchProdutos = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await listarProdutos();
      console.log("Resposta da API:", response);
      
      // Backend retorna array direto
      const produtosArray = Array.isArray(response) ? response : [];
      console.log("Produtos processados:", produtosArray);
      
      setProdutos(produtosArray);
    } catch (error) {
      console.error("Erro ao carregar produtos:", error);
      setError("Erro ao carregar produtos: " + error.message);
      setProdutos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProdutos();
  }, []);

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

      await criarProduto(produtoData);
      setSuccess("✅ Produto cadastrado com sucesso!");
      setProdutoForm({
        categoria: "",
        tamanho: "",
        cores: "",
        tempoValor: "",
        status: "disponivel",
        localizacao: "",
      imagem_url: "",
      });
      fetchProdutos();
      setTimeout(() => setSuccess(""), 3000);
    } catch (error) {
      setError(error.message || "Erro ao cadastrar produto");
    } finally {
      setLoading(false);
    }
  };

  const handleViewProduct = async (productId) => {
    setLoading(true);
    setError("");
    try {
      const produto = await buscarProdutoPorId(productId);
      console.log("Produto buscado:", produto);
      setViewingProduct(produto);
      setShowViewModal(true);
    } catch (error) {
      setError("Erro ao carregar produto");
    } finally {
      setLoading(false);
    }
  };

  const handleEditProduct = async (productId) => {
    setLoading(true);
    setError("");
    try {
      const produto = await buscarProdutoPorId(productId);
      console.log("Produto para editar:", produto);
      setEditingProduct(produto);
      setProdutoForm({
        categoria: produto.categoria || "",
        tamanho: produto.tamanho || "",
        cores: produto.cores || "",
        tempoValor: produto.tempoValor || "",
        status: produto.status || "disponivel",
        localizacao: produto.localizacao || "",
        imagem_url: produto.imagem_url || "",
      });
      setShowEditModal(true);
    } catch (error) {
      setError("Erro ao carregar produto para edição");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const produtoData = {
        ...produtoForm,
        tempoValor: parseInt(produtoForm.tempoValor),
      };

      await atualizarProduto(editingProduct.id_roupa, produtoData);
      setSuccess("✅ Produto atualizado com sucesso!");
      setShowEditModal(false);
      setEditingProduct(null);
      setProdutoForm({
        categoria: "",
        tamanho: "",
        cores: "",
        tempoValor: "",
        status: "disponivel",
        localizacao: "",
      imagem_url: "",
      });
      fetchProdutos();
      setTimeout(() => setSuccess(""), 3000);
    } catch (error) {
      setError(error.message || "Erro ao atualizar produto");
    } finally {
      setLoading(false);
    }
  };

  const handleInactivateProduct = async (productId) => {
    if (!window.confirm("⚠️ Tem certeza que deseja inativar este produto?")) {
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await inativarProduto(productId);
      setSuccess("✅ Produto inativado com sucesso!");
      fetchProdutos();
      setTimeout(() => setSuccess(""), 3000);
    } catch (error) {
      setError(error.message || "Erro ao inativar produto");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminEmail");
    onLogout();
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setEditingProduct(null);
    setProdutoForm({
      categoria: "",
      tamanho: "",
      cores: "",
      tempoValor: "",
      status: "disponivel",
      localizacao: "",
    imagem_url: "",
      });
  };

  const closeViewModal = () => {
    setShowViewModal(false);
    setViewingProduct(null);
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "disponivel":
        return "Disponível";
      case "alugado":
        return "Alugado";
      case "manutencao":
        return "Manutenção";
      default:
        return status;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "disponivel":
        return "✅";
      case "alugado":
        return "📦";
      case "manutencao":
        return "🔧";
      default:
        return "❓";
    }
  };

  const filteredProdutos = produtos.filter((produto) => {
    const matchesSearch =
      !searchTerm ||
      (produto.categoria || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (produto.cores || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (produto.id_roupa || "").toString().includes(searchTerm);

    const matchesStatus =
      !filterStatus || (produto.status || "") === filterStatus;

    return matchesSearch && matchesStatus;
  });

    const getImageForCategory = (categoria, imagemUrl) => {
    // Se tem imagem_url, usa ela
    if (imagemUrl && imagemUrl.trim() !== "") {
      return imagemUrl;
    }
    
    // Senão, usa imagem padrão por categoria
    const imageMap = {
      Vestido:
        "https://images.unsplash.com/photo-1566479179817-c0b5b4b4b1b5?w=300&h=400&fit=crop",
      Blazer:
        "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=300&h=400&fit=crop",
      Saia: "https://images.unsplash.com/photo-1583496661160-fb5886a13d77?w=300&h=400&fit=crop",
      Calça:
        "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=300&h=400&fit=crop",
      Camisa:
        "https://images.unsplash.com/photo-1571945153237-4929e783af4a?w=300&h=400&fit=crop",
      Casaco:
        "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=300&h=400&fit=crop",
      Acessório:
        "https://images.unsplash.com/photo-1506629905607-d405b7a82e96?w=300&h=400&fit=crop",
    };
    return (
      imageMap[categoria] ||
      "https://images.unsplash.com/photo-1445205170230-053b83016050?w=300&h=400&fit=crop"
    );
  };

  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <div className="admin-header-content">
          <div className="header-left">
            <h1>🎯 Painel Administrativo</h1>
            <p className="header-subtitle">Gerenciamento de Produtos</p>
          </div>
          <div className="admin-user-info">
            <div className="user-badge">
              <span className="user-icon">👤</span>
              <span>{localStorage.getItem("adminEmail")}</span>
            </div>
            <button onClick={handleLogout} className="logout-btn">
              🚪 Sair
            </button>
          </div>
        </div>
      </header>

      <div className="admin-content">
        <nav className="admin-sidebar">
          <ul className="admin-nav">
            <li>
              <button
                className={`nav-btn ${activeTab === "listar" ? "active" : ""}`}
                onClick={() => setActiveTab("listar")}
              >
                <span className="nav-icon">📦</span>
                <span>Listar Produtos</span>
              </button>
            </li>
            <li>
              <button
                className={`nav-btn ${
                  activeTab === "cadastrar" ? "active" : ""
                }`}
                onClick={() => setActiveTab("cadastrar")}
              >
                <span className="nav-icon">➕</span>
                <span>Cadastrar Produto</span>
              </button>
            </li>
          </ul>

          <div className="sidebar-stats">
            <h3>📊 Estatísticas</h3>
            <div className="stat-item">
              <span className="stat-label">Total de Produtos</span>
              <span className="stat-value">{produtos.length}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Disponíveis</span>
              <span className="stat-value stat-success">
                {produtos.filter((p) => p.status === "disponivel").length}
              </span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Alugados</span>
              <span className="stat-value stat-warning">
                {produtos.filter((p) => p.status === "alugado").length}
              </span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Manutenção</span>
              <span className="stat-value stat-danger">
                {produtos.filter((p) => p.status === "manutencao").length}
              </span>
            </div>
          </div>
        </nav>

        <main className="admin-main">
          {error && (
            <div className="alert alert-error">
              <span className="alert-icon">❌</span>
              <span>{error}</span>
              <button className="alert-close" onClick={() => setError("")}>
                ✕
              </button>
            </div>
          )}
          {success && (
            <div className="alert alert-success">
              <span className="alert-icon">✅</span>
              <span>{success}</span>
              <button className="alert-close" onClick={() => setSuccess("")}>
                ✕
              </button>
            </div>
          )}

          {activeTab === "listar" && (
            <div className="listar-section">
              <div className="section-header">
                <div>
                  <h2>📦 Produtos Cadastrados</h2>
                  <p>Visualize, edite e gerencie todos os produtos</p>
                </div>
                <button
                  className="btn-refresh"
                  onClick={fetchProdutos}
                  disabled={loading}
                >
                  {loading ? "🔄" : "↻"} Atualizar
                </button>
              </div>

              <div className="filters-bar">
                <div className="search-box">
                  <span className="search-icon">🔍</span>
                  <input
                    type="text"
                    placeholder="Buscar por ID, categoria ou cor..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <select
                  className="filter-select"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="">Todos os Status</option>
                  <option value="disponivel">Disponível</option>
                  <option value="alugado">Alugado</option>
                  <option value="manutencao">Manutenção</option>
                </select>
              </div>

              {loading ? (
                <div className="loading-state">
                  <div className="loading-spinner">🔄</div>
                  <p>Carregando produtos...</p>
                </div>
              ) : filteredProdutos.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">📭</div>
                  <h3>Nenhum produto encontrado</h3>
                  <p>
                    {searchTerm || filterStatus
                      ? "Tente ajustar os filtros de busca"
                      : "Cadastre produtos na aba 'Cadastrar Produto'"}
                  </p>
                </div>
              ) : (
                <div className="products-grid">
                  {filteredProdutos.map((produto) => (
                    <div key={produto.id_roupa} className="product-card-admin">
                      <div className="product-card-image">
                        <img
                          src={getImageForCategory(produto.categoria, produto.imagem_url)}
                          alt={produto.categoria}
                        />
                        <div className="product-card-badge">
                          <span className={`status-badge ${produto.status}`}>
                            {getStatusIcon(produto.status)}{" "}
                            {getStatusLabel(produto.status)}
                          </span>
                        </div>
                      </div>
                      <div className="product-card-content">
                        <div className="product-card-header">
                          <h3>{produto.categoria}</h3>
                          <span className="product-id">#{produto.id_roupa}</span>
                        </div>
                        <div className="product-card-details">
                          <div className="detail-item">
                            <span className="detail-icon">📏</span>
                            <span>{produto.tamanho}</span>
                          </div>
                          <div className="detail-item">
                            <span className="detail-icon">🎨</span>
                            <span>{produto.cores}</span>
                          </div>
                          <div className="detail-item">
                            <span className="detail-icon">💰</span>
                            <span>R$ {(produto.tempoValor || 0).toFixed(2)}/dia</span>
                          </div>
                          <div className="detail-item">
                            <span className="detail-icon">📍</span>
                            <span>{produto.localizacao}</span>
                          </div>
                        </div>
                        <div className="product-card-actions">
                          <button
                            className="btn-action btn-view"
                            onClick={() => handleViewProduct(produto.id_roupa)}
                            title="Ver Detalhes"
                          >
                            👁️ Ver
                          </button>
                          <button
                            className="btn-action btn-edit"
                            onClick={() => handleEditProduct(produto.id_roupa)}
                            title="Editar"
                          >
                            ✏️ Editar
                          </button>
                          <button
                            className="btn-action btn-inactivate"
                            onClick={() =>
                              handleInactivateProduct(produto.id_roupa)
                            }
                            title="Inativar"
                            disabled={produto.status === "manutencao"}
                          >
                            🚫 Inativar
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "cadastrar" && (
            <div className="cadastrar-section">
              <div className="section-header">
                <div>
                  <h2>➕ Cadastrar Novo Produto</h2>
                  <p>Adicione um novo produto ao catálogo</p>
                </div>
              </div>

              <div className="form-container">
                <form onSubmit={handleSubmitProduto} className="produto-form">
                  <div className="form-grid">
                    <div className="form-group">
                      <label htmlFor="categoria">
                        <span className="label-icon">📂</span>
                        Categoria
                      </label>
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
                      <label htmlFor="tamanho">
                        <span className="label-icon">📏</span>
                        Tamanho
                      </label>
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

                    <div className="form-group">
                      <label htmlFor="cores">
                        <span className="label-icon">🎨</span>
                        Cor
                      </label>
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
                      <label htmlFor="tempoValor">
                        <span className="label-icon">💰</span>
                        Valor por Dia (R$)
                      </label>
                      <input
                        type="number"
                        id="tempoValor"
                        name="tempoValor"
                        value={produtoForm.tempoValor}
                        onChange={handleProdutoChange}
                        required
                        min="1"
                        step="0.01"
                        placeholder="Ex: 50.00"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="status">
                        <span className="label-icon">📊</span>
                        Status
                      </label>
                      <select
                        id="status"
                        name="status"
                        value={produtoForm.status}
                        onChange={handleProdutoChange}
                        required
                      >
                        {statusOptions.map((status) => (
                          <option key={status} value={status}>
                            {getStatusLabel(status)}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label htmlFor="localizacao">
                        <span className="label-icon">📍</span>
                        Localização
                      </label>
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
                  
                    <div className="form-group">
                      <label htmlFor="imagem_url">
                        <span className="label-icon">🖼️</span>
                        URL da Imagem
                      </label>
                      <input
                        type="url"
                        id="imagem_url"
                        name="imagem_url"
                        value={produtoForm.imagem_url}
                        onChange={handleProdutoChange}
                        placeholder="Ex: https://exemplo.com/imagem.jpg"
                      />
                      <small style={{color: "#64748b", fontSize: "12px", marginTop: "5px", display: "block"}}>
                        Cole a URL de uma imagem hospedada (Imgur, Google Drive, etc)
                      </small>
                    </div>

</div>

                  <button
                    type="submit"
                    className="btn-submit"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="btn-spinner">🔄</span>
                        Cadastrando...
                      </>
                    ) : (
                      <>
                        <span>✅</span>
                        Cadastrar Produto
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Modal de Visualização */}
      {showViewModal && viewingProduct && (
        <div className="modal-overlay" onClick={closeViewModal}>
          <div
            className="modal-content modal-view"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h2>👁️ Detalhes do Produto</h2>
              <button className="close-btn" onClick={closeViewModal}>
                ✕
              </button>
            </div>
            <div className="modal-body">
              <div className="view-grid">
                <div className="view-image">
                  <img
                    src={getImageForCategory(viewingProduct.categoria, viewingProduct.imagem_url)}
                    alt={viewingProduct.categoria}
                  />
                </div>
                <div className="view-details">
                  <div className="view-item">
                    <span className="view-label">ID do Produto</span>
                    <span className="view-value">
                      #{viewingProduct.id_roupa}
                    </span>
                  </div>
                  <div className="view-item">
                    <span className="view-label">Categoria</span>
                    <span className="view-value">
                      {viewingProduct.categoria}
                    </span>
                  </div>
                  <div className="view-item">
                    <span className="view-label">Tamanho</span>
                    <span className="view-value">{viewingProduct.tamanho}</span>
                  </div>
                  <div className="view-item">
                    <span className="view-label">Cor</span>
                    <span className="view-value">{viewingProduct.cores}</span>
                  </div>
                  <div className="view-item">
                    <span className="view-label">Valor por Dia</span>
                    <span className="view-value view-price">
                      R$ {(viewingProduct.tempoValor || 0).toFixed(2)}
                    </span>
                  </div>
                  <div className="view-item">
                    <span className="view-label">Status</span>
                    <span className={`status-badge ${viewingProduct.status}`}>
                      {getStatusIcon(viewingProduct.status)}{" "}
                      {getStatusLabel(viewingProduct.status)}
                    </span>
                  </div>
                  <div className="view-item">
                    <span className="view-label">Localização</span>
                    <span className="view-value">
                      {viewingProduct.localizacao}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Edição */}
      {showEditModal && editingProduct && (
        <div className="modal-overlay" onClick={closeEditModal}>
          <div
            className="modal-content modal-edit"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h2>✏️ Editar Produto #{editingProduct.id_roupa}</h2>
              <button className="close-btn" onClick={closeEditModal}>
                ✕
              </button>
            </div>
            <form onSubmit={handleUpdateProduct} className="modal-form">
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="edit-categoria">
                    <span className="label-icon">📂</span>
                    Categoria
                  </label>
                  <select
                    id="edit-categoria"
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
                  <label htmlFor="edit-tamanho">
                    <span className="label-icon">📏</span>
                    Tamanho
                  </label>
                  <select
                    id="edit-tamanho"
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

                <div className="form-group">
                  <label htmlFor="edit-cores">
                    <span className="label-icon">🎨</span>
                    Cor
                  </label>
                  <select
                    id="edit-cores"
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
                  <label htmlFor="edit-tempoValor">
                    <span className="label-icon">💰</span>
                    Valor por Dia (R$)
                  </label>
                  <input
                    type="number"
                    id="edit-tempoValor"
                    name="tempoValor"
                    value={produtoForm.tempoValor}
                    onChange={handleProdutoChange}
                    required
                    min="1"
                    step="0.01"
                    placeholder="Ex: 50.00"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="edit-status">
                    <span className="label-icon">📊</span>
                    Status
                  </label>
                  <select
                    id="edit-status"
                    name="status"
                    value={produtoForm.status}
                    onChange={handleProdutoChange}
                    required
                  >
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>
                        {getStatusLabel(status)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="edit-localizacao">
                    <span className="label-icon">📍</span>
                    Localização
                  </label>
                  <input
                    type="text"
                    id="edit-localizacao"
                    name="localizacao"
                    value={produtoForm.localizacao}
                    onChange={handleProdutoChange}
                    required
                    placeholder="Ex: Estoque A - Prateleira 1"
                  />
                </div>
              
                    <div className="form-group">
                      <label htmlFor="edit-imagem_url">
                        <span className="label-icon">🖼️</span>
                        URL da Imagem
                      </label>
                      <input
                        type="url"
                        id="edit-imagem_url"
                        name="imagem_url"
                        value={produtoForm.imagem_url}
                        onChange={handleProdutoChange}
                        placeholder="Ex: https://exemplo.com/imagem.jpg"
                      />
                      <small style={{color: "#64748b", fontSize: "12px", marginTop: "5px", display: "block"}}>
                        Cole a URL de uma imagem hospedada (Imgur, Google Drive, etc)
                      </small>
                    </div>

</div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={closeEditModal}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn-submit"
                  disabled={loading}
                >
                  {loading ? "Atualizando..." : "✅ Salvar Alterações"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;

