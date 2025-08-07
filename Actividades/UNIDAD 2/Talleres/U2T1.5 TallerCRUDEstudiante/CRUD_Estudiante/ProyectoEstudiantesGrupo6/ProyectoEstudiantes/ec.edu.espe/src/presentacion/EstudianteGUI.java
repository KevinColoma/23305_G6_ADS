package presentacion;

import modelo.Estudiante;
import logica_negocio.EstudianteService;

import javax.swing.*;
import java.awt.*;
import java.awt.event.ActionEvent;

public class EstudianteGUI extends JFrame {
    private final EstudianteService servicio = new EstudianteService();
    private final JTextArea areaSalida = new JTextArea(10, 30);

    public EstudianteGUI() {
        setTitle("Estudiantes");
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setLayout(new FlowLayout());

        //Los inputs
        JTextField campoId = new JTextField(5);
        JTextField campoNombre = new JTextField(10);
        JTextField campoEdad = new JTextField(5);

        //Botones
        JButton btnAgregar = new JButton("Agregar");
        JButton btnBuscar = new JButton("Buscar");
        JButton btnActualizar = new JButton("Actualizar");
        JButton btnEliminar = new JButton("Eliminar");
        JButton btnListar = new JButton("Listar Todos");

        //Label para los datos a ingresar
        add(new JLabel("ID:")); add(campoId);
        add(new JLabel("Nombre:")); add(campoNombre);
        add(new JLabel("Edad:")); add(campoEdad);
        add(btnAgregar); add(btnBuscar); add(btnActualizar); add(btnEliminar); add(btnListar);
        add(new JScrollPane(areaSalida));

        // Eventos
        btnAgregar.addActionListener((ActionEvent e) -> {
            int id = Integer.parseInt(campoId.getText());
            String nombre = campoNombre.getText();
            int edad = Integer.parseInt(campoEdad.getText());
            servicio.agregarEstudiante(new Estudiante(id, nombre, edad));
            areaSalida.setText("Estudiante Agregado");
        });

        btnBuscar.addActionListener(e -> {
            int id = Integer.parseInt(campoId.getText());
            Estudiante est = servicio.buscarEstudiante(id);
            if (est != null)
                areaSalida.setText("Encontrado: " + est.getNombre() + ", Edad: " + est.getEdad());
            else
                areaSalida.setText("Estudiante no encontrado.");
        });

        btnActualizar.addActionListener(e -> {
            int id = Integer.parseInt(campoId.getText());
            String nombre = campoNombre.getText();
            int edad = Integer.parseInt(campoEdad.getText());
            boolean ok = servicio.actualizarEstudiante(new Estudiante(id, nombre, edad));
            areaSalida.setText(ok ? "Estudiante actualizado." : "No se encontró estudiante.");
        });

        btnEliminar.addActionListener(e -> {
            int id = Integer.parseInt(campoId.getText());
            boolean ok = servicio.eliminarEstudiante(id);
            areaSalida.setText(ok ? "Estudiante eliminado." : "No se encontró estudiante.");
        });

        btnListar.addActionListener(e -> {
            StringBuilder sb = new StringBuilder();
            for (Estudiante est : servicio.obtenerEstudiantes()) {
                sb.append("ID: ").append(est.getId()).append(", Nombre: ")
                        .append(est.getNombre()).append(", Edad: ")
                        .append(est.getEdad()).append("\n");
            }
            areaSalida.setText(sb.toString());
        });

        pack();
        setLocationRelativeTo(null);
        setVisible(true);
    }
}
