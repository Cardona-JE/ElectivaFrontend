import { useParams, useNavigate } from "react-router-dom";
import { useProductDetail } from "../../hooks/useProductDetail";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { crearReserva } from "../../services/api";
import "./ProductDetail.css";
import Navbar from "../../components/layout/Navbar/Navbar";
import Footer from "../../components/layout/Footer/Footer";

function CalendarioMes({ año, mes, fechasOcupadas, fechaSeleccionada, onSeleccionar }) {
  const hoy = new Date();
  const primerDia = new Date(año, mes, 1).getDay();
  const diasEnMes = new Date(año, mes + 1, 0).getDate();
  const nombreMes = new Date(año, mes, 1).toLocaleString("es-AR", { month: "long", year: "numeric" });

  const celdas = [];
  for (let i = 0; i < primerDia; i++) {
    celdas.push(<div key={`v-${i}`} />);
  }
  for (let dia = 1; dia <= diasEnMes; dia++) {
    const fechaStr = `${año}-${String(mes + 1).padStart(2, "0")}-${String(dia).padStart(2, "0")}`;
    const esPasado = new Date(año, mes, dia) < new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
    const estaOcupado = fechasOcupadas.includes(fechaStr);
    const estaSeleccionado = fechaSeleccionada === fechaStr;

    let bg = "#f9f9f9";
    let color = "#333";
    let cursor = "pointer";
    if (esPasado) { bg = "#f0f0f0"; color = "#bbb"; cursor = "default"; }
    if (estaOcupado) { bg = "#fee2e2"; color = "#dc2626"; cursor = "not-allowed"; }
    if (estaSeleccionado) { bg = "#4f46e5"; color = "white"; }

    celdas.push(
      <div
        key={fechaStr}
        onClick={() => !esPasado && !estaOcupado && onSeleccionar(fechaStr)}
        style={{
          textAlign: "center",
          padding: "6px 2px",
          borderRadius: "4px",
          fontSize: "13px",
          background: bg,
          color,
          cursor,
          fontWeight: estaSeleccionado ? "bold" : "normal",
          border: estaSeleccionado ? "2px solid #4f46e5" : "1px solid #eee"
        }}
      >
        {dia}
      </div>
    );
  }

  return (
    <div style={{ marginBottom: "16px" }}>
      <p style={{ textAlign: "center", fontWeight: "bold", marginBottom: "8px", textTransform: "capitalize" }}>
        {nombreMes}
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "3px", marginBottom: "4px" }}>
        {['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá'].map(d => (
          <div key={d} style={{ textAlign: "center", fontSize: "11px", color: "#888", fontWeight: "bold" }}>{d}</div>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "3px" }}>
        {celdas}
      </div>
    </div>
  );
}

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const { product: movie, loading, error } = useProductDetail(id);
  const [selectedImage, setSelectedImage] = useState(0);
  const [fechaSeleccionada, setFechaSeleccionada] = useState("");
  const [reservando, setReservando] = useState(false);
  const [resultadoReserva, setResultadoReserva] = useState(null);
  const [mesOffset, setMesOffset] = useState(0);

  if (loading) return <p style={{ padding: "100px 20px" }}>Cargando película...</p>;
  if (error) return <p style={{ padding: "100px 20px" }}>Error cargando película</p>;
  if (!movie) return <p style={{ padding: "100px 20px" }}>Película no encontrada</p>;

  const imagenes = movie.imagenesExtra?.length > 0 ? movie.imagenesExtra : [movie.posterUrl].filter(Boolean);
  const fechasOcupadas = movie.fechasOcupadas || [];
  const mesActual = (new Date().getMonth() + mesOffset) % 12;
  const añoActual = new Date().getFullYear() + Math.floor((new Date().getMonth() + mesOffset) / 12);

  const handleReservar = async () => {
    if (!token) {
      setResultadoReserva({ ok: false, mensaje: "Debés iniciar sesión para reservar." });
      return;
    }
    if (!fechaSeleccionada) {
      setResultadoReserva({ ok: false, mensaje: "Seleccioná una fecha en el calendario." });
      return;
    }
    setReservando(true);
    setResultadoReserva(null);

    try {
      const resp = await crearReserva(token, Number(id), fechaSeleccionada);
      setResultadoReserva({ ok: true, mensaje: `✅ ${resp.mensajeConfirmacion} — ${resp.tituloPelicula} el ${fechaSeleccionada}` });
      setFechaSeleccionada("");
    } catch (err) {
      setResultadoReserva({ ok: false, mensaje: `❌ ${err.message}` });
    } finally {
      setReservando(false);
    }
  };

  return (
    <div className="product-detail-container">
      <Navbar />

      {movie.backdropUrl && (
        <div style={{
          width: "100%",
          height: "300px",
          backgroundImage: `url(${movie.backdropUrl})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          marginTop: "60px"
        }} />
      )}

      <div className="product-detail-grid" style={{ marginTop: movie.backdropUrl ? "20px" : "80px", padding: "0 20px 40px" }}>
        <div className="product-images">
          <div className="thumbnail-list">
            {imagenes.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`thumbnail ${index}`}
                className={`thumbnail ${selectedImage === index ? "active" : ""}`}
                onClick={() => setSelectedImage(index)}
              />
            ))}
          </div>
          <div className="main-image-container">
            <img src={imagenes[selectedImage]} alt={movie.titulo} className="main-image" />
            <button className="back-button" onClick={() => navigate("/")}>
              ← Volver al inicio
            </button>
          </div>
        </div>

        <div className="product-info">
          <h1 className="product-title">{movie.titulo}</h1>

          {movie.tituloOriginal && movie.tituloOriginal !== movie.titulo && (
            <p style={{ color: "#888", fontStyle: "italic" }}>{movie.tituloOriginal}</p>
          )}

          <p className="product-category">{movie.generos?.join(", ") || "Sin género"}</p>
          <p style={{ fontSize: "20px", color: "#f59e0b", margin: "0" }}>
            ⭐ {movie.puntuacion?.toFixed(1)} ({movie.votos?.toLocaleString()} votos)
          </p>
          <p style={{ color: "#555" }}>
            {movie.duracionMinutos ? `${movie.duracionMinutos} min` : ""}
            {movie.fechaLanzamiento ? ` · ${movie.fechaLanzamiento.slice(0, 4)}` : ""}
          </p>

          <hr />

          <h3>Descripción</h3>
          <p className="product-description">{movie.descripcion}</p>

          <hr />

          {/* Características de la plataforma (HU18) */}
          {movie.caracteristicasPlataforma?.length > 0 && (
            <>
              <h3>Características</h3>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginBottom: "10px" }}>
                {movie.caracteristicasPlataforma.map(car => (
                  <span
                    key={car.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      padding: "6px 12px",
                      background: "#f0f0ff",
                      borderRadius: "20px",
                      fontSize: "14px"
                    }}
                  >
                    {car.icono && (
                      <span
                        className="material-icons"
                        style={{ fontSize: "16px", color: "#4f46e5" }}
                      >
                        {car.icono}
                      </span>
                    )}
                    {car.nombre}
                  </span>
                ))}
              </div>
              <hr />
            </>
          )}

          <h3>Disponibilidad</h3>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
            <button
              onClick={() => setMesOffset(prev => Math.max(prev - 1, 0))}
              disabled={mesOffset === 0}
              style={{ padding: "4px 10px", cursor: mesOffset === 0 ? "default" : "pointer", opacity: mesOffset === 0 ? 0.4 : 1 }}
            >
              ‹
            </button>
            <span style={{ fontSize: "13px", color: "#666" }}>Navegá los meses</span>
            <button
              onClick={() => setMesOffset(prev => Math.min(prev + 1, 5))}
              disabled={mesOffset === 5}
              style={{ padding: "4px 10px", cursor: mesOffset === 5 ? "default" : "pointer", opacity: mesOffset === 5 ? 0.4 : 1 }}
            >
              ›
            </button>
          </div>

          <div style={{ border: "1px solid #eee", borderRadius: "8px", padding: "12px", background: "#fafafa" }}>
            <CalendarioMes
              año={añoActual}
              mes={mesActual}
              fechasOcupadas={fechasOcupadas}
              fechaSeleccionada={fechaSeleccionada}
              onSeleccionar={setFechaSeleccionada}
            />
          </div>

          <div style={{ marginTop: "14px" }}>
            {fechaSeleccionada && (
              <p style={{ color: "#4f46e5", fontSize: "14px", marginBottom: "8px" }}>
                📅 Fecha seleccionada: <strong>{fechaSeleccionada}</strong>
              </p>
            )}
            <button
              onClick={handleReservar}
              disabled={reservando || !fechaSeleccionada}
              style={{
                padding: "12px 24px",
                background: fechaSeleccionada ? "#4f46e5" : "#aaa",
                color: "white",
                border: "none",
                borderRadius: "6px",
                fontSize: "16px",
                cursor: fechaSeleccionada ? "pointer" : "default"
              }}
            >
              {reservando ? "Reservando..." : "Confirmar reserva"}
            </button>
          </div>

          {resultadoReserva && (
            <div style={{
              marginTop: "12px",
              padding: "12px 16px",
              borderRadius: "6px",
              background: resultadoReserva.ok ? "#dcfce7" : "#fee2e2",
              color: resultadoReserva.ok ? "#16a34a" : "#dc2626",
              fontSize: "14px"
            }}>
              {resultadoReserva.mensaje}
              {resultadoReserva.ok && (
                <button
                  onClick={() => navigate("/mis-reservas")}
                  style={{
                    marginLeft: "12px",
                    padding: "4px 10px",
                    background: "#16a34a",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontSize: "13px"
                  }}
                >
                  Ver mis reservas
                </button>
              )}
            </div>
          )}

          <hr />

          <h3 style={{ textDecoration: "underline" }}>Políticas</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
            {[
              { titulo: "Cancelación", descripcion: "Podés cancelar tu reserva hasta 24hs antes sin costo." },
              { titulo: "Devoluciones", descripcion: "En caso de error en la reserva, se reintegra el crédito automáticamente." },
              { titulo: "Uso de la cuenta", descripcion: "La cuenta es personal e intransferible." },
              { titulo: "Contenido", descripcion: "El acceso al contenido está sujeto a disponibilidad en tu región." }
            ].map((p, i) => (
              <div key={i}>
                <strong>{p.titulo}</strong>
                <p style={{ fontSize: "13px", color: "#555", marginTop: "4px" }}>{p.descripcion}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
