package modelo;
import java.util.HashMap;
import java.util.Map;

public class FlyweightFactory {
    private static final Map<String, String> nombres = new HashMap<>();

    public static String getNombre(String nombre) {
        return nombres.computeIfAbsent(nombre, k -> k);
    }
}
