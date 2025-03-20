import log from "loglevel";
import remote from "loglevel-plugin-remote";

/**
 * Format log messages for remote logging
 * @description Creates a standardized JSON format for log messages with additional metadata
 * @precondition The log parameter must be a valid log message object with level, message, and stacktrace properties
 * @postcondition A formatted JSON object is returned with standardized fields for remote logging
 * @param {object} log - Log message object from loglevel
 * @param {string} log.level - The logging level of the message
 * @param {string} log.message - The content of the log message
 * @param {string} log.stacktrace - Stack trace information if available
 * @returns {object} Formatted JSON object containing the log message with metadata
 * @returns {string} returns.level - The logging level
 * @returns {string} returns.msg - The log message content
 * @returns {string} returns.stackTrace - Stack trace for error tracking
 * @returns {string} returns.userAgent - Browser user agent information
 * @returns {string} returns.timestamp - ISO timestamp of when the log was created
 */
const logMsgFormat = (log: any) => ({
    level: log.level,
    msg: log.message,
    stackTrace: log.stacktrace,
    userAgent: navigator.userAgent,
    timestamp: new Date().toISOString(),
});

// log.enableAll(); // this puts all messages to console, off only warn or higher gets printed
log.setLevel("warn");

/**
 * Configure remote logging for the application
 * @description Sets up remote logging to send critical log messages to a specified endpoint
 * @precondition
 * - log must be a valid loglevel logger instance
 * - logMsgFormat must be a function that formats log messages
 * - The remote server at the URL must be available and accept log messages
 * @postcondition
 * - Remote logging is enabled for messages at the specified level and above
 * - Log messages will be formatted according to the format function before sending
 * @param {object} log - The loglevel logger instance to configure for remote logging
 * @param {object} options - Configuration options for remote logging
 * @param {string} options.url - The URL endpoint where log messages will be sent
 * @param {function} options.format - Function to format log messages before sending
 * @param {string} options.level - Minimum log level to send remotely ("trace"|"debug"|"info"|"warn"|"error"|"critical")
 * @returns {void} This function doesn't return a value
 */
remote.apply(log, {
    url: "https://us-central1-data-a9e6d.cloudfunctions.net/app/add/msg",
    format: logMsgFormat,
    level: "critical",
});

export default log;
