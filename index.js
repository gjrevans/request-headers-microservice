"use strict";

// Import our needed packages & create the express server
var express = require('express');
var server = express();

var port = process.env.PORT || 8000;

// Middleware to allow cross origin requests
server.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // Wildcard allows all domains
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
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
// Return a JSON of the requesters data
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
server.listen(port, function () {
    console.log('Listening on port ' + port)
});
