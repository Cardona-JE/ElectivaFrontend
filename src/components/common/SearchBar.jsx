import { useState } from "react";

export default function SearchBar({ onSearch }) {
  const [text, setText] = useState("");

  const handleChange = (e) => {
    const value = e.target.value;
    setText(value);
    // Filtrado local en tiempo real (comportamiento existente)
    onSearch(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Dispara búsqueda en backend a través del mismo canal
    onSearch(text);
  };

  return (
    <section>
      <h2 style={{ marginTop: "5%" }}>Buscar películas</h2>
      <p style={{ color: "#666", marginBottom: "10px" }}>
        Encontrá la película que estás buscando
      </p>
      <form onSubmit={handleSubmit} style={{ display: "flex", gap: "10px" }}>
        <input
          type="text"
          value={text}
          onChange={handleChange}
          placeholder="Buscar por nombre..."
          style={{
            flex: 1,
            padding: "10px",
            fontSize: "16px",
            borderRadius: "6px",
            border: "1px solid #ddd"
          }}
        />
        <button
          type="submit"
          style={{
            padding: "10px 20px",
            background: "#4f46e5",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "16px"
          }}
        >
          Buscar
        </button>
      </form>
    </section>
  );
}