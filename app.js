const express = require('express');
const app = express();
const helmet = require('helmet');
const db = require('./server/database.js');
const fs = require('fs');
const net = require('net');
const bcrypt = require('bcrypt');
const md5 = require('md5');
const sanitizer = require('sanitizer');

'use strict';
var rootCas = require('ssl-root-cas/latest').create();

// default for all https requests
// (whether using https directly, request, or another module)
require('https').globalAgent.options.ca = rootCas;

app.use(helmet());

var options = {
    key : fs.readFileSync('privkey.pem', 'ascii'),
    cert : fs.readFileSync('fullchain.pem', 'ascii')
};

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/public/index.html');
});
//app.use('/public', express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/public', {
    extensions: ['html']
}));

var serv = require('https').createServer(options, app);
//var serv = require('http').Server(app); //DEBUG ONLY

//http redirect
var http = require('http');
http.createServer(function (req, res) {
    res.writeHead(301, { "Location": "https://" + req.headers['host'] + req.url });
    res.end();
}).listen(80);

db.init();

serv.listen(443);
console.log('Listening on port 443!');