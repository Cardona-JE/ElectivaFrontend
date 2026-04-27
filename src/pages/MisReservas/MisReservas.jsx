import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { obtenerReservas } from "../../services/api";
import Navbar from "../../components/layout/Navbar/Navbar";
import Footer from "../../components/layout/Footer/Footer";
import "./MisReservas.css";

export default function MisReservas() {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [cargando, setCargando] = useState(true);
  const [reservas, setReservas] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    async function cargarReservas() {
      setCargando(true);
      setError(null);
      try {
        const data = await obtenerReservas(token);
        setReservas(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setCargando(false);
      }
    }

    cargarReservas();
  }, [token, navigate]);

  return (
    <div className="mis-reservas-page">
      <Navbar />

      <section className="mis-reservas-content">
        <div className="mis-reservas-header">
          <div>
            <h1>Mis reservas</h1>
            <p>Administrá tus próximas visitas y consultá tus reservas activas.</p>
          </div>
          <button className="volver-button" onClick={() => navigate("/")}>
            ← Volver al inicio
          </button>
        </div>

        {cargando && <p className="estado-texto">Cargando reservas...</p>}
        {error && <p className="estado-texto error">Error: {error}</p>}

        {!cargando && !error && reservas.length === 0 && (
          <p className="estado-texto">No tenés reservas registradas todavía.</p>
        )}

        {!cargando && !error && reservas.length > 0 && (
          <div className="reservas-grid">
            {reservas.map((reserva) => (
              <article key={reserva.id} className="reserva-card">
                <h2>{reserva.tituloPelicula}</h2>
                <p>
                  <strong>Fecha:</strong> {reserva.fechaDesde}
                </p>
                <p>
                  <strong>Hora:</strong> {reserva.hora || "20:00"}
                </p>
                <p>
                  <strong>Estado:</strong> {reserva.estado || "Confirmada"}
                </p>
                <p className="reserva-detalle">{reserva.descripcion || ""}</p>
              </article>
            ))}
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
}
