var irc = require('irc');

var botNick = 'bott';
var server = 'irc.dextroverse2.org';
var channel = '#shenanigans';

exports.Bot = new irc.Client(server, botNick, {
	channels: ["#shenanigans"]
});

exports.channel = channel;