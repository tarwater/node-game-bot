fs = require('fs'); 
var bot = require('./server.js').Bot;
var channel = require('./server.js').channel;


//Permanent event listeners
bot.addListener('message' + channel, function(from, text){

	listenForDick(from, text);
	getQuestion(from, text);

}); 

bot.addListener('pm', function (from, message) {

	bot.say(from, "I'm a bot. Ask bugg about me.");
});


bot.addListener('error', function(message) {
	console.log('error: ', message);
});

//end event listeners

function listenForDick(from, text){
	if(text.indexOf("dick") !== -1){
		bot.say(channel, "show us your dick, " + from);
	}
}

function getQuestion(from, text){
	if(text.indexOf("!q") !== -1){ 

		fs.readFile('./game_files/questions.txt', 'utf8', function (err,data) {
  		if (err) {
    		return console.log(err);
  		}
  
  	var lines = data.split('\n');
  	var randLine = lines[Math.floor(Math.random()*lines.length)].split('`');
  	var question = randLine[0];
  	var answer = randLine[1];

  	bot.say(channel, question);

  	bot.addListener('message' + channel, tempAnsListen);


  	function tempAnsListen(from, text){
  		if(text.toLowerCase() == answer){
  			bot.say(channel, answer + " is correct!");
  			bot.removeListener('message' + channel, tempAnsListen);
  		}
  	}
  	


		});
	}
}