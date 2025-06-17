package logica_negocio.memento;
import modelo.Estudiante;
import java.util.List;


public class Originator {
    private List<Estudiante> estado;

    public void setEstado(List<Estudiante> estado) {
        this.estado = estado;
    }

    public Memento guardar() {
        return new Memento(estado);
    }

    public List<Estudiante> restaurar(Memento memento) {
        return memento.getEstado();
    }
}
