import { Routes, Route } from "react-router-dom"
import Home from "./pages/Home.jsx"
import ProductDetail from "./pages/ProductDetail/ProductDetail.jsx"
import MisReservas from "./pages/MisReservas/MisReservas.jsx"
import AdminPanel from "./pages/AdminPanel/AdminPanel.jsx"

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/product/:id" element={<ProductDetail />} />
      <Route path="/pelicula/:id" element={<ProductDetail />} />
      <Route path="/mis-reservas" element={<MisReservas />} />
      <Route path="/administracion" element={<AdminPanel />} />
    </Routes>
  )
}
