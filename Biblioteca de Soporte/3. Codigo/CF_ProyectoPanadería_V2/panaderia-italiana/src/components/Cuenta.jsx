import { useState } from 'react';
import Register from '../pages/Register';
import Login from '../pages/Login';
import { FaCheckCircle } from 'react-icons/fa'; // ✅ Icono animado

const styles = {
  container: {
    maxWidth: 420,
    margin: '3rem auto',
    padding: '2rem',
    borderRadius: '0.75rem',
    boxShadow: '0 4px 20px rgba(43, 18, 152, 0.2)',
    backgroundColor: '#ffffff',
    fontFamily: 'Segoe UI, sans-serif',
    textAlign: 'center',
  },
  heading: {
    fontSize: '1.5rem',
    marginBottom: '0.5rem',
    color: '#1f2937',
  },
  message: {
    fontSize: '1rem',
    color: '#1f2937',
  },
  icon: {
    fontSize: '3rem',
    color: '#10b981',
    marginBottom: '1rem',
    animation: 'pop 0.6s ease',
  },
  toggleButton: {
    marginTop: '1.5rem',
    width: '100%',
    padding: '0.75rem',
    borderRadius: '0.5rem',
    border: 'none',
    backgroundColor: '#000104ff',
    color: '#fff',
    fontWeight: '600',
    fontSize: '0.95rem',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
};

// Animación de rebote simple
const styleSheet = document.styleSheets[0];
styleSheet.insertRule(`
@keyframes pop {
  0% { transform: scale(0); opacity: 0; }
  60% { transform: scale(1.2); opacity: 1; }
  100% { transform: scale(1); }
}
`, styleSheet.cssRules.length);

export default function Cuenta({ token, onLogin }) {
  const [mostrarLogin, setMostrarLogin] = useState(true);

  const toggleForm = () => setMostrarLogin(prev => !prev);

  if (token) {
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    const esAdmin = usuario?.rol === 'admin';

    return (
      <div style={styles.container}>
        <FaCheckCircle style={styles.icon} />
        <h2 style={styles.heading}>Estás autenticado</h2>
        <p style={styles.message}>
          {esAdmin ? 'Ya puedes administrar categorías y productos desde el panel correspondiente.' : 'Bienvenido a tu cuenta'}
        </p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {mostrarLogin ? (
        <Login onLogin={onLogin} />
      ) : (
        <Register onRegisterSuccess={() => setMostrarLogin(true)} />
      )}
      <button
        onClick={toggleForm}
        style={styles.toggleButton}
        onMouseOver={e => (e.currentTarget.style.backgroundColor = '#000615ff')}
        onMouseOut={e => (e.currentTarget.style.backgroundColor = '#01040cff')}
      >
        {mostrarLogin ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión'}
      </button>
    </div>
  );
}
