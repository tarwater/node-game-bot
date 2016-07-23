var bot = require('./server.js').Bot;
var channel = require('./server.js').channel;


//event listeners
bot.addListener('message' + channel, function(from, text){

	listenForDick(from, text);

}); 

bot.addListener('pm', function (from, message) {

	bot.say(from, "I'm a bot. Ask bugg about me.");
});


bot.addListener('error', function(message) {
	console.log('error: ', message);
});

//end event listeners

//Listener functions for channel messages

function listenForDick(from, text){
	if(text.indexOf("dick") !== -1){
		bot.say(channel, "show us your dick, " + from);
	}
}
