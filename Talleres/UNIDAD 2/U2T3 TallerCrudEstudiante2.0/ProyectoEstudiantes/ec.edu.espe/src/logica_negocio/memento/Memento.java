package logica_negocio.memento;
import modelo.Estudiante;
import java.util.ArrayList;
import java.util.List;

public class Memento {
    private final List<Estudiante> estado;

    public Memento(List<Estudiante> estado) {
        // Copia profunda
        this.estado = new ArrayList<>();
        for (Estudiante e : estado) {
            this.estado.add(new Estudiante(e.getId(), e.getNombre(), e.getEdad()));
        }
    }

    public List<Estudiante> getEstado() {
        return estado;
    }
}