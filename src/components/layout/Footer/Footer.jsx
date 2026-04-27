import "./Footer.css";

import {
  FaFacebook,
  FaInstagram,
  FaTwitter,
  FaWhatsapp
} from "react-icons/fa";

export default function Footer() {


  return (

    <footer className="footer">

      <div className="footer-container">

        <div className="footer-section">
          <h3>Mi Tienda</h3>
          <p>© 2026 Todos los derechos reservados</p>
        </div>

        <div className="footer-section">

          <h4>Redes sociales</h4>

          <div className="social-links">

            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
            >
              <FaFacebook size={22} />
            </a>

            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
            >
              <FaInstagram size={22} />
            </a>

            <a
              href="https://twitter.com"
              target="_blank"
              rel="noreferrer"
            >
              <FaTwitter size={22} />
            </a>

          </div>

        </div>

        <div className="footer-section">

          <h4>Contacto</h4>

          <a
            
            target="_blank"
            rel="noreferrer"
            className="whatsapp-button"
          >
            <FaWhatsapp size={20} />
            WhatsApp
          </a>

        </div>

      </div>

    </footer>

  );

}