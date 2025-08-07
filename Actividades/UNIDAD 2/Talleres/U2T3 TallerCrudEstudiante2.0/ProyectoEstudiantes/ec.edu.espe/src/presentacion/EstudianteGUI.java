package presentacion;

import modelo.Estudiante;
import logica_negocio.EstudianteService;

import javax.swing.*;
import javax.swing.table.DefaultTableModel;
import java.awt.*;
import java.awt.event.ActionEvent;

public class EstudianteGUI extends JFrame {
    private final EstudianteService servicio = new EstudianteService();
    private final DefaultTableModel modeloTabla = new DefaultTableModel(new String[]{"ID", "Nombre", "Edad"}, 0);
    private final JTable tablaEstudiantes = new JTable(modeloTabla);

    public EstudianteGUI() {
        setTitle("Estudiantes");
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setLayout(new FlowLayout());

        JTextField campoId = new JTextField(5);
        JTextField campoNombre = new JTextField(10);
        JTextField campoEdad = new JTextField(5);

        JButton btnAgregar = new JButton("Agregar");
        JButton btnBuscar = new JButton("Buscar");
        JButton btnActualizar = new JButton("Actualizar");
        JButton btnEliminar = new JButton("Eliminar");


        add(new JLabel("ID:")); add(campoId);
        add(new JLabel("Nombre:")); add(campoNombre);
        add(new JLabel("Edad:")); add(campoEdad);
        add(btnAgregar); add(btnBuscar); add(btnActualizar); add(btnEliminar);
        JButton btnDeshacer = new JButton("Deshacer");
        btnDeshacer.addActionListener(e -> {
            servicio.deshacer();
            actualizarTabla();
        });
        add(btnDeshacer);

        add(new JScrollPane(tablaEstudiantes));

        btnAgregar.addActionListener(e -> {
            int id = Integer.parseInt(campoId.getText());
            String nombre = campoNombre.getText();
            int edad = Integer.parseInt(campoEdad.getText());
            servicio.agregarEstudiante(new Estudiante(id, nombre, edad));
            actualizarTabla();
        });

        btnBuscar.addActionListener(e -> {
            int id = Integer.parseInt(campoId.getText());
            Estudiante est = servicio.buscarEstudiante(id);
            if (est != null) {
                campoNombre.setText(est.getNombre());
                campoEdad.setText(String.valueOf(est.getEdad()));
            } else {
                JOptionPane.showMessageDialog(this, "Estudiante no encontrado.");
            }
        });

        btnActualizar.addActionListener(e -> {
            int id = Integer.parseInt(campoId.getText());
            String nombre = campoNombre.getText();
            int edad = Integer.parseInt(campoEdad.getText());
            if (servicio.actualizarEstudiante(new Estudiante(id, nombre, edad))) {
                actualizarTabla();
            } else {
                JOptionPane.showMessageDialog(this, "Estudiante no encontrado.");
            }
        });

        btnEliminar.addActionListener(e -> {
            int id = Integer.parseInt(campoId.getText());
            if (servicio.eliminarEstudiante(id)) {
                actualizarTabla();
            } else {
                JOptionPane.showMessageDialog(this, "Estudiante no encontrado.");
            }
        });


        pack();
        setLocationRelativeTo(null);
        setVisible(true);
    }

    private void actualizarTabla() {
        modeloTabla.setRowCount(0);
        for (Estudiante est : servicio.obtenerEstudiantes()) {
            modeloTabla.addRow(new Object[]{est.getId(), est.getNombre(), est.getEdad()});
        }
    }
}

