package logica_negocio.memento;
import java.util.Stack;


public class Caretaker {
    private final Stack<Memento> historial = new Stack<>();

    public void guardar(Memento memento) {
        historial.push(memento);
    }

    public Memento deshacer() {
        return historial.isEmpty() ? null : historial.pop();
    }
}
