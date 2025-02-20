import log from "loglevel";
import remote from "loglevel-plugin-remote";

/**
 *
 * @param log - Log object
 * @returns json object for log message format
 */
const logMsgFormat = (log: any) => ({
    level: log.level,
    msg: log.message,
    stackTrace: log.stacktrace,
    userAgent: navigator.userAgent,
    timestamp: new Date().toISOString(),
});

log.enableAll();

/**
 *
 * @param log - Log object
 * @param url - URL to send log to
 * @param format - Log message format
 * @param level - Log level
 */
remote.apply(log, {
    url: "https://us-central1-data-a9e6d.cloudfunctions.net/app/add/msg",
    format: logMsgFormat,
    level: "critical",
});

export default log;
