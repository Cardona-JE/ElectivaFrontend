import { useState } from "react";
import { loginUser, registerUser } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import "./AuthModal.css";

export default function AuthModal({ modo: modoInicial = "login", onClose }) {
  const [modo, setModo] = useState(modoInicial);
  const [form, setForm] = useState({
    nombre: "", apellido: "", email: "", password: ""
  });
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);
  const { guardarSesion } = useAuth();

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCargando(true);
    setError("");

    try {
      if (modo === "login") {
        const data = await loginUser({ email: form.email, password: form.password });
        guardarSesion(data.token, {
          nombre: data.nombre,
          apellido: data.apellido,
          email: data.email,
          rol: data.rol
        });
        onClose();
      } else {
        await registerUser({
          nombre: form.nombre,
          apellido: form.apellido,
          email: form.email,
          password: form.password
        });
        // Después del registro, hacer login automático
        const data = await loginUser({ email: form.email, password: form.password });
        guardarSesion(data.token, {
          nombre: data.nombre,
          apellido: data.apellido,
          email: data.email,
          rol: data.rol
        });
        onClose();
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-box">
        <button className="modal-btn-close" onClick={onClose}>✕</button>

        <h2>{modo === "login" ? "Iniciar sesión" : "Crear cuenta"}</h2>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {modo === "register" && (
            <>
              <input
                name="nombre"
                placeholder="Nombre"
                value={form.nombre}
                onChange={handleChange}
                required
              />
              <input
                name="apellido"
                placeholder="Apellido"
                value={form.apellido}
                onChange={handleChange}
                required
              />
            </>
          )}

          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />

          <input
            name="password"
            type="password"
            placeholder="Contraseña"
            value={form.password}
            onChange={handleChange}
            required
            minLength={6}
          />

          {error && <p className="modal-error">{error}</p>}

          <button className="modal-btn-primary" type="submit" disabled={cargando}>
            {cargando ? "Cargando..." : modo === "login" ? "Ingresar" : "Registrarme"}
          </button>
        </form>

        <button
          className="modal-btn-secondary"
          onClick={() => {
            setModo(modo === "login" ? "register" : "login");
            setError("");
          }}
        >
          {modo === "login"
            ? "¿No tenés cuenta? Registrate"
            : "¿Ya tenés cuenta? Iniciá sesión"}
        </button>
      </div>
    </div>
  );
}
