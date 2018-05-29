
var dgram = require('dgram');
const protocol = require("./protocol");

/*
 * Let's create a datagram socket. We will use it to listen for datagrams published in the
 * multicast group by thermometers and containing measures
 */
var s = dgram.createSocket('udp4');
s.bind(protocol.UDP_PORT, function() {
    console.log("Joining multicast group");
    s.addMembership(protocol.PROTOCOL_MULTICAST_ADDRESS);
});

s.on('message', function(msg, source) {
    console.log("Data has arrived: " + msg + ". Source port: " + source.port + " Source host: " + source.hostname);
});

