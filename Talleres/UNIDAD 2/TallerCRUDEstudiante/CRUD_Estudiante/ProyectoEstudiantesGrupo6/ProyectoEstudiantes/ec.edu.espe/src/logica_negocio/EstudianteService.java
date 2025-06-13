package logica_negocio;

import modelo.Estudiante;
import repository.EstudianteRepository;
import java.util.List;

public class EstudianteService {
    private final EstudianteRepository repositorio = new EstudianteRepository();

    //Llamada al metodo agregar estudiante
    public void agregarEstudiante(Estudiante estudiante) {
        repositorio.agregar(estudiante);
    }

    //Llamada al metodo obtener estudiante
    public List<Estudiante> obtenerEstudiantes() {
        return repositorio.obtenerTodos();
    }

    //Llamada al metodo buscar estudiante por id
    public Estudiante buscarEstudiante(int id) {
        return repositorio.buscarPorId(id);
    }

    //Llamada al metodo actualizar estudiante
    public boolean actualizarEstudiante(Estudiante estudiante) {
        return repositorio.actualizar(estudiante);
    }

    //Llamada al metodo eliminar estudiante
    public boolean eliminarEstudiante(int id) {
        return repositorio.eliminar(id);
    }
}














