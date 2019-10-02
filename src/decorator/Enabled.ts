import {Decorator} from "../Core";

class Enabled extends Decorator<boolean> {

	public wire(): void {
		const value = this.getMediator().get();
		this.onTargetChange(null, value);
		this.getMediator().watch(this, this.onTargetChange);
	}

	public unwire(): void {
		// Intentionally do nothing
	}

	protected onTargetChange(previous: any, current: any): void {
		this.getEl()["disabled"] = !current;
	}

}

export default Enabled;