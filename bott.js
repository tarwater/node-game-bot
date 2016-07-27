fs = require('fs'); 
var bot = require('./server.js').Bot;
var channel = require('./server.js').channel;

var players = [];
var gameInProgress = false;

//Permanent event listeners
bot.addListener('message' + channel, function(from, text){

	listenForDick(from, text);
	triviaStartUp(from, text);

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

function triviaStartUp(from, text){
	if(text.indexOf("!trivia") !== -1 && !gameInProgress){ 

		bot.say(channel, "If you would like to join the trivia game, please type '!join'");
  	bot.say(channel, "After all players are ready, type !start");

  	bot.addListener('message' + channel, playerJoin);
  	bot.addListener('message' + channel, startGame);


//move this readFile
/*
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
			
		}); */
	} 
}

function playerJoin(from, text){

	if(text.indexOf("!join") !== -1){
		bot.say(channel, from + " has joined the game.");
		players.push(from);
		bot.say(channel, "Current players: " + players);
	}
}

function startGame(from, text){

	if(text.indexOf("!start") !== -1 && !gameInProgress){

		gameInProgress = true;

		bot.say(channel, "Commencing game with players: " + players);
	}
}


function tempAnsListen(from, text){
  if(text.toLowerCase() == answer){
  	bot.say(channel, answer + " is correct!");
  	bot.removeListener('message' + channel, tempAnsListen);
  }
}