import { useState, useEffect } from "react";
import "./UserTable.css";

export default function UserTable({ token, apiBase }) {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchUsuarios = async () => {
    try {
      const res = await fetch(`${apiBase}/administracion/usuarios`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setUsuarios(data);
    } catch {
      setError("No se pudo cargar la lista de usuarios.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const cambiarRol = async (id, rolActual) => {
    const nuevoRol = rolActual === "ADMIN" ? "USER" : "ADMIN";
    setUpdating(id);
    try {
      const res = await fetch(`${apiBase}/administracion/usuarios/${id}/rol`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ rol: nuevoRol }),
      });
      if (res.ok) {
        setUsuarios((prev) =>
          prev.map((u) => (u.id === id ? { ...u, rol: nuevoRol } : u))
        );
        showToast(`Rol actualizado a ${nuevoRol} correctamente`);
      } else {
        showToast("Error al actualizar el rol", "error");
      }
    } catch {
      showToast("Error de conexión", "error");
    } finally {
      setUpdating(null);
    }
  };

  if (loading) return <div className="ut-loading">Cargando usuarios…</div>;
  if (error) return <div className="ut-error">{error}</div>;

  return (
    <div className="ut-wrapper">
      {toast && (
        <div className={`ut-toast ut-toast--${toast.type}`}>{toast.msg}</div>
      )}

      <div className="ut-header">
        <div>
          <h2 className="ut-title">Gestión de Usuarios</h2>
          <p className="ut-desc">{usuarios.length} usuarios registrados</p>
        </div>
      </div>

      <div className="ut-table-wrapper">
        <table className="ut-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Email</th>
              <th>Rol actual</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((u) => (
              <tr key={u.id} className="ut-row">
                <td className="ut-id">#{u.id}</td>
                <td>
                  <div className="ut-user-cell">
                    <div className="ut-avatar">
                      {(u.nombre?.[0] || "") + (u.apellido?.[0] || "")}
                    </div>
                    <div>
                      <div className="ut-name">{u.nombre} {u.apellido}</div>
                    </div>
                  </div>
                </td>
                <td className="ut-email">{u.email}</td>
                <td>
                  <span className={`ut-badge ut-badge--${u.rol === "ADMIN" ? "admin" : "user"}`}>
                    {u.rol === "ADMIN" ? "⚡ Admin" : "👤 Usuario"}
                  </span>
                </td>
                <td>
                  <button
                    className={`ut-btn ${u.rol === "ADMIN" ? "ut-btn--revoke" : "ut-btn--grant"}`}
                    onClick={() => cambiarRol(u.id, u.rol)}
                    disabled={updating === u.id}
                  >
                    {updating === u.id
                      ? "…"
                      : u.rol === "ADMIN"
                      ? "Quitar Admin"
                      : "Dar Admin"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}