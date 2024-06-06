const wconnect = require("@wppconnect-team/wppconnect");

function start(client) {
    client.onMessage((message) => {
      if (message.body === 'Hello') {
        client
          .sendText(message.from, 'Hello, how I may help you?')
          .then((result) => {
            console.log('Result: ', result); //return object success
          })
          .catch((erro) => {
            console.error('Error when sending: ', erro); //return object error
          });
      }

    }
  );
}

function createSes() {
    const sessionPath = './session';
return wconnect
.create({
  headless: true,
  session: 'client1',
  statusFind: (statusSession, session) => {
    if (statusSession === 'serverClose') {
      console.log('Server closed');
    }
    if (statusSession === 'deleteToken') {
       createSes();
    }
    if (statusSession == "isLogged") console.log("Logged")
    if (statusSession == "qrReadSuccess") console.log("QR Code read")
    // return: isLogged || notLogged || browserClose || qrReadSuccess || qrReadFail || autocloseCalled || desconnectedMobile || deleteToken
    console.log('Status Session: ', statusSession);
    // create session wss return "serverClose" case server for close
    console.log('Session name: ', session);
  },
  puppeteerOptions: {
    args: [
        `--user-data-dir=${sessionPath}`,
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--disable-gpu'
    ],
    protocolTimeout: 160000 // Set timeout to 60 seconds
},
})
.then((client) => {
    start(client)
    return client
})
.catch((error) => console.log(error));

}

module.exports = createSes;