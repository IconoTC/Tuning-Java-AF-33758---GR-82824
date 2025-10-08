import java.util.ArrayList; 
import java.util.List; 
 
public class HeapTest { 
    public static void main(String[] args) { 
        List<byte[]> lista = new ArrayList<>(); 
        int mb = 1024 * 1024; 
 
        try { 
            for (int i = 1; i <= 2000; i++) { 
                lista.add(new byte[10 * mb]); // Reserva 10 MB 
                System.out.println("Asignados ~" + (i * 10) + " MB"); 
                Thread.sleep(500); 
            } 
        } catch (OutOfMemoryError e) { 
            System.err.println("💥 OutOfMemoryError: Heap insuficiente"); 
        } catch (InterruptedException e) { 
            e.printStackTrace(); 
        } 
    } 
}