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
     */
    constructor(postUrl) {
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
        this.logData.push("\n" + JSON.stringify(`{ ${level}: ${message}, Date: ${new Date().toISOString()}, UserAgent: ${userAgent} }`)  ) 
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
        this.localLog(level, message)
        this.logMessage(level, message)
    }

    /**
     * Post a log message to the remote server
     * @param {string} level - The log level of the message
     * @param {string} message - The message to log
     * @returns {Promise} - A promise that resolves when the message is posted
     */
    async logMessage(level, message) {
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
