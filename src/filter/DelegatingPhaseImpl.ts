import AbstractPhaseImpl from "@/filter/AbstractPhaseImpl";
import { Phase } from "@/filter/Interfaces";
import { requireNotNull } from "@/util/ObjectUtils";

class DelegatingPhaseImpl extends AbstractPhaseImpl {

	private fn: (input: any[]) => any[];

	constructor(previous: Phase, fn: (input: any[]) => any[]) {
		super(previous);
		this.fn = requireNotNull(fn, "fn");
	}

	protected execute(items: any[]): any[] {
		return this.fn.apply({}, [items]);
	}

}

export default DelegatingPhaseImpl;