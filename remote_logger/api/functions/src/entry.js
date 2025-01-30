const {db} = require("../config/firebase_config.js");
const requestIp = require("request-ip");

const addLog = async (req, res) => {
  const {level, msg, userAgent} = req.body;

  try {
    const log = db.collection("logs").doc();
    const logObject = {
      id: log.id,
      level,
      msg,
      userAgent,
      date: new Date().toISOString(),
      ip: requestIp.getClientIp(req),
    };

    log.set(logObject);

    res.status(200).send({
      status: "success",
      message: "entry added successfully",
      data: logObject,
    });
  } catch  {
    res.status(500).json("We found an error posting your request!");
  }
};

// const getAllEntries = async (req, res) => {
//   try {
//     const allEntries = [];
//     const querySnapshot = await db.collection("entries").get();
//     querySnapshot.forEach((doc) => allEntries.push(doc.data()));
//     return res.status(200).json(allEntries);
//   } catch (error) {
//     return res.status(500).json("We found an error fetching your request!");
//   }
// };

module.exports = {addLog};
