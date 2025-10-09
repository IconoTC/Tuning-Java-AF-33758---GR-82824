import java.lang.ref.SoftReference;
import java.lang.ref.WeakReference;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.EmptyStackException;
import java.util.HashSet;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Objects;
import java.util.Set;

public class MemoryLeakTest {

    public static void main(String[] args) throws InterruptedException {
        String opcion = args.length > 0 ? args[0].toLowerCase() : "h";
        switch (opcion) {
            case "c":
                conjuntos();
                break;
        }
    }

    public static void esperaMonitor() throws InterruptedException {
        // System.out.print("Esperando en 10 segundos: ");
        // for (int i = 10; i > 0; i--) {
        //     System.out.print(i + " ");
        //     Thread.sleep(1000);
        // }
        // System.out.println("\nComenzando...");
    }

    public static void conjuntos() throws InterruptedException {
        int mb = 1024 * 1024;
        esperaMonitor();

        System.out.println("Creando persona con fotos...");
        Persona persona = new Persona(1, "Pepito Grillo",
                List.of(new byte[10 * mb], new byte[5 * mb], new byte[2 * mb]));
        System.out.println(persona);
        System.out.println("Refrescando fotos...");
        for (int i = 1; i <= 10; i++) {
            for (Foto foto : persona.getFotos()) {
                persona.addFoto(foto.getId(), foto.getDatos());
            }
            System.out.println(persona);
        }
        System.out.println("Eliminando fotos...");
        Foto foto = persona.getFotos().get(1);
        for (int i = 1; i <= 3; i++) {
            persona.removeFoto(i);
            System.out.println(persona);
        }
        System.out.println("Eliminando persona...");
        persona = null;
        System.gc();
        Thread.sleep(100);
        System.out.println(foto.getPersona() != null ? foto.getPersona() : "La persona ya no existe");
        foto.setPersona(null);
        esperaMonitor();
        System.gc();
        esperaMonitor();
        Thread.sleep(100);
        System.out.println(foto.getPersona() != null ? foto.getPersona() : "La persona ya no existe");
        System.out.println("Eliminando última foto...");
        foto = null;
        System.gc();
        Thread.sleep(100);
        System.out.println("Fin del programa");
    }

    public static class Foto {
        private int id;
        private byte[] datos;
        private Persona persona;

        public Foto(int id, byte[] datos) {
            this.id = id;
            this.datos = datos;
        }

        public Foto(byte[] datos) {
            this.datos = datos;
        }

        public int getId() {
            return id;
        }

        public byte[] getDatos() {
            return datos;
        }

        public Persona getPersona() {
            return persona;
        }

        public void setDatos(byte[] datos) {
            this.datos = datos;
        }

        public void setPersona(Persona persona) {
            this.persona = persona;
        }

        @Override
        public int hashCode() {
            final int prime = 31;
            int result = 1;
            result = prime * result + id;
            return result;
        }

        @Override
        public boolean equals(Object obj) {
            if (this == obj)
                return true;
            if (obj == null)
                return false;
            if (getClass() != obj.getClass())
                return false;
            Foto other = (Foto) obj;
            if (id != other.id)
                return false;
            return true;
        }

        @Override
        public String toString() {
            return "Foto [id=" + id + ", datos=" + datos.length / 1024 + "Kb, persona=" + (persona != null ? persona : "null") + "]";
        }

    }

    public static class Persona {
        private int id;
        private String nombre;
        private Set<Foto> fotos;

        public Persona(int id, String nombre, List<byte[]> fotos) {
            this.id = id;
            this.nombre = nombre;
            // this.fotos = new HashSet<>(); 
            this.fotos = new LinkedHashSet<>();
            for (byte[] foto : fotos) {
                addFoto(this.fotos.size() + 1, foto);

            }
        }

        public int getId() {
            return id;
        }

        public String getNombre() {
            return nombre;
        }

        public Foto addFoto(int id, byte[] datos) {
            Foto foto = new Foto(id, datos);
            foto.persona = this;
            fotos.add(foto);
            return foto;
        }

        public Foto addFoto(Foto datos) {
            Foto foto = new Foto(datos.getId(), datos.getDatos());
            foto.persona = this;
            fotos.add(foto);
            return foto;
        }

        public Foto removeFoto(int id) {
            for (Foto foto : fotos) {
                if (foto.getId() == id) {
                    fotos.remove(foto);
                    return foto;
                }
            }
            return null;
        }

        public List<MemoryLeakTest.Foto> getFotos() {
            if (fotos != null && !fotos.isEmpty()) {
                return fotos.stream().toList();
            }
            return null;
        }

        @Override
        public String toString() {
            return "Persona [id=" + id + ", nombre=" + nombre + "] con " + fotos.size() + " fotos";
        }

        @SuppressWarnings("removal")
        @Override
        protected void finalize() throws Throwable {
            System.out.println("Finalizando " + nombre);
            super.finalize();
        }
    }

    public static class StackDefectuoso {
        private Object[] elementos;
        private int size = 0;
        private static final int CAPACIDAD_INICIAL = 1024;

        public StackDefectuoso() {
            elementos = new Object[CAPACIDAD_INICIAL];
        }

        public void push(Object e) {
            // Lógica de crecimiento del arreglo omitida por simplicidad
            elementos[size++] = e;
        }

        public Object pop() {
            if (size == 0) {
                throw new EmptyStackException();
            }
            // **********************************************
            // ¡EL DEFECTO!
            // Devolvemos el objeto, pero la referencia en el arreglo
            // subyacente (elementos[size-1]) todavía existe.
            // **********************************************
            return elementos[--size];
        }
    }
}
/*
 * java -XX:StartFlightRecording.duration=60s,filename=recording.jfr,settings=profile -Xms32m -Xmx64m MemoryLeakTest c
 * 
 */