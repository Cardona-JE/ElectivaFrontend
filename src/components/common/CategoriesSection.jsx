import { useState } from "react";

export default function CategoriesSection({ onCategorySelect, selectedCategory }) {
  // Categorías hardcodeadas de géneros principales
  const categorias = [
    { id: 1, nombre: "Acción", icono: "sports_martial_arts" },
    { id: 2, nombre: "Aventura", icono: "explore" },
    { id: 3, nombre: "Animación", icono: "animation" },
    { id: 4, nombre: "Comedia", icono: "sentiment_very_satisfied" },
    { id: 5, nombre: "Drama", icono: "theater_comedy" }
  ];

  const handleCategoryClick = (categoria) => {
    // Si la categoría ya está seleccionada, deseleccionarla
    if (selectedCategory && selectedCategory.id === categoria.id) {
      onCategorySelect(null);
    } else {
      onCategorySelect(categoria);
    }
  };

  return (
    <section style={{ marginTop: "30px", marginBottom: "10px" }}>
      <h2>Categorías</h2>
      <div style={{
        display: "flex",
        gap: "10px",
        marginTop: "10px",
        marginBottom: "20px",
        flexWrap: "wrap"
      }}>
        {categorias.map((cat) => (
          <div
            key={cat.id}
            onClick={() => handleCategoryClick(cat)}
            style={{
              background: selectedCategory && selectedCategory.id === cat.id ? "#4f46e5" : "#fff",
              color: selectedCategory && selectedCategory.id === cat.id ? "#fff" : "#000",
              padding: "10px 20px",
              borderRadius: "6px",
              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              cursor: "pointer",
              transition: "all 0.2s ease"
            }}
          >
            <span className="material-icons" style={{
              fontSize: "18px",
              color: selectedCategory && selectedCategory.id === cat.id ? "#fff" : "#4f46e5"
            }}>
              {cat.icono}
            </span>
            {cat.nombre}
          </div>
        ))}
      </div>
    </section>
  );
}