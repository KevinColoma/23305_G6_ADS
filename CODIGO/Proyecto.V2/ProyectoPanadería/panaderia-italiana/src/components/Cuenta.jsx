import React, { useState } from 'react';
import Register from '../pages/Register';
import Login from '../pages/Login';

const styles = {
  container: {
    maxWidth: 400,
    margin: '40px auto',
    padding: 20,
    borderRadius: 8,
    boxShadow: '0 0 10px rgba(43, 18, 152, 0.74)',
    backgroundColor: '#fff',
    textAlign: 'center',
    fontFamily: 'Arial, sans-serif',
  },
  button: {
    marginTop: 15,
    padding: '10px 20px',
    borderRadius: 5,
    border: 'none',
    backgroundColor: '#007bff',
    color: 'black',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  buttonHover: {
    backgroundColor: '#0056b3',
  },
  message: {
    marginTop: 20,
    fontSize: 16,
    color: 'black',
  },
};

export default function Cuenta({ token, onLogin }) {
  const [mostrarLogin, setMostrarLogin] = useState(true);

  if (token) {
    return (
      <div style={styles.container}>
        <h2>Estás autenticado</h2>
        <p style={styles.message}>
          Ya puedes administrar categorías y productos desde el panel correspondiente.
        </p>
      </div>
    );
  }

  const toggleForm = () => {
    setMostrarLogin((prev) => !prev);
  };

  return (
    <div style={styles.container}>
      {mostrarLogin ? <Login onLogin={onLogin} /> : <Register onRegisterSuccess={() => setMostrarLogin(true)} />}
      <button
        onClick={toggleForm}
        style={styles.button}
        onMouseOver={e => (e.currentTarget.style.backgroundColor = '#0056b3')}
        onMouseOut={e => (e.currentTarget.style.backgroundColor = '#007bff')}
      >
        {mostrarLogin ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión'}
      </button>
    </div>
  );
}
