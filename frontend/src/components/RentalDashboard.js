import { useState, useEffect } from "react";
import "./RentalDashboard.css";

export default function RentalDashboard({ token, onLogout }) {
  const userEmail = localStorage.getItem("userEmail") || "Usuário";
  const [activeTab, setActiveTab] = useState("catalog");
  const [products, setProducts] = useState([]);
  const [memberSince, setMemberSince] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchProducts = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:8080/api/v1/produtos");
      if (!response.ok) {
        setError("Erro ao carregar produtos");
        setProducts([]);
        setLoading(false);
        return;
      }

      const data = await response.json();
      console.log("Dados recebidos do servidor:", data);

      const produtosArray = data.produtos || [];

      const mappedProducts = data.produtos.map((produto) => ({
        id: produto.IDRoupa,
        name: `${produto.Categoria?.String || produto.Categoria} ${
          produto.Cores?.String || produto.Cores
        }`,
        category: produto.Categoria?.String || produto.Categoria,
        size: produto.Tamanho?.String || produto.Tamanho,
        color: produto.Cores?.String || produto.Cores,
        brand: "DoutorRent",
        daily_price: produto.TempoValor?.Float64 || 0,
        weekly_price: (produto.TempoValor?.Float64 || 0) * 7,
        image_url: getImageForCategory(
          produto.Categoria?.String || produto.Categoria
        ),
        condition:
          produto.Status?.String === "disponivel"
            ? "Disponível"
            : produto.Status?.String === "alugado"
            ? "Alugado"
            : "Manutenção",
        status: produto.Status?.String,
        localizacao: produto.Localizacao?.String || produto.Localizacao,
      }));

      setProducts(mappedProducts);
    } catch (err) {
      console.error("Erro ao conectar com o servidor:", err);
      setError("Erro ao conectar com o servidor");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const getImageForCategory = (categoria) => {
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

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (token) {
      try {
        const payloadBase64 = token.split(".")[1];
        const decodedPayload = JSON.parse(atob(payloadBase64));
        console.log("Payload do token:", decodedPayload);

        const timestamp = decodedPayload.createdAt || decodedPayload.iat;
        if (timestamp) {
          const date = new Date(timestamp * 1000);
          const formatted = date.toLocaleDateString("pt-BR", {
            year: "numeric",
            month: "long",
          });
          setMemberSince(formatted);
        }
      } catch (err) {
        console.error("Erro ao decodificar token:", err);
      }
    }
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    onLogout();
  };

  const renderCatalog = () => (
    <div className="catalog-section">
      <div className="catalog-header">
        <h2>Catálogo de Roupas</h2>
        <div className="catalog-filters">
          <select className="filter-select">
            <option value="">Todas as categorias</option>
            <option value="Vestido">Vestidos</option>
            <option value="Blazer">Blazers</option>
            <option value="Saia">Saias</option>
            <option value="Calça">Calças</option>
            <option value="Camisa">Camisas</option>
            <option value="Casaco">Casacos</option>
          </select>
          <select className="filter-select">
            <option value="">Todos os tamanhos</option>
            <option value="PP">PP</option>
            <option value="P">P</option>
            <option value="M">M</option>
            <option value="G">G</option>
            <option value="GG">GG</option>
          </select>
          <button
            className="refresh-btn"
            onClick={fetchProducts}
            disabled={loading}
          >
            {loading ? "🔄" : "↻"} Atualizar
          </button>
        </div>
      </div>

      {error && (
        <div className="error-message">
          {error}
          <button onClick={fetchProducts}>Tentar novamente</button>
        </div>
      )}

      {loading ? (
        <div className="loading-state">
          <div className="loading-spinner">🔄</div>
          <p>Carregando produtos...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">👗</div>
          <h3>Nenhum produto encontrado</h3>
          <p>Ainda não há produtos cadastrados no sistema.</p>
        </div>
      ) : (
        <div className="products-grid">
          {products.map((product) => (
            <div key={product.id} className="product-card">
              <div className="product-image">
                <img src={product.image_url} alt={product.name} />
                <div className="product-overlay">
                  <button
                    className="rent-btn"
                    disabled={product.status !== "disponivel"}
                  >
                    {product.status === "disponivel"
                      ? "Alugar"
                      : product.status === "alugado"
                      ? "Alugado"
                      : "Manutenção"}
                  </button>
                </div>
              </div>
              <div className="product-info">
                <h3 className="product-name">{product.name}</h3>
                <p className="product-brand">{product.brand}</p>
                <div className="product-details">
                  <span className="product-size">Tam: {product.size}</span>
                  <span className="product-color">{product.color}</span>
                </div>
                <div className="product-pricing">
                  <div className="price-option">
                    <span className="price-label">Diária</span>
                    <span className="price-value">
                      R$ {product.daily_price.toFixed(2)}
                    </span>
                  </div>
                  <div className="price-option">
                    <span className="price-label">Semanal</span>
                    <span className="price-value">
                      R$ {product.weekly_price.toFixed(2)}
                    </span>
                  </div>
                </div>
                <div className="product-condition">
                  <span className={`condition-badge ${product.status}`}>
                    {product.condition}
                  </span>
                </div>
                {product.localizacao && (
                  <div className="product-location">
                    📍 {product.localizacao}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderMyRentals = () => (
    <div className="rentals-section">
      <h2>Meus Aluguéis</h2>
      <div className="empty-state">
        <div className="empty-icon">📦</div>
        <h3>Nenhum aluguel ainda</h3>
        <p>Explore nosso catálogo e alugue sua primeira peça!</p>
        <button className="browse-btn" onClick={() => setActiveTab("catalog")}>
          Explorar Catálogo
        </button>
      </div>
    </div>
  );

  const renderProfile = () => (
    <div className="profile-section">
      <h2>Meu Perfil</h2>
      <div className="profile-card">
        <div className="profile-avatar">
          <div className="avatar-circle">👤</div>
        </div>
        <div className="profile-info">
          <h3>Informações Pessoais</h3>
          <div className="info-item">
            <label>Email:</label>
            <span>{userEmail}</span>
          </div>
          <div className="info-item">
            <label>Status:</label>
            <span className="status-badge">Ativo</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="rental-dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <div className="brand-section">
            <h1 className="brand-title">DoutorRent</h1>
            <p className="brand-subtitle">Seu guarda-roupa virtual</p>
          </div>
          <div className="user-section">
            <div className="user-info">
              <div className="user-avatar">👤</div>
              <span className="user-name">Olá, {userEmail.split("@")[0]}!</span>
            </div>
            <button className="logout-btn" onClick={handleLogout}>
              Sair
            </button>
          </div>
        </div>
      </header>

      <nav className="dashboard-nav">
        <button
          className={`nav-btn ${activeTab === "catalog" ? "active" : ""}`}
          onClick={() => setActiveTab("catalog")}
        >
          <span className="nav-icon">👗</span>
          Catálogo
        </button>
        <button
          className={`nav-btn ${activeTab === "rentals" ? "active" : ""}`}
          onClick={() => setActiveTab("rentals")}
        >
          <span className="nav-icon">📦</span>
          Meus Aluguéis
        </button>
        <button
          className={`nav-btn ${activeTab === "profile" ? "active" : ""}`}
          onClick={() => setActiveTab("profile")}
        >
          <span className="nav-icon">👤</span>
          Perfil
        </button>
      </nav>

      <main className="dashboard-main">
        {activeTab === "catalog" && renderCatalog()}
        {activeTab === "rentals" && renderMyRentals()}
        {activeTab === "profile" && renderProfile()}
      </main>
    </div>
  );
}
