import React, { useEffect, useState } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import './AdminOrdenes.css';

export default function AdminOrdenes() {
  const [ordenes, setOrdenes] = useState([]);
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

  useEffect(() => {
    fetch(`${API_URL}/ordenes`)
      .then(res => res.json())
      .then(data => setOrdenes(data))
      .catch(err => console.error('Error cargando órdenes:', err));
  }, []);

  const filtrarOrdenes = () => {
    if (!fechaInicio && !fechaFin) return ordenes;

    const inicio = fechaInicio ? new Date(`${fechaInicio}T00:00:00`) : new Date('2000-01-01T00:00:00');
    const fin = fechaFin ? new Date(`${fechaFin}T23:59:59`) : new Date('2100-12-31T23:59:59');

    return ordenes.filter(o => {
      const fechaOrden = new Date(o.fecha);
      return fechaOrden >= inicio && fechaOrden <= fin;
    });
  };

  const descargarCSV = () => {
    const encabezado = 'ID,Fecha,Total,Producto,Cantidad,Subtotal\n';
    const filas = filtrarOrdenes().flatMap(o =>
      o.productos.map(p =>
        `${o.id},"${new Date(o.fecha).toLocaleString('es-EC')}","${o.total}","${p.producto_nombre}",${p.cantidad},${p.subtotal}`
      )
    ).join('\n');

    const blob = new Blob([encabezado + filas], { type: 'text/csv' });
    const enlace = document.createElement('a');
    enlace.href = URL.createObjectURL(blob);
    enlace.download = 'ordenes.csv';
    enlace.click();
  };

const descargarPDF = () => {
  const doc = new jsPDF();
  let y = 15;

  doc.setFontSize(16);
  doc.text('Órdenes Registradas', 14, y);
  y += 10;

  const ordenesFiltradas = filtrarOrdenes();

  ordenesFiltradas.forEach((orden, index) => {
    doc.setFontSize(12);
    doc.text(`Orden #${orden.id} - ${new Date(orden.fecha).toLocaleString('es-EC')}`, 14, y);
    y += 6;
    doc.text(`Total: $${parseFloat(orden.total).toFixed(2)}`, 14, y);
    y += 4;

    autoTable(doc, {
      head: [['Producto', 'Cantidad', 'Subtotal']],
      body: orden.productos.map(p => [
        p.producto_nombre,
        p.cantidad,
        `$${parseFloat(p.subtotal).toFixed(2)}`
      ]),
      startY: y,
      styles: { fontSize: 10 },
      margin: { left: 14, right: 14 }
    });

    y = doc.lastAutoTable.finalY + 10;

    if (y > 270 && index !== ordenesFiltradas.length - 1) {
      doc.addPage();
      y = 15;
    }
  });

  doc.save('ordenes.pdf');
};



  return (
    <div className="admin-ordenes">
      <h2>📋 Órdenes registradas</h2>

      <div className="filtros">
        <div>
          <label>Desde:</label>
          <input
            type="date"
            value={fechaInicio}
            onChange={e => setFechaInicio(e.target.value)}
          />
        </div>
        <div>
          <label>Hasta:</label>
          <input
            type="date"
            value={fechaFin}
            onChange={e => setFechaFin(e.target.value)}
          />
        </div>
        <button onClick={descargarCSV} className="btn-csv">Descargar CSV</button>
        <button onClick={descargarPDF} className="btn-pdf">Descargar PDF</button>
      </div>

      {filtrarOrdenes().length === 0 ? (
        <p className="sin-ordenes">No hay órdenes registradas para este rango.</p>
      ) : (
        filtrarOrdenes().map(orden => (
          <div key={orden.id} className="orden">
            <h3>
              Orden #{orden.id} - {new Date(orden.fecha).toLocaleString('es-EC')}
            </h3>
            <p><strong>Total:</strong> ${parseFloat(orden.total).toFixed(2)}</p>
            <div>
              <p><strong>Productos:</strong></p>
              <ul>
                {orden.productos.map(p => (
                  <li key={`${orden.id}-${p.producto_nombre}`}>
                    {p.producto_nombre} — {p.cantidad} und — ${parseFloat(p.subtotal).toFixed(2)}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
