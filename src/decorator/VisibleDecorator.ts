import {Decorator} from "../Core";

class VisibleElementDecorator extends Decorator<boolean> {

	public wire(): void {
		let value = this.getTarget();
		this.onTargetChange(value);
	}

	public unwire(): void {
		// Intentionally do nothing
	}

	protected onTargetChange(value: any): void {
		this.getEl().hidden = !value;
	}

}

export default VisibleElementDecorator;