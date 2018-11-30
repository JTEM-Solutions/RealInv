var mysql = require('mysql');
var bcrypt = require('bcrypt');
var sanitizer = require('sanitizer');
var fs = require('fs');

const saltRounds = 10;
var salt = bcrypt.genSaltSync(saltRounds);

if (!fs.existsSync('config.json')) {
    console.warn("FIRST TIME STARTUP DETECTED!");
    console.log("Generating config files...");
    let def = JSON.stringify({
        'db': {
            'host':"111.22.333.444",
            'user':"nonRootUser",
            'password':"aV3ry!Secure!Password1",
            'database':'TrueInv'
        },
        'settings': {
            'storeEnabled':true,
            'superuser':"YourUsername",
            'siteName':"TrueInv",
            'siteTheme':'default',
            'siteURL':'localhost'
        }
    });
    fs.writeFileSync('config.json', def, 'utf8', function(err) {
        if (err)
            console.error("ERROR> There was an error saving the configuration file.");
        console.log("Creating config.json");
    });
    console.log("Done!");
    console.log("Edit configuration files and restart app.js to continue.");
    process.exit();
}

let config = JSON.parse(fs.readFileSync('config.json', 'utf8'));

const con = mysql.createConnection({
    host: config.db.host,
    user: config.db.user,
    password: config.db.password,
    database: config.db.database
});

var init = function(callback) {
    con.connect(function(err){
        if(err){
            console.log('ERROR> Could not connect to database. Check the credentials in config.json');
            process.exit();
            return;
        }
        console.log('Connection established');
        //Create tables
        con.query("CREATE TABLE IF NOT EXISTS StaffAccounts (s_uname VARCHAR(56), s_email VARCHAR(72) UNIQUE," +
            " s_password VARCHAR(128), s_workcenter VARCHAR(56), s_permission INT DEFAULT 0) ENGINE=INNODB;", function(err, result) {
            if (err)
                console.log("Error on table create! TABLE: 1");
        });
        con.query("CREATE TABLE IF NOT EXISTS Workcenters (wc_name VARCHAR(56) NOT NULL, wc_desc VARCHAR(140) NOT NULL," +
            " wc_permission INT DEFAULT 0) ENGINE=INNODB;", function(err, result) {
            if (err)
                console.log("Error on table create! TABLE: 2");
        });
        con.query("CREATE TABLE IF NOT EXISTS Locations (l_name VARCHAR(56) NOT NULL, l_desc VARCHAR(140) NOT NULL," +
            " l_primary BOOLEAN DEFAULT 0) ENGINE=INNODB;", function(err, result) {
            if (err)
                console.log("Error on table create! TABLE: 2");
        });
    });
};

var heartbeat = function() {
    var final = con.query("SELECT username FROM Accounts WHERE password='m';", function (err, rows) {
    });
};

module.exports.init = init;
module.exports.heartbeat = heartbeat;