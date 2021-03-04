// const https = require('https');
// const fs = require('fs');
const http = require('http');
const app = require('./app');
// const runSocket = require('./socket');
const { port } = require("./config/Config");
const port_name = process.env.PORT || port;
const server = http.createServer(app);
// const server = https.createServer({
//     key: fs.readFileSync('./ssl/tpapis_com.txt'),
//     cert: fs.readFileSync('./ssl/tpapis_com.crt'),
//     ca: fs.readFileSync('./ssl/SectigoRSADomainValidationSecureServerCA.crt'),
//     requestCert: false,
//     rejectUnauthorized: false
// }, app);

// const io = require('socket.io')(server);
// runSocket(io);

server.listen(port_name);
console.log("server listen port " + port_name);






