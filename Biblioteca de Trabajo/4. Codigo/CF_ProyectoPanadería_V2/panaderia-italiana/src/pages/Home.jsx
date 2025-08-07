import { useEffect, useState } from 'react';
import './Home.css'; // Asegúrate de tener este CSS
import donas from '../uploads/donas.jpg';
import galleta from '../uploads/galleta.jpg';
import logo from '../uploads/logo.jpg';

export default function Home() {
  const images = [
    donas,
    galleta,
    logo
  ];

  const [current, setCurrent] = useState(0);

  const nextSlide = () => setCurrent((current + 1) % images.length);
  const prevSlide = () => setCurrent((current - 1 + images.length) % images.length);

  useEffect(() => {
    const interval = setInterval(() => nextSlide(), 3000);
    return () => clearInterval(interval);
  }, [current]);

  return (
    <div className="home">
      <div className="home-text">
        <h1>Bienvenido a la Panadería Italiana</h1>
        <p><strong>Visión:</strong> Ser la panadería líder en productos italianos.</p>
        <p><strong>Misión:</strong> Ofrecer panadería artesanal con ingredientes auténticos.</p>
      </div>

      <div className="carousel">
        <button className="nav left" onClick={prevSlide}>‹</button>
        <img src={images[current]} alt={`slide-${current}`} />
        <button className="nav right" onClick={nextSlide}>›</button>
      </div>
    </div>
  );
}
