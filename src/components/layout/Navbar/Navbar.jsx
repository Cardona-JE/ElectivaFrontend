import "./Navbar.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { logoutUser } from "../../../services/api";
import AuthModal from "../../auth/AuthModal";

export default function Navbar() {
  const navigate = useNavigate();
  const { usuario, token, cerrarSesion } = useAuth();
  const [modal, setModal] = useState(null); // "login" | "register" | null
  const [dropdown, setDropdown] = useState(false);

  const iniciales = usuario
    ? `${usuario.nombre?.[0] || ""}${usuario.apellido?.[0] || ""}`.toUpperCase()
    : "";

  const esAdmin = usuario?.rol === "ADMIN";

  const handleLogout = async () => {
    try {
      await logoutUser(token);
    } catch (_) {
      // Si falla la llamada, igual cerramos sesión localmente
    }
    cerrarSesion();
    setDropdown(false);
  };

  return (
    <>
      <header className="navbar">
        <div className="navbar-container">

          <div onClick={() => navigate("/")} className="navbar-logo">
            <div className="logo-box">C</div>
            <span>CineReserva</span>
          </div>

          <div className="navbar-buttons">
            {usuario ? (
              // Usuario autenticado: mostrar avatar con dropdown
              <div style={{ position: "relative" }}>

                <div
                  onClick={() => setDropdown(prev => !prev)}
                  style={{
                    width: "38px",
                    height: "38px",
                    borderRadius: "50%",
                    background: "white",
                    color: "#4f46e5",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: "bold",
                    cursor: "pointer",
                    fontSize: "14px",
                    userSelect: "none",
                    verticalAlign: "middle",
                  }}
                  title={`${usuario.nombre} ${usuario.apellido}`}
                >
                  {iniciales}
                </div>

                {dropdown && (
                  <div style={{
                    position: "absolute",
                    right: 0,
                    top: "46px",
                    background: "white",
                    color: "#1e1e2e",
                    borderRadius: "8px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                    minWidth: "200px",
                    zIndex: 999,
                    padding: "8px 0"
                  }}>
                    <div style={{ padding: "10px 16px", borderBottom: "1px solid #eee" }}>
                      <strong style={{ fontSize: "14px" }}>
                        {usuario.nombre} {usuario.apellido}
                      </strong>
                      <p style={{ margin: "2px 0 0", fontSize: "12px", color: "#888" }}>
                        {usuario.email}
                      </p>
                      {esAdmin && (
                        <span style={{
                          display: "inline-block",
                          marginTop: "6px",
                          background: "#ede9fe",
                          color: "#7c3aed",
                          fontSize: "11px",
                          fontWeight: "700",
                          padding: "2px 8px",
                          borderRadius: "20px",
                        }}>
                          ⚡ ADMIN
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => { navigate("/mis-reservas"); setDropdown(false); }}
                      style={{
                        width: "100%",
                        padding: "10px 16px",
                        background: "none",
                        border: "none",
                        textAlign: "left",
                        cursor: "pointer",
                        fontSize: "14px",
                        color: "#1e1e2e"
                      }}
                    >
                      🎬 Mis reservas
                    </button>

                    {esAdmin && (
                      <button
                        onClick={() => { navigate("/administracion"); setDropdown(false); }}
                        style={{
                          width: "100%",
                          padding: "10px 16px",
                          background: "none",
                          border: "none",
                          textAlign: "left",
                          cursor: "pointer",
                          fontSize: "14px",
                          color: "#4f46e5",
                          fontWeight: "600",
                        }}
                      >
                        ⚙️ Panel de administración
                      </button>
                    )}

                    <button
                      onClick={handleLogout}
                      style={{
                        width: "100%",
                        padding: "10px 16px",
                        background: "none",
                        border: "none",
                        textAlign: "left",
                        cursor: "pointer",
                        fontSize: "14px",
                        color: "#dc2626"
                      }}
                    >
                      Cerrar sesión
                    </button>
                  </div>
                )}
              </div>
            ) : (
              // Sin sesión: botones de registro y login
              <>
                <button
                  className="btn btn-primary"
                  onClick={() => setModal("register")}
                >
                  Crear cuenta
                </button>
                <button
                  className="btn btn-outline"
                  onClick={() => setModal("login")}
                >
                  Iniciar sesión
                </button>
              </>
            )}
          </div>

        </div>
      </header>

      {modal && (
        <AuthModal
          modo={modal}
          onClose={() => setModal(null)}
        />
      )}
    </>
  );
}