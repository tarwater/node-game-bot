var irc = require('irc');

var botNick = 'bott';
var server = 'irc.dextroverse.org';
var channel = '#buggbot';

exports.Bot = new irc.Client(server, botNick, {
	channels: ["#buggbot"],
});

exports.channel = channel;






