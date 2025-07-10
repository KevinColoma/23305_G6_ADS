package dao;

import modelo.Estudiante;

public class EstudianteDAO {
    public void guardar(Estudiante e) {
        System.out.println("Guardando estudiante en la BD: " + e.getNombre());
    }
}