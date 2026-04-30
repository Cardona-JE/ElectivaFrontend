import { useState, useEffect } from "react";
import "./CaracteristicasManager.css";

// Lista curada de íconos de Material Icons relevantes para una plataforma de películas
const ICONOS_DISPONIBLES = [
  { nombre: "movie",            etiqueta: "Película" },
  { nombre: "theaters",         etiqueta: "Teatro" },
  { nombre: "live_tv",          etiqueta: "TV en vivo" },
  { nombre: "hd",               etiqueta: "HD" },
  { nombre: "4k",               etiqueta: "4K" },
  { nombre: "volume_up",        etiqueta: "Audio" },
  { nombre: "subtitles",        etiqueta: "Subtítulos" },
  { nombre: "hearing",          etiqueta: "Audio desc." },
  { nombre: "language",         etiqueta: "Idioma" },
  { nombre: "translate",        etiqueta: "Traducción" },
  { nombre: "download",         etiqueta: "Descarga" },
  { nombre: "offline_pin",      etiqueta: "Sin internet" },
  { nombre: "devices",          etiqueta: "Multidispositivo" },
  { nombre: "smartphone",       etiqueta: "Mobile" },
  { nombre: "laptop",           etiqueta: "PC" },
  { nombre: "tv",               etiqueta: "Smart TV" },
  { nombre: "child_friendly",   etiqueta: "Familiar" },
  { nombre: "18_up_rating",     etiqueta: "+18" },
  { nombre: "star",             etiqueta: "Destacado" },
  { nombre: "new_releases",     etiqueta: "Estreno" },
  { nombre: "local_fire_department", etiqueta: "Tendencia" },
  { nombre: "favorite",         etiqueta: "Favorito" },
  { nombre: "thumb_up",         etiqueta: "Popular" },
  { nombre: "workspace_premium",etiqueta: "Premium" },
  { nombre: "lock",             etiqueta: "Exclusivo" },
  { nombre: "closed_caption",   etiqueta: "CC" },
  { nombre: "surround_sound",   etiqueta: "Sonido envolvente" },
  { nombre: "videocam",         etiqueta: "Cámara" },
  { nombre: "sports",           etiqueta: "Deportes" },
  { nombre: "music_note",       etiqueta: "Musical" },
];

export default function CaracteristicasManager({ token, apiBase }) {
  const [caracteristicas, setCaracteristicas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [form, setForm] = useState({ nombre: "", icono: "" });
  const [editando, setEditando] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [saving, setSaving] = useState(false);
  const [selectorAbierto, setSelectorAbierto] = useState(false);
  const [filtroIcono, setFiltroIcono] = useState("");

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchCaracteristicas = async () => {
    try {
      const res = await fetch(`${apiBase}/caracteristicas`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setCaracteristicas(Array.isArray(data) ? data : []);
    } catch {
      showToast("Error al cargar características", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCaracteristicas(); }, []);

  const handleSubmit = async () => {
    if (!form.nombre.trim()) {
      showToast("El nombre es obligatorio", "error");
      return;
    }
    setSaving(true);
    try {
      const isEdit = editando !== null;
      const url = isEdit
        ? `${apiBase}/caracteristicas/${editando}`
        : `${apiBase}/caracteristicas`;
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nombre: form.nombre, icono: form.icono }),
      });

      if (res.ok) {
        showToast(isEdit ? "Característica actualizada" : "Característica creada");
        setForm({ nombre: "", icono: "" });
        setEditando(null);
        setSelectorAbierto(false);
        fetchCaracteristicas();
      } else {
        const err = await res.json();
        showToast(err.error || "Error al guardar", "error");
      }
    } catch {
      showToast("Error de conexión", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleEditar = (c) => {
    setEditando(c.id);
    setForm({ nombre: c.nombre, icono: c.icono || "" });
    setSelectorAbierto(false);
  };

  const handleEliminar = async (id) => {
    if (!window.confirm("¿Eliminar esta característica?")) return;
    setDeleting(id);
    try {
      const res = await fetch(`${apiBase}/caracteristicas/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        showToast("Característica eliminada");
        setCaracteristicas((prev) => prev.filter((c) => c.id !== id));
      } else {
        showToast("Error al eliminar", "error");
      }
    } catch {
      showToast("Error de conexión", "error");
    } finally {
      setDeleting(null);
    }
  };

  const cancelarEdicion = () => {
    setEditando(null);
    setForm({ nombre: "", icono: "" });
    setSelectorAbierto(false);
  };

  const seleccionarIcono = (nombreIcono) => {
    setForm((f) => ({ ...f, icono: nombreIcono }));
    setSelectorAbierto(false);
    setFiltroIcono("");
  };

  const iconosFiltrados = ICONOS_DISPONIBLES.filter((ic) =>
    ic.etiqueta.toLowerCase().includes(filtroIcono.toLowerCase()) ||
    ic.nombre.toLowerCase().includes(filtroIcono.toLowerCase())
  );

  return (
    <div className="cm-wrapper">
      {toast && (
        <div className={`cm-toast cm-toast--${toast.type}`}>{toast.msg}</div>
      )}

      <div className="cm-layout">
        {/* Form */}
        <div className="cm-form-card">
          <h3 className="cm-form-title">
            {editando ? "✏️ Editar característica" : "➕ Nueva característica"}
          </h3>

          {/* Selector de ícono */}
          <div className="cm-field">
            <label className="cm-label">Ícono</label>

            {/* Preview del ícono seleccionado + botón para abrir selector */}
            <div className="cm-icon-preview-row">
              <div className="cm-icon-preview">
                {form.icono ? (
                  <span className="material-icons cm-icon-preview-icon">
                    {form.icono}
                  </span>
                ) : (
                  <span className="cm-icon-preview-empty">?</span>
                )}
              </div>
              <button
                type="button"
                className="cm-btn-select-icon"
                onClick={() => setSelectorAbierto((v) => !v)}
              >
                {form.icono ? `${form.icono}` : "Elegir ícono"}
              </button>
              {form.icono && (
                <button
                  type="button"
                  className="cm-btn-clear-icon"
                  onClick={() => setForm((f) => ({ ...f, icono: "" }))}
                  title="Quitar ícono"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Grilla de íconos (se abre/cierra) */}
            {selectorAbierto && (
              <div className="cm-icon-selector">
                <input
                  className="cm-icon-search"
                  type="text"
                  placeholder="Buscar ícono…"
                  value={filtroIcono}
                  onChange={(e) => setFiltroIcono(e.target.value)}
                  autoFocus
                />
                <div className="cm-icon-grid">
                  {iconosFiltrados.map((ic) => (
                    <button
                      key={ic.nombre}
                      type="button"
                      className={`cm-icon-btn ${form.icono === ic.nombre ? "cm-icon-btn--active" : ""}`}
                      onClick={() => seleccionarIcono(ic.nombre)}
                      title={ic.etiqueta}
                    >
                      <span className="material-icons">{ic.nombre}</span>
                      <span className="cm-icon-label">{ic.etiqueta}</span>
                    </button>
                  ))}
                  {iconosFiltrados.length === 0 && (
                    <p className="cm-icon-empty">Sin resultados</p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Nombre */}
          <div className="cm-field">
            <label className="cm-label">Nombre *</label>
            <input
              className="cm-input"
              type="text"
              placeholder="Ej: Subtítulos disponibles"
              value={form.nombre}
              onChange={(e) => setForm((f) => ({ ...f, nombre: e.target.value }))}
            />
          </div>

          <div className="cm-form-actions">
            {editando && (
              <button className="cm-btn cm-btn--cancel" onClick={cancelarEdicion}>
                Cancelar
              </button>
            )}
            <button
              className="cm-btn cm-btn--save"
              onClick={handleSubmit}
              disabled={saving}
            >
              {saving ? "Guardando…" : editando ? "Actualizar" : "Crear"}
            </button>
          </div>
        </div>

        {/* List */}
        <div className="cm-list-area">
          <div className="cm-list-header">
            <h2 className="cm-list-title">Características</h2>
            <span className="cm-count">{caracteristicas.length} total</span>
          </div>

          {loading ? (
            <div className="cm-loading">Cargando…</div>
          ) : caracteristicas.length === 0 ? (
            <div className="cm-empty">
              <span>🏷️</span>
              <p>No hay características creadas aún.</p>
            </div>
          ) : (
            <div className="cm-grid">
              {caracteristicas.map((c) => (
                <div key={c.id} className={`cm-card ${editando === c.id ? "cm-card--editing" : ""}`}>
                  <div className="cm-card-icon">
                    {c.icono ? (
                      <span className="material-icons" style={{ fontSize: "24px", color: "#a5b4fc" }}>
                        {c.icono}
                      </span>
                    ) : (
                      "🏷️"
                    )}
                  </div>
                  <div className="cm-card-body">
                    <div className="cm-card-name">{c.nombre}</div>
                    <div className="cm-card-id">ID: {c.id}</div>
                  </div>
                  <div className="cm-card-actions">
                    <button
                      className="cm-action cm-action--edit"
                      onClick={() => handleEditar(c)}
                      title="Editar"
                    >
                      ✏️
                    </button>
                    <button
                      className="cm-action cm-action--delete"
                      onClick={() => handleEliminar(c.id)}
                      disabled={deleting === c.id}
                      title="Eliminar"
                    >
                      {deleting === c.id ? "…" : "🗑️"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}