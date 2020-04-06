
interface Hooks<T> {

	add(listener: (context: T) => void): void;

	notify(context: T): void;

}

export default Hooks;
