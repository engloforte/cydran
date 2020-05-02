import DigestionCandidate from "@/mvvm/DigestionCandidate";
import SimpleMap from "@/pattern/SimpleMap";
import DigestionContext from "@/mvvm/DigestionContext";
import Logger from "@/logger/Logger";
import LoggerFactory from "@/logger/LoggerFactory";
import Notifyable from "@/mvvm/Notifyable";

class DigestionContextImpl implements DigestionContext {

	private readonly logger: Logger = LoggerFactory.getLogger("DigestionContextImpl");

	private mediators: SimpleMap<DigestionCandidate[]>;

	constructor() {
		this.mediators = {};
	}

	public add(key: string, mediators: DigestionCandidate[]): void {
		if (!this.mediators[key]) {
			this.mediators[key] = [];

			for (const mediator of mediators) {
				this.mediators[key].push(mediator);
			}
		}
	}

	public digest(): Notifyable[] {
		const changedMediators: DigestionCandidate[] = [];

		for (const key in this.mediators) {
			if (!this.mediators.hasOwnProperty(key)) {
				continue;
			}

			const current: DigestionCandidate[] = this.mediators[key];
			this.digestSegment(changedMediators, current);
		}

		return changedMediators;
	}

	private digestSegment(changedMediators: DigestionCandidate[], mediators: DigestionCandidate[]): void {
		for (const mediator of mediators) {
			let changed: boolean = false;

			try {
				changed = mediator.evaluate();
			} catch (e) {
				this.logger.error("Error evaluating mediator: " + mediator.constructor.name);
			}

			if (changed) {
				changedMediators.push(mediator);
			}
		}
	}

}

export default DigestionContextImpl;
