fs = require('fs');
const BOT = require('./server.js').bot;
const CHANNEL = require('./server.js').channel;

var players = {};
var gameInProgress;
var answer;
var timer;
var alreadyAnswered;

//Permanent event listeners
BOT.addListener('message' + CHANNEL, function(from, text) {

  triviaStart(from, text);
  triviaEnd(from, text);
  scoreReport(from, text);
});

BOT.addListener('pm', function(from, message) {

  BOT.say(from, "I'm a BOT. Ask bugg about me.");
});

BOT.addListener('error', function(message) {
  console.log('error: ', message);
});

//end event listeners

function triviaStart(from, text) {
  if (text.indexOf("!trivia") !== -1 && !gameInProgress) {

    BOT.say(CHANNEL,
      "If you would like to join the trivia game, please type '!join'");
    BOT.say(CHANNEL, "After all players are ready, type !start");

    BOT.addListener('message' + CHANNEL, playerJoin);
    BOT.addListener('message' + CHANNEL, startGame);

  }
}

function playerJoin(from, text) {

  if (text.indexOf("!join") !== -1) {
    BOT.say(CHANNEL, from + " has joined the game.");
    players[from] = 0;
    BOT.say(CHANNEL, "Current players: " + Object.keys(players));
  }
}

function startGame(from, text) {

  if (text.indexOf("!start") !== -1 && !gameInProgress) {

    if (Object.keys(players).length > 0) {
      gameInProgress = true;

      BOT.say(CHANNEL, "Commencing game with players: " + Object.keys(players));
      newQuestion();
    } else {
      BOT.say(CHANNEL, "There are no players! Type !join to join the game.");
    }
  }
}

function newQuestion() {

  var secondsPassed = 0;

  fs.readFile('./game_files/questions.txt', 'utf8', function(err, data) {
    if (err) {
      return console.log(err);
    }

    var lines = data.split('\n');
    var randLine = lines[Math.floor(Math.random() * lines.length)].split(
      '`');
    var question = randLine[0];
    answer = randLine[1];
    BOT.say(CHANNEL, question);
    alreadyAnswered = false;
    BOT.addListener('message' + CHANNEL, tempAnsListen);
  });

  timer = setInterval(waitForAnswer, 1000);

  function waitForAnswer() {

    secondsPassed += 1;

    if (secondsPassed > 30) {
      clearInterval(timer);
      BOT.say(CHANNEL, "Time's up! The answer was: " + answer);

      newQuestion();
    }
  }
}

function tempAnsListen(from, text) {

  answer = answer.toLowerCase();
  text = text.toLowerCase();

  if (text.indexOf(answer) !== -1 && from !== "BOTt" && !alreadyAnswered) {
    alreadyAnswered = true;
    BOT.say(CHANNEL, answer + " is correct! " + from + " gets a point.");

    if (players.hasOwnProperty(from)) { //is this player in the game?
      players[from] += 1;
    } else { //if not,
      players[from] = 1; //add them
      BOT.say(CHANNEL, from + " has joined the game.");
    }

    BOT.removeListener('message' + CHANNEL, tempAnsListen);
    clearInterval(timer);
    newQuestion();
  }
}

function triviaEnd(from, text) {
  if (gameInProgress && text.indexOf("!stop") !== -1) {
    BOT.say(CHANNEL, "Ending trivia game.");
    gameInProgress = false;
    clearInterval(timer);
    BOT.removeListener('message' + CHANNEL, tempAnsListen);
  }
}

function scoreReport(from, text) {
  if (text.indexOf("!score") !== -1) {
    BOT.say(CHANNEL, 'The current scores are: ');

    for (player in players) {
      BOT.say(CHANNEL, player + ": " + players[player]);
    }
  }
}
