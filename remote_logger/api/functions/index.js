/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

// const {onRequest} = require("firebase-functions/v2/https");
// const logger = require("firebase-functions/logger");
const functions = require("firebase-functions");

const {addLog} = require("./src/entry");

const express = require("express");
const app = express();

const cors = require("cors");
app.use(cors({origin: true}));

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

app.get("/", (req, res) => res.status(200).send("Hey there!"));

app.post("/add/msg", addLog);

// app.get("/all", getAllEntries);

exports.app = functions.https.onRequest(app);

