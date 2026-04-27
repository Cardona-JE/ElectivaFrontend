import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Navbar from "../../components/layout/Navbar/Navbar";
import Footer from "../../components/layout/Footer/Footer";
import UserTable from "../../components/AdminComponents/UserTable/UserTable";
import CaracteristicasManager from "../../components/AdminComponents/CaracteristicasManager/CaracteristicasManager";
import PeliculasCaracteristicas from "../../components/AdminComponents/PeliculasCaracteristicas/PeliculasCaracteristicas";
import "./AdminPanel.css";

const API_BASE = "http://localhost:8080";

export default function AdminPanel() {
  const { token, usuario } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("usuarios");
  const [accesoDenegado, setAccesoDenegado] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      navigate("/");
      return;
    }
    // Verificar acceso al panel
    fetch(`${API_BASE}/administracion`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (res.status === 403) setAccesoDenegado(true);
        setLoading(false);
      })
      .catch(() => {
        setAccesoDenegado(true);
        setLoading(false);
      });
  }, [token, navigate]);

  // HU9: Panel no disponible en mobile
  const esMobile = window.innerWidth <= 768;
  if (esMobile) {
    return (
      <>
        <Navbar />
        <div style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px",
          textAlign: "center",
          flexDirection: "column",
          gap: "16px",
          paddingTop: "80px"
        }}>
          <span style={{ fontSize: "48px" }}>🖥️</span>
          <h2 style={{ fontSize: "22px", color: "#1e1e2e" }}>
            Panel no disponible en dispositivos móviles
          </h2>
          <p style={{ color: "#666", maxWidth: "320px" }}>
            El panel de administración solo está disponible desde una
            computadora de escritorio o tablet en modo horizontal.
          </p>
          <button
            onClick={() => navigate("/")}
            style={{
              marginTop: "8px",
              padding: "10px 24px",
              background: "#4f46e5",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "15px"
            }}
          >
            Volver al inicio
          </button>
        </div>
        <Footer />
      </>
    );
  }

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="admin-loading-spinner" />
        <p>Verificando acceso…</p>
      </div>
    );
  }

  if (accesoDenegado) {
    return (
      <>
        <Navbar />
        <div className="admin-denied">
          <div className="admin-denied-card">
            <span className="admin-denied-icon">🔒</span>
            <h2>Acceso denegado</h2>
            <p>No tienes permisos para acceder al panel de administración.</p>
            <button onClick={() => navigate("/")} className="admin-denied-btn">
              Volver al inicio
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const tabs = [
    { id: "usuarios", label: "👥 Usuarios", desc: "Gestionar roles" },
    { id: "caracteristicas", label: "🏷️ Características", desc: "ABM características" },
    { id: "peliculas-car", label: "🎬 Películas", desc: "Asignar características" },
  ];

  return (
    <>
      <Navbar />
      <main className="admin-main">
        {/* Header */}
        <div className="admin-header">
          <div className="admin-header-inner">
            <div className="admin-title-block">
              <div className="admin-badge">Panel de Administración</div>
              <h1 className="admin-title">Control de CineReserva</h1>
              <p className="admin-subtitle">
                Bienvenido, <strong>{usuario?.nombre}</strong>. Gestiona usuarios, características y catálogo.
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="admin-tabs-wrapper">
          <div className="admin-tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`admin-tab ${activeTab === tab.id ? "admin-tab--active" : ""}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <span className="admin-tab-label">{tab.label}</span>
                <span className="admin-tab-desc">{tab.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="admin-content">
          {activeTab === "usuarios" && <UserTable token={token} apiBase={API_BASE} />}
          {activeTab === "caracteristicas" && <CaracteristicasManager token={token} apiBase={API_BASE} />}
          {activeTab === "peliculas-car" && <PeliculasCaracteristicas token={token} apiBase={API_BASE} />}
        </div>
      </main>
      <Footer />
    </>
  );
}