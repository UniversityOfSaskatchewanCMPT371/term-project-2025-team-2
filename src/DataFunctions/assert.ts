import logger from "@logger/Logger";

/**
 * Asserts that a condition is true, otherwise throws an error
 * @description asserts that a condition is true, otherwise throws an error
 * @precondition boolean condition to check, message to log if condition is false
 * @postcondition throws error if condition is false
 * @param {boolean} condition
 * @param {string} message
 * @returns {void}
 * @throws {Error} if condition is false
 */
export function assert(
    condition: boolean,
    message?: string
): asserts condition {
    if (!condition) {
        logger.error(message || "Assertion failed");
        throw new Error(message || "Assertion failed");
    }
}
