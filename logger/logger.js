// check if running in broswer or node
let userAgent
if (typeof document != "undefined") {
    userAgent = window.navigator.userAgent
}

/**
 * Logger class to handle logging messages to a file and to a remote server
 * @class
 */
export class Logger {
    /**
     * Constructor for the Logger class
     * @constructor
     * @param {string} postUrl - The URL to post log messages to
     * @param {boolean} verbose - Whether to log messages to the console
     */
    constructor(postUrl, verbose = false, sendRemote = true) {
        this.verbose = verbose
        this.sendRemote = sendRemote
        this.logData = []
        this.postUrl =
            postUrl ||
            "https://us-central1-data-a9e6d.cloudfunctions.net/app/add/msg"
    }

    /**
     * Write a log message to the local file
     * @param {string} level - The log level of the message
     * @param {string} message - The message to log
     * @returns {void} - No return value
     */
    async localLog(level, message) {
        this.logData.push("\n" + JSON.stringify(`{ ${level}: ${message}, Date: ${new Date().toISOString()}, UserAgent: ${userAgent} }`))
    }

    /**
     * Get the log data
     * @returns {Array} - The log data
     */
    getLog() {
        return this.logData
    }

    /**
     * Log a message to the local file and to the remote server
     * @param {string} level - The log level of the message
     * @param {string} message - The message to log
     */
    log(level, message) {
        if (this.verbose || level === "ERROR" || level === "CRITICAL") {
            console.log(level, message)
        }
        this.localLog(level, message)

        if (this.sendRemote) {
            this.remoteLog(level, message)
        }
    }

    /**
     * Log a message with the level "ERROR"
     * @param {string} message - The message to log
     * @returns {void} - No return value
     * @description - Log a message with the level "ERROR"
     */
    logError(message) {
        this.log("ERROR", message)
    }

    /**
     * Log a message with the level "INFO"
     * @param {string} message - The message to log
     * @returns {void} - No return value
     * @description - Log a message with the level "INFO"
     */
    logInfo(message) {
        this.log("INFO", message)
    }

    /**
     * Log a message with the level "WARN"
     * @param {string} message - The message to log
     * @returns {void} - No return value
     * @description - Log a message with the level "WARNING"
     */
    logWarning(message) {
        this.log("WARNING", message)
    }

    /**
     * Log a message with the level "CRITICAL"
     * @param {string} message - The message to log
     * @returns {void} - No return value
     * @description - Log a message with the level "CRITICAL"
     */
    logCritical(message) {
        this.log("CRITICAL", message)
    }

    /**
     * Turn on verbose logging
     * @returns {void} - No return value
     * @description - Toggle verbose logging, output all messages to the console
     */
    toggleVerbose() {
        this.verbose = !this.verbose
    }

    /**
     * Post a log message to the remote server
     * @param {string} level - The log level of the message
     * @param {string} message - The message to log
     * @returns {Promise} - A promise that resolves when the message is posted
     */
    async remoteLog(level, message) {
        await fetch(this.postUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                level: level,
                msg: message,
                userAgent: userAgent || "unknown",
            }),
        })
            .then((response) => {
                if (response.ok) {
                    return { status: "success" }
                } else {
                    return { status: "error" }
                }
            })
            .catch((error) => {
                console.error("Error:", error)
            })
    }
}
