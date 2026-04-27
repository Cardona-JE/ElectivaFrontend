import { useState, useEffect } from "react";
import "./PeliculasCaracteristicas.css";

export default function PeliculasCaracteristicas({ token, apiBase }) {
  const [peliculas, setPeliculas] = useState([]);
  const [caracteristicas, setCaracteristicas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const [expanded, setExpanded] = useState(null);
  const [asignaciones, setAsignaciones] = useState({});
  const [saving, setSaving] = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    Promise.all([
      fetch(`${apiBase}/peliculas`, { headers: { Authorization: `Bearer ${token}` } })
        .then((r) => r.json()).catch(() => []),
      fetch(`${apiBase}/caracteristicas`, { headers: { Authorization: `Bearer ${token}` } })
        .then((r) => r.json()).catch(() => []),
    ]).then(([pelis, cars]) => {
      setPeliculas(Array.isArray(pelis) ? pelis : []);
      setCaracteristicas(Array.isArray(cars) ? cars : []);
      setLoading(false);
    });
  }, []);

  const cargarCaracteristicasDePelicula = async (peliculaId) => {
    if (asignaciones[peliculaId] !== undefined) return;
    try {
      const res = await fetch(`${apiBase}/caracteristicas/pelicula/${peliculaId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      const ids = Array.isArray(data) ? data.map((c) => c.id) : [];
      setAsignaciones((prev) => ({ ...prev, [peliculaId]: new Set(ids) }));
    } catch {
      setAsignaciones((prev) => ({ ...prev, [peliculaId]: new Set() }));
    }
  };

  const toggleExpand = async (peliculaId) => {
    if (expanded === peliculaId) { setExpanded(null); return; }
    setExpanded(peliculaId);
    await cargarCaracteristicasDePelicula(peliculaId);
  };

  const toggleCaracteristica = (peliculaId, carId) => {
    setAsignaciones((prev) => {
      const current = new Set(prev[peliculaId] || []);
      if (current.has(carId)) current.delete(carId); else current.add(carId);
      return { ...prev, [peliculaId]: current };
    });
  };

  const guardarAsignacion = async (peliculaId) => {
    setSaving(peliculaId);
    const ids = [...(asignaciones[peliculaId] || new Set())];
    try {
      const res = await fetch(`${apiBase}/caracteristicas/pelicula/${peliculaId}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify(ids),
      });
      if (res.ok) showToast("Características asignadas correctamente");
      else        showToast("Error al guardar la asignación", "error");
    } catch {
      showToast("Error de conexión", "error");
    } finally {
      setSaving(null);
    }
  };

  const peliculasFiltradas = peliculas.filter((p) =>
    (p.titulo || p.title || p.nombre || "").toLowerCase().includes(busqueda.toLowerCase())
  );

  if (loading) return <div className="pc-loading">Cargando películas y características…</div>;

  return (
    <div className="pc-wrapper">
      {toast && <div className={`pc-toast pc-toast--${toast.type}`}>{toast.msg}</div>}

      <div className="pc-header">
        <div>
          <h2 className="pc-title">Películas y Características</h2>
          <p className="pc-desc">Selecciona una película para asignarle características</p>
        </div>
        <input
          className="pc-search" type="text" placeholder="🔍 Buscar película…"
          value={busqueda} onChange={(e) => setBusqueda(e.target.value)}
        />
      </div>

      {peliculasFiltradas.length === 0 ? (
        <div className="pc-empty"><span>🎬</span><p>No se encontraron películas.</p></div>
      ) : (
        <div className="pc-list">
          {peliculasFiltradas.map((p) => {
            const pelId   = p.id ?? p.tmdbId;
            const isOpen  = expanded === pelId;
            const seleccionadas = asignaciones[pelId] || new Set();
            const titulo  = p.titulo || p.title || p.nombre || `Película ${pelId}`;
            // posterUrl ya viene con la URL completa desde el backend (igual que en Recommendations)
            const poster = p.posterUrl || null;

            return (
              <div key={pelId} className={`pc-item ${isOpen ? "pc-item--open" : ""}`}>
                <div className="pc-item-header" onClick={() => toggleExpand(pelId)}>
                  <div className="pc-item-info">
                    {poster
                      ? <img className="pc-poster" src={poster} alt={titulo} />
                      : <div className="pc-poster-placeholder">🎬</div>
                    }
                    <div>
                      <div className="pc-movie-title">{titulo}</div>
                      <div className="pc-movie-id">ID: {pelId}</div>
                    </div>
                  </div>
                  <div className="pc-item-right">
                    {seleccionadas.size > 0 && (
                      <span className="pc-badge">{seleccionadas.size} asignadas</span>
                    )}
                    <span className="pc-chevron">{isOpen ? "▲" : "▼"}</span>
                  </div>
                </div>

                {isOpen && (
                  <div className="pc-item-body">
                    {caracteristicas.length === 0 ? (
                      <p className="pc-no-cars">No hay características. Créalas en el tab "Características".</p>
                    ) : (
                      <>
                        <p className="pc-select-hint">Selecciona las características para esta película:</p>
                        <div className="pc-cars-grid">
                          {caracteristicas.map((c) => {
                            const checked = seleccionadas.has(c.id);
                            return (
                              <label key={c.id} className={`pc-car-chip ${checked ? "pc-car-chip--checked" : ""}`}>
                                <input type="checkbox" checked={checked} onChange={() => toggleCaracteristica(pelId, c.id)} className="pc-checkbox" />
                                <span className="pc-car-icon">{c.icono || "🏷️"}</span>
                                <span className="pc-car-name">{c.nombre}</span>
                              </label>
                            );
                          })}
                        </div>
                        <div className="pc-save-row">
                          <button className="pc-save-btn" onClick={() => guardarAsignacion(pelId)} disabled={saving === pelId}>
                            {saving === pelId ? "Guardando…" : "💾 Guardar cambios"}
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}