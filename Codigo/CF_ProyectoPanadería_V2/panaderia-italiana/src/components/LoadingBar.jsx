import { useLoading } from './LoadingContext';
import './LoadingBar.css';

export default function LoadingBar() {
  const { cargando } = useLoading();

  return (
    <div className={`barra-carga ${cargando ? 'activa' : ''}`} />
  );
}
