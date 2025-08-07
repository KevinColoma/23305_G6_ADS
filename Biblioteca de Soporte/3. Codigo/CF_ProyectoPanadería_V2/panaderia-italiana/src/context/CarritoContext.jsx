import { createContext, useEffect, useState } from "react";

export const CarritoContext = createContext();

export default function CarritoProvider({ children }) {
  const [carrito, setCarrito] = useState([]);

  useEffect(() => {
    const carritoInicial = JSON.parse(localStorage.getItem("carrito")) || [];
    setCarrito(carritoInicial);
  }, []);

  const actualizarCarrito = (nuevoCarrito) => {
    localStorage.setItem("carrito", JSON.stringify(nuevoCarrito));
    setCarrito(nuevoCarrito);
  };

  return (
    <CarritoContext.Provider value={{ carrito, actualizarCarrito }}>
      {children}
    </CarritoContext.Provider>
  );
}
