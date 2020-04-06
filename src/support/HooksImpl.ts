import ObjectUtils from "@/util/ObjectUtils";
import Hooks from "@/support/Hooks";

const requireNonNull = ObjectUtils.requireNotNull;

class HooksImpl<T> implements Hooks<T> {

	private listeners: ((context: T) => void)[];

	constructor() {
		this.listeners = [];
	}

	public add(listener: (context: T) => void): void {
		requireNonNull(listener, "listener");
		this.listeners.push(listener);
	}

	public notify(context: T): void {
		for (const listener of this.listeners) {
			listener.apply({}, [context]);
		}
	}

}

export default HooksImpl;
