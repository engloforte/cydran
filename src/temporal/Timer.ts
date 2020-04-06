import ObjectUtils from "@/util/ObjectUtils";
import Properties from "@/config/Properties";

const requireNotNull = ObjectUtils.requireNotNull;
const DEFAULT_INTERVAL_MILLIS: number = 1000;

class Timer {

	private intervalMillis: number;

	private callback: () => void;

	private handle: number;

	constructor(callback: () => void, intervalMillis?: number) {
		this.callback = requireNotNull(callback, "callback");
		this.intervalMillis = (intervalMillis === null || intervalMillis === undefined) ? DEFAULT_INTERVAL_MILLIS : intervalMillis;
		this.handle = null;
	}

	public start(): void {
		if (this.handle == null) {
			this.handle = Properties.getWindow().setInterval(this.callback, this.intervalMillis);
		}
	}

	public stop(): void {
		if (this.handle !== null) {
			clearInterval(this.handle);
			this.handle = null;
		}
	}

}

export default Timer;
