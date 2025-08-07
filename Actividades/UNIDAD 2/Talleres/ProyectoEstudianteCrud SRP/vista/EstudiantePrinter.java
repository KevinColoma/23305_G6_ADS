package vista;

import modelo.Estudiante;

public class EstudiantePrinter {
    public void imprimir(Estudiante e) {
        System.out.println("Estudiante: " + e.getNombre());
    }
}