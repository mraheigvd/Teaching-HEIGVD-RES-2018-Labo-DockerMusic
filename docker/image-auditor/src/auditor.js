var dgram = require("dgram");
var socket = dgram.createSocket("udp4");
var net = require("net");
var protocol = require("./protocol");
var moment = require("moment");

// When a musician join the multicast group
socket.bind(protocol.PORT, function() {
    console.log("Joining multicast group");
    socket.addMembership(protocol.MULTICAST_IP);
});

// When the server receive a data from a musician
socket.on('message', function(msg, source) {
    console.log("Data from a Musician has arrived: " + msg + ". Source port: " + source.port);

    var musician = JSON.parse(msg);

    // Look if a musician is already there by his uuid
    for (var i = 0; i < musicians.length; i++) {
        if (musician.uuid == musicians[i].uuid) {
            musicians[i].activeSince = musician.activeSince; // refresh the time remaining
            return;
        }
    }
    musicians.push(musician);
});

// when there is a telnet connection
var tcpServer = net.createServer();
tcpServer.on('connection', function (socket) {
    for (var i = 0; i < musicians.length; i++) {
        // check if a musician/instrument is still active
        if (moment().diff(musicians[i].activeSince) > protocol.DELAY) {
            console.log('Mucisian removed : ' + JSON.stringify(musicians[i]));
            musicians.splice(i, 1);
        }
    }
    socket.write(JSON.stringify(musicians));
    socket.end();
});

// array to save the actives musicians
var musicians = [];
tcpServer.listen(protocol.PORT);
console.log("TCP Server now running on port : " + protocol.PORT);