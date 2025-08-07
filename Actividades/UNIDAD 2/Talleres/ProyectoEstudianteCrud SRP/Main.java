import modelo.Estudiante;
import dao.EstudianteDAO;
import vista.EstudiantePrinter;

public class Main {
    public static void main(String[] args) {
        Estudiante estudiante = new Estudiante(1, "Juan Pérez");

        EstudianteDAO dao = new EstudianteDAO();
        dao.guardar(estudiante);

        EstudiantePrinter printer = new EstudiantePrinter();
        printer.imprimir(estudiante);
    }
}