package logica_negocio;

import logica_negocio.memento.Caretaker;
import logica_negocio.memento.Memento;
import logica_negocio.memento.Originator;
import modelo.Estudiante;
import repository.EstudianteRepository;

import java.util.ArrayList;
import java.util.List;

public class EstudianteService {
    private final Originator originator = new Originator();
    private final Caretaker caretaker = new Caretaker();
    private final EstudianteRepository repositorio = new EstudianteRepository();

    private void respaldarEstado() {
        originator.setEstado(new ArrayList<>(repositorio.obtenerTodos()));
        caretaker.guardar(originator.guardar());
    }

    //Llamada al metodo agregar estudiante
    public void agregarEstudiante(Estudiante estudiante) {
        respaldarEstado(); // Guardar antes de modificar
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
        respaldarEstado();
        return repositorio.eliminar(id);
    }

    public boolean deshacer() {
        Memento memento = caretaker.deshacer();
        if (memento != null) {
            List<Estudiante> restaurado = originator.restaurar(memento);
            repositorio.reemplazarTodo(restaurado);
            return true;
        }
        return false;
    }
}
