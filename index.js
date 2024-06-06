const express = require('express');
const path = require('path');
const createSes = require('./functions/sessions');
const fs = require("fs");
const { exec } = require('child_process');

function installChromeBrowser() {
  return new Promise((resolve, reject) => {
    exec('npx puppeteer browsers install chrome', (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        reject(error);
        return;
      }
      console.log(`stdout: ${stdout}`);
      console.error(`stderr: ${stderr}`);
      resolve();
    });
  });
}

installChromeBrowser().then(() => {
  console.log('Chrome browser installed successfully.');
}).catch((error) => {
  console.error('Error installing Chrome browser:', error);
});

const app = express();
const sessionPath = path.join(__dirname, 'tokens', "client1");
const lockFilePath = path.join(sessionPath, 'SingletonLock');
if (fs.existsSync(lockFilePath)) {
    fs.rm(lockFilePath);
    console.log("Deleted...")
}

const sock = createSes();
let client;
sock.then((c) => (client = c))
if (sock) console.log(sock)


const port = parseInt(process.env.PORT) || process.argv[3] || 8080;

app.use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/api', (req, res) => {
  res.json({"msg": "Hello world"});
});

app.get("/alok", (req, res) => {
  res.render("alok");
})
app.get("/api/:number/:msg", async (req, res) => {
  const {number, msg} = req.params;
  if (!number || !msg) return res.json("error no body")
  console.log(number, msg)
  await client
  .sendText(number+'@c.us', msg)
  .then((result) => {
    console.log('Result: ', result); //return object success
    res.json("success")
  })
  .catch((erro) => {
    console.error('Error when sending: ', erro); //return object error
    res.json("error")
  });
})

app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
})