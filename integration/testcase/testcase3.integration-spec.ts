import { builder, Stage, Component, HOOKS, Ids } from "cydran";

test("Digestion - No element mediators", () => {
	document.body.innerHTML = '<div></div>';

	const stage: Stage = builder("body")
		.withWarnLogging()
		.build();

	stage.start();

	expect(stage.isStarted()).toEqual(true);
	expect(stage.get(Ids.STAGE)).not.toBeNull();
});
