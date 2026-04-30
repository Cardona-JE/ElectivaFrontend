import { useState, useEffect } from "react";
import { useProducts } from "../../../hooks/useProducts";
import { searchMovies } from "../../../services/api";
import { useNavigate } from "react-router-dom";
import "./Recommendations.css";

export default function RecommendationsSection({ search, selectedCategory }) {
  const { products: initialMovies, loading: initialLoading, error } = useProducts();
  const [movies, setMovies] = useState([]);
  const [searching, setSearching] = useState(false);
  const navigate = useNavigate();

  const PRODUCTS_PER_PAGE = 10;
  const [currentPage, setCurrentPage] = useState(1);

  // Cuando llegan las películas iniciales (aleatorias), cargarlas
  useEffect(() => {
    if (!search) {
      setMovies(initialMovies);
      setCurrentPage(1);
    }
  }, [initialMovies, search]);

  // Cuando cambia la búsqueda, llamar al backend
  useEffect(() => {
    if (!search) return;

    setSearching(true);
    setCurrentPage(1);

    searchMovies(search)
      .then(setMovies)
      .catch(() => setMovies([]))
      .finally(() => setSearching(false));
  }, [search]);

  // Filtrar películas por categoría seleccionada
  const filteredMovies = selectedCategory
    ? movies.filter(movie =>
        movie.generos?.includes(selectedCategory.nombre)
      )
    : movies;

  const loading = initialLoading || searching;

  if (loading) return <p>Cargando películas...</p>;
  if (error) return <p>Error al cargar películas</p>;

  const totalPages = Math.ceil(filteredMovies.length / PRODUCTS_PER_PAGE);
  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const currentMovies = filteredMovies.slice(startIndex, startIndex + PRODUCTS_PER_PAGE);

  return (
    <section style={{ marginTop: "30px" }}>
      <h2>Recomendaciones</h2>
      {selectedCategory && (
        <p style={{ color: "#4f46e5", marginBottom: "10px" }}>
          Mostrando películas de la categoría: <strong>{selectedCategory.nombre}</strong>
        </p>
      )}

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(5, 1fr)",
        gap: "15px",
        marginTop: "20px"
      }}>
        {currentMovies.map(movie => (
          <div
            key={movie.id}
            onClick={() => navigate(`/pelicula/${movie.id}`)}
            style={{
              border: "1px solid #ccc",
              padding: "8px",
              cursor: "pointer",
              borderRadius: "6px",
              backgroundColor: "#fff",
              transition: "transform 0.2s"
            }}
            onMouseEnter={e => e.currentTarget.style.transform = "scale(1.03)"}
            onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
          >
            <img
              src={movie.posterUrl || "https://via.placeholder.com/200x300?text=Sin+imagen"}
              alt={movie.titulo}
              style={{
                width: "100%",
                height: "200px",
                objectFit: "cover",
                borderRadius: "4px",
                marginBottom: "8px"
              }}
            />
            <h4 style={{ fontSize: "13px", margin: "5px 0", lineHeight: "1.3" }}>
              {movie.titulo}
            </h4>
            <p style={{ margin: "4px 0", color: "#f59e0b", fontSize: "13px" }}>
              ⭐ {movie.puntuacion?.toFixed(1) || "N/A"}
            </p>
            <p style={{ margin: "0", color: "#888", fontSize: "12px" }}>
              {movie.fechaLanzamiento?.slice(0, 4) || ""}
            </p>
          </div>
        ))}
      </div>

      {filteredMovies.length === 0 && selectedCategory && (
        <p style={{ marginTop: "20px", color: "#666" }}>
          No se encontraron películas para la categoría "{selectedCategory.nombre}"
        </p>
      )}

      {filteredMovies.length === 0 && !selectedCategory && (
        <p style={{ marginTop: "20px", color: "#666" }}>
          No se encontraron resultados para "{search}"
        </p>
      )}

      <div style={{
        marginTop: "25px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: "14px"
      }}>
        <button
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          style={{ padding: "6px 12px", cursor: "pointer" }}
        >
          Anterior
        </button>
        <span>Página {currentPage} de {totalPages || 1}</span>
        <button
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages || totalPages === 0}
          style={{ padding: "6px 12px", cursor: "pointer" }}
        >
          Siguiente
        </button>
      </div>
    </section>
  );
}