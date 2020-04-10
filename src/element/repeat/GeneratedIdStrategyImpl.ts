import IdStrategy from "@/element/repeat/IdStrategy";
import ObjectUtils from "@/util/ObjectUtils";
import { uuidV4 } from "@/util/UuidUtils";

class GeneratedIdStrategyImpl implements IdStrategy {

	private idKey: string;

	constructor(idKey: string) {
		this.idKey = idKey;
	}

	public check(item: any): boolean {
		return ObjectUtils.isDefined(item[this.idKey]);
	}

	public enrich(item: any, index: number): void {
		item[this.idKey] = uuidV4();
	}

	public extract(item: any): string {
		return item[this.idKey] + "";
	}

	public init(): void {
		// Intentionally do nothing
	}

}

export default GeneratedIdStrategyImpl;
