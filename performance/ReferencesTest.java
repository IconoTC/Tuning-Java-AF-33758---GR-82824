import java.lang.ref.SoftReference;
import java.lang.ref.WeakReference;
import java.util.ArrayList;
import java.util.List;

public class ReferencesTest {

    public static void main(String[] args) throws InterruptedException {
        String opcion = args.length > 0 ? args[0].toLowerCase() : "h";
        switch (opcion) {
            case "s":
                esperaMonitor();
                soft();
                break;
            case "w":
                esperaMonitor();
                weak();
                break;
            case "m":
                metadata();
                break;
            default:
                esperaMonitor();
                hard();
                break;
        }
    }

    public static void esperaMonitor() throws InterruptedException {
        System.out.print("Esperando en 10 segundos: ");
        for (int i = 10; i > 0; i--) {
            System.out.print(i + " ");
            Thread.sleep(1000);
        }
        System.out.println("\nComenzando...");
    }

    public static void hard() {
        List<byte[]> lista = new ArrayList<>();
        int mb = 1024 * 1024;

        try {
            for (int i = 1; i <= 1000; i++) {
                lista.add(new byte[10 * mb]); // añade 10 MB cada iteración
                System.out.println("Asignados ~" + (lista.size() * 10) + " MB");
                Thread.sleep(10);
            }
        } catch (OutOfMemoryError e) {
            System.out.println("💥 OutOfMemoryError: Heap insuficiente");
            System.out.println(lista.size() + " objetos");
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }

    public static void soft() {
        List<SoftReference<byte[]>> lista = new ArrayList<>();
        int mb = 1024 * 1024;

        try {
            for (int i = 1; i <= 1000; i++) {
                lista.add(new SoftReference<byte[]>(new byte[10 * mb])); // añade 10 MB cada iteración
                System.out.println("Asignados ~" + (i * 10) + " MB");
                Thread.sleep(10);
            }
            System.out.println(lista.size() + " objetos asignados");
            int cont = 0;
            for (SoftReference<byte[]> ref : lista) {
                if (ref.get() != null) {
                    cont++;
                }
            }
            System.out.println(cont + " objetos no recolectados");
        } catch (OutOfMemoryError e) {
            System.out.println("💥 OutOfMemoryError: Heap insuficiente");
            System.out.println(lista.size() + " objetos");
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }

    public static void weak() {
        List<WeakReference<byte[]>> lista = new ArrayList<>();
        int mb = 1024 * 1024;

        try {
            for (int i = 1; i <= 1000; i++) {
                lista.add(new WeakReference<byte[]>(new byte[10 * mb])); // añade 10 MB cada iteración
                System.out.println("Asignados ~" + (i * 10) + " MB");
                Thread.sleep(10);
            }
            System.out.println(lista.size() + " objetos asignados");
            int cont = 0;
            for (WeakReference<byte[]> ref : lista) {
                if (ref.get() != null) {
                    cont++;
                }
            }
            System.out.println(cont + " objetos no recolectados");
        } catch (OutOfMemoryError e) {
            System.out.println("💥 OutOfMemoryError: Heap insuficiente");
            System.out.println(lista.size() + " objetos");
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }

    public static void metadata() throws InterruptedException {
        int mb = 1024 * 1024;

        Persona persona = new Persona(1, "Pepito Grillo", new byte[10 * mb]);
        SoftReference<Persona> ref = new SoftReference<Persona>(persona);

        System.out.println(
                "Persona creada: " + persona.getNombre() + " con foto de " + persona.getFoto().length / mb + " MB");
        System.out.println("Referencia creada: " + ref.get().getNombre() + " con foto de "
                + ref.get().getFoto().length / mb + " MB");
        System.out.println("Antes de perder la referencia fuerte:");
        persona = null;
        System.out.println("Después de perder la referencia fuerte:");
        if (ref.get() != null) {
            System.out.println(ref.get().toString());
        } else {
            System.out.println("Persona ya no referenciada: null");
        }
        System.out.println("Solicitando recolector de basura...");
        System.gc();
        Thread.sleep(100);
        System.out.println("Después de GC:");
        System.out.println(ref.get() != null ? ref.get().toString() : "Pepito Grillo ya no referenciado");
        List<byte[]> lista = new ArrayList<>();
        while (ref.get() != null) {
            lista.add(new byte[1 * mb]); // añade 10 MB cada iteración
        }
        System.out.println(ref.get() != null ? ref.get().toString() : "Pepito Grillo ya no referenciado");
    }

    public static class Persona {
        private int id;
        private String nombre;
        private WeakReference<byte[]> foto;

        public Persona(int id, String nombre, byte[] foto) {
            this.id = id;
            this.nombre = nombre;
            this.foto = new WeakReference<byte[]>(foto);
        }

        public int getId() {
            return id;
        }

        public String getNombre() {
            return nombre;
        }

        public byte[] getFoto() {
            if (foto != null)
                return foto.get();
            if (foto.get() == null) {
                System.out.println("Foto de " + nombre + " ya no está en memoria");
            }
            return null;

        }

        @Override
        public String toString() {
            return "Persona [id=" + id + ", nombre=" + nombre + "]"
                    + (foto != null && foto.get() != null ? " con foto" : " sin foto");
        }

        @SuppressWarnings("removal")
        @Override
        protected void finalize() throws Throwable {
            System.out.println("Finalizando " + nombre);
            foto = null;
            super.finalize();
        }
    }

}
/*
 * java -Xms32m -Xmx64m HeapTest
 * java -Xms128m -Xmx256m ReferencesTest
 * java -Xms512m -Xmx1g ReferencesTest
 * java -Xms32m -Xmx128m -Xlog:gc*,gc+phases=debug:gc.log ReferencesTest m
 * 
 */