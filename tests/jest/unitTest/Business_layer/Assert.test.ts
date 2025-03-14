import { assert } from "@dataFunctions/assert";
import logger from "@logger/Logger";

jest.mock("@logger/Logger");

describe("assert function", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should not throw an error when condition is true", () => {
        const condition = true;
        const message = "This should not log or throw";

        expect(() => assert(condition, message)).not.toThrow();

        expect(logger.error).not.toHaveBeenCalled();
    });

    it("should throw an error when condition is false", () => {
        const condition = false;
        const message = "This should log and throw an error";

        expect(() => assert(condition, message)).toThrow(new Error(message));

        expect(logger.error).toHaveBeenCalledWith(message);
    });

    it("should throw an error with default message when no message is provided", () => {
        const condition = false;

        expect(() => assert(condition)).toThrowError(
            new Error("Assertion failed")
        );

        expect(logger.error).toHaveBeenCalledWith("Assertion failed");
    });

    it("should throw an error with custom message when condition is false", () => {
        const condition = false;
        const customMessage = "Custom failure message";

        expect(() => assert(condition, customMessage)).toThrowError(
            new Error(customMessage)
        );

        expect(logger.error).toHaveBeenCalledWith(customMessage);
    });
});
