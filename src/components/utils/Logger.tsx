import log from "loglevel";
// import remote from "loglevel-plugin-remote";

// const logMsgFormat = (log: any) => ({
//   level: log.level,
//   msg: log.message,
//   timestamp: new Date().toISOString(),
// });

log.enableAll();

// remote.apply(log, {
//   url: "https://us-central1-data-a9e6d.cloudfunctions.net/app/add/msg",
//   format: logMsgFormat,
// });

export default log;
