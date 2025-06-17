package repository;

import modelo.Estudiante;
import java.util.ArrayList;
import java.util.List;

public class EstudianteRepository {
    private final List<Estudiante> estudiantes = new ArrayList<>();

    //Metodo para agregar un objeto de tipo estudiante
    public void agregar(Estudiante estudiante) {
        estudiantes.add(estudiante);
    }

    //Metodo para mostrar todos los estudiantes registrados
    public List<Estudiante> obtenerTodos() {
        return estudiantes;
    }

    //Metodo para consultar estudiante por id
    public Estudiante buscarPorId(int id) {
        for (Estudiante estudiante : estudiantes) {
            if (estudiante.getId() == id) {
                return estudiante;
            }
        }
        return null;
    }

    //Metodo para modificar un estudiante existente
    public boolean actualizar(Estudiante estudiante) {
        for (int i = 0; i < estudiantes.size(); i++) {
            if (estudiantes.get(i).getId() == estudiante.getId()) {
                estudiantes.set(i, estudiante);
                return true;
            }
        }
        return false;
    }

    //Metodo para eliminar un estudiante
    public boolean eliminar(int id) {
        return estudiantes.removeIf(estudiante -> estudiante.getId() == id);
    }

    public void reemplazarTodo(List<Estudiante> nuevosEstudiantes) {
        estudiantes.clear();
        estudiantes.addAll(nuevosEstudiantes);
    }

}

