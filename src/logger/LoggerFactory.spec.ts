import LoggerFactory from "@/logger/LoggerFactory";
import { assertNullGuarded } from "@/TestUtils";
import { describe, it } from "mocha";

describe("LoggerFactory tests", () => {

	it("getLogger() - null name", () => {
		assertNullGuarded("name", () => LoggerFactory.getLogger(null));
	});

});
