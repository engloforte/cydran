import Logger from "@/logger/Logger";
import LoggerFactory from "@/logger/LoggerFactory";
import ScopeImpl from "@/model/ScopeImpl";

class Setter<T> {

	private expression: string;

	private logger: Logger;

	constructor(expression: string) {
		this.logger = LoggerFactory.getLogger("Setter: " + expression);
		this.expression = expression;
	}

	public set(scope: ScopeImpl, value: T): void {
		const code: string = '"use strict"; ' + scope.getCode() + " " + this.expression + " = arguments[1];";

		try {
			Function(code).apply({}, [scope.getItems(), value]);
		} catch (e) {
			this.logInvocationError(code, e);
		}
	}

	private logInvocationError(code: string, e: Error) {
		this.logger.error("\nAn exception (" + e.name + ") was thrown invoking the element mediator expression: " + this.expression
			 + "\n\nIn context:\n" + code + "\n\nException message: " + e.message + "\n\n", e);
	}

}

export default Setter;
