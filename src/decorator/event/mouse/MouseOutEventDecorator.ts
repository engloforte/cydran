import AbstractEventDecorator from "../AbstractEventDecorator";

/**
 * @external
 */
class MouseOutEventDecorator extends AbstractEventDecorator {

	protected getEventKey(): string {
		return "mouseout";
	}

}

export default MouseOutEventDecorator;
