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
     * @param {string} handle - The file handle to write log messages to
     * @param {string} postUrl - The URL to post log messages to
     */
    constructor(handle, postUrl) {
        this.handle = handle || null
        this.postUrl =
            postUrl ||
            "https://us-central1-data-a9e6d.cloudfunctions.net/app/add/msg"
    }

    /**
     * Set the file handle to write log messages to
     */
    async pickHandle() {
        this.handle = await window.showSaveFilePicker()
        this.writableStream = await this.handle.createWritable()
    }

    /**
     * Write a log message to the local file
     * @param {string} level - The log level of the message
     * @param {string} message - The message to log
     * @returns {Promise} - A promise that resolves when the message is written
     */
    async localLog(level, message) {
        if (this.handle == null) {
            console.log("No local log file set")
        } else {
            try {
                await this.writableStream.write(
                    JSON.stringify(`{${level}: ${message}}`) + ",\n"
                )
            } catch (err) {
                console.error(err.name, err.message)
            }
        }
    }

    /**
     * Close the local log file
     * @returns {Promise} - A promise that resolves when the file is closed
     */
    async closeFile() {
        await this.writableStream.close()
        console.log("close log file")
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
