import { createContext, useContext, useState } from 'react';

export const LoadingContext = createContext();

export const useLoading = () => useContext(LoadingContext);

export const LoadingProvider = ({ children }) => {
  const [cargando, setCargando] = useState(false);
  return (
    <LoadingContext.Provider value={{ cargando, setCargando }}>
      {children}
    </LoadingContext.Provider>
  );
};
