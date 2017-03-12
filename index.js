"use strict";

// Import our needed packages & create the express server
var express = require('express');
let favicon = require('serve-favicon');
var server = express();

// Serve our Favicon
server.use(favicon(__dirname + '/public/favicon.ico'));

// Middleware to allow cross origin requests
server.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // Wildcard allows all domains
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// Gives us access to the public foder
server.use(express.static(__dirname + '/public'));

// Route provides an intro page at the root of the project
server.get('/', function(req, res) {
    res.sendFile('index.html', function(err){
        if(err) {
            console.log(err.status);
        }
    });
});

function getUserBrowser(userAgent) {
    var software = {};

    if (/mobile/i.test(userAgent))
        software.Mobile = true;

    if (/like Mac OS X/.test(userAgent)) {
        software.iOS = /CPU( iPhone)? OS ([0-9\._]+) like Mac OS X/.exec(userAgent)[2].replace(/_/g, '.');
        software.iPhone = /iPhone/.test(userAgent);
        software.iPad = /iPad/.test(userAgent);
    }

    if (/Android/.test(userAgent))
        software.Android = /Android ([0-9\.]+)[\);]/.exec(userAgent)[1];

    if (/webOS\//.test(userAgent))
        software.webOS = /webOS\/([0-9\.]+)[\);]/.exec(userAgent)[1];

    if (/(Intel|PPC) Mac OS X/.test(userAgent))
        software.Mac = /(Intel|PPC) Mac OS X ?([0-9\._]*)[\)\;]/.exec(userAgent)[2].replace(/_/g, '.') || true;

    if (/Windows NT/.test(userAgent))
        software.Windows = /Windows NT ([0-9\._]+)[\);]/.exec(userAgent)[1];

    return software
}

// Route returns a JSON of the requesters data
server.get('/api/whoami', function(req,res) {
    // Get the user browser information
    var software = getUserBrowser(req.headers['user-agent'])
    // Package it up
    var userInfo = {
        'ipAddress': req.ip,
        'language': req.headers["accept-language"].split(',')[0],
        'software': software
    };

    // Create the response object
    res.set('Content-Type', 'application/json');
    res.send(userInfo);
});


// Listen on the provided port
var port = process.env.PORT || 8000;
server.listen(port, function () {
    console.log('Listening on port ' + port)
});
