
// check if running in broswer or node
let userAgent;
if(document != "undefined") {
  userAgent = window.navigator.userAgent;
}


export class Logger {

  constructor() {
    this.handle = null;
  }

  async pickHandle() {
    this.handle = await window.showSaveFilePicker();
    this.writableStream = await this.handle.createWritable();
  }


  async localLog(level, message) {
    try {
      await this.writableStream.write(JSON.stringify(`{${level}: ${message}}`) + ",\n");
    } catch (err) {
      console.error(err.name, err.message);
    }
  }

  async closeFile(){
    await this.writableStream.close();
    console.log("close log file");
  }


  log(level, message) {
    this.localLog(level, message);
    this.logMessage(level, message);
  }


  async logMessage(level, message) {
  
    fetch('https://us-central1-data-a9e6d.cloudfunctions.net/app/add/msg', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
          level: level,
          msg: message,
          userAgent: userAgent
      })
    })
    .then(response => response.json())
    .catch(error => console.error(error));
  }

}

