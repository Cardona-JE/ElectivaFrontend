const BASE_URL = "/api";

// --- PEL�CULAS -----------------------------------------------

// Trae hasta 20 pel�culas aleatorias para el home (HU4)
export const getMovies = async () => {
  const response = await fetch(`${BASE_URL}/peliculas/aleatorias?cantidad=20`);
  if (!response.ok) throw new Error("Error al obtener pel�culas");
  return response.json();
};

// Busca pel�culas por texto (HU22)
export const searchMovies = async (query) => {
  const response = await fetch(
    `${BASE_URL}/peliculas/buscar?query=${encodeURIComponent(query)}`
  );
  if (!response.ok) throw new Error("Error en la b�squeda");
  return response.json();
};

// Trae el detalle completo de una pel�cula (HU5, HU6, HU18, HU23)
export const getMovieById = async (id) => {
  const response = await fetch(`${BASE_URL}/peliculas/${id}`);
  if (!response.ok) throw new Error("Pel�cula no encontrada");
  return response.json();
};

// --- DISPONIBILIDAD ------------------------------------------

// Trae las fechas ocupadas de una pel�cula (HU23)
export const getDisponibilidad = async (peliculaId) => {
  const response = await fetch(`${BASE_URL}/disponibilidad/${peliculaId}`);
  if (!response.ok) throw new Error("Error al obtener disponibilidad");
  return response.json();
};

// --- AUTH -----------------------------------------------------

// Registro de usuario (HU13)
export const registerUser = async (datos) => {
  const response = await fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(datos)
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "Error al registrar");
  return data;
};

// Login (HU14)
export const loginUser = async (datos) => {
  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(datos)
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "Error al iniciar sesi�n");
  return data;
};

// Logout (HU15)
export const logoutUser = async (token) => {
  await fetch(`${BASE_URL}/auth/logout`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` }
  });
};

// --- RESERVAS ------------------------------------------------

export const crearReserva = async (token, tmdbPeliculaId, fecha) => {
  const response = await fetch(`${BASE_URL}/reservas`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      tmdbPeliculaId,
      fechaDesde: fecha,
      fechaHasta: fecha
    })
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "Error al crear la reserva");
  return data;
};

export const getHistorial = async (token) => {
  const response = await fetch(`${BASE_URL}/reservas/historial`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || "Error al obtener el historial");
  }
  return response.json();
};

export const obtenerReservas = getHistorial;
