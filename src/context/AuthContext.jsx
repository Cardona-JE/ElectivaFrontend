import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(
    () => localStorage.getItem("token") || null
  );
  const [usuario, setUsuario] = useState(
    () => {
      const saved = localStorage.getItem("usuario");
      return saved ? JSON.parse(saved) : null;
    }
  );

  function guardarSesion(tokenRecibido, datosUsuario) {
    setToken(tokenRecibido);
    setUsuario(datosUsuario);
    localStorage.setItem("token", tokenRecibido);
    localStorage.setItem("usuario", JSON.stringify(datosUsuario));
  }

  function cerrarSesion() {
    setToken(null);
    setUsuario(null);
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
  }

  return (
    <AuthContext.Provider value={{ token, usuario, guardarSesion, cerrarSesion }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
