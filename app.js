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

let config;

db.init(function() {
});

config = JSON.parse(fs.readFileSync('config.json', 'utf8'));
console.log(config);

serv.listen(443);
console.log('Listening on port 443!');

/*
Session:

Username,
Session ID - xxxUSERNAMExxx,
Permission Level 0(Guest) 1(Registered User), 2(Team Member/Employee) 3(Support Team), 4, 5, etc.
Workcenter (none if not employee)

pKey:

md5(xxxxxRANKxxxxx) - Check whenever verifying a users rank.
 */

function Session(uName, sID, pLevel, wC) {
    this.username = uName;
    this.sessionID = sID;
    this.permissionLevel = pLevel;
    this.workcenter = wC;
}

function PermissionKey(uName, key, pLevel) {
    this.username = uName;
    this.key = key;
    this.pLevel = pLevel;
}

var ActiveSessions = [];
var PermissionKeys = [];

var io = require('socket.io')(serv,{});
io.sockets.on('connection', function(socket) {
    socket.emit('pack', {s_name:config.settings.siteName, s_url:config.settings.siteURL,
        st_enabled:config.settings.storeEnabled, st_theme:config.settings.siteTheme});
    socket.on('s_check', function(data) {
        let verified = false;
        ActiveSessions.forEach(function(obj) {
            if (obj.sessionID === data.id) {
                verified = true;
            }
        });
        if (verified)
            socket.emit('s_check_r', {status:true});
        else
            socket.emit('s_check_r', {status:false});
    });
    socket.on('register', function(data) {
    });
});

setInterval(function() {
    db.heartbeat();
},1430000);