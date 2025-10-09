/*
 * https://docs.oracle.com/javase/tutorial/essential/concurrency/deadlock.html
 * 
 * Alphonse y Gaston son amigos y grandes creyentes en la cortesía. Una regla 
 * estricta de cortesía es que, al hacer una reverencia a un amigo, debes 
 * mantenerla hasta que tu amigo tenga la oportunidad de devolverla. 
 * Desafortunadamente, esta regla no contempla la posibilidad de que dos amigos 
 * se inclinen al mismo tiempo. 
 * 
 * jstack <pid>
 * jcmd <pid> Thread.print
 */

public class DeadlockTest {
    static class Friend {
        private final String name;

        public Friend(String name) {
            this.name = name;
        }

        public String getName() {
            return this.name;
        }

        public synchronized void bow(Friend bower) {
            System.out.format("%s: %s has bowed to me!%n",
                    this.name, bower.getName());
            bower.bowBack(this);
        }

        public synchronized void bowBack(Friend bower) {
            System.out.format("%s: %s has bowed back to me!%n",
                    this.name, bower.getName());
        }
    }

    public static void main(String[] args) throws InterruptedException {
        final Friend alphonse = new Friend("Alphonse");
        final Friend gaston = new Friend("Gaston");
        System.out.println("Ronda de saludos");
        new Thread(new Runnable() {
            public void run() {
                alphonse.bow(gaston);
            }
        }, "Thread-Alphonse").start();
        if (args.length > 0) Thread.sleep(10);
        new Thread(new Runnable() {
            public void run() {
                gaston.bow(alphonse);
            }
        }, "Thread-Gaston").start();
    }

}
