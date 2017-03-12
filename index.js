var express = require('express');
var server = express();

var port = process.env.PORT || 8000;

// Return a JSON of data
server.get('/whoami', function(req,res) {
    // Get the user browser information
    var ua = req.headers['user-agent'],
    software = {};

    if (/mobile/i.test(ua))
        software.Mobile = true;

    if (/like Mac OS X/.test(ua)) {
        software.iOS = /CPU( iPhone)? OS ([0-9\._]+) like Mac OS X/.exec(ua)[2].replace(/_/g, '.');
        software.iPhone = /iPhone/.test(ua);
        software.iPad = /iPad/.test(ua);
    }

    if (/Android/.test(ua))
        software.Android = /Android ([0-9\.]+)[\);]/.exec(ua)[1];

    if (/webOS\//.test(ua))
        software.webOS = /webOS\/([0-9\.]+)[\);]/.exec(ua)[1];

    if (/(Intel|PPC) Mac OS X/.test(ua))
        software.Mac = /(Intel|PPC) Mac OS X ?([0-9\._]*)[\)\;]/.exec(ua)[2].replace(/_/g, '.') || true;

    if (/Windows NT/.test(ua))
        software.Windows = /Windows NT ([0-9\._]+)[\);]/.exec(ua)[1];
        
    // Package it up
    var userInfo = {
        'ipAddress': req.connection.remoteAddress,
        'language': req.headers["accept-language"].split(',')[0],
        'software': software
    };

    res.send(userInfo);
});

// Listen on the provided port
server.listen(port, function () {
    console.log('Listening on port ' + port)
});
