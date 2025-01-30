
// This function logs a message to the database
export function logMessage(level, message) {

  fetch('https://us-central1-data-a9e6d.cloudfunctions.net/app/entry', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        title: level,
        text: message
    })
  })
  .then(response => response.json())
  .catch(error => console.error(error));

}


