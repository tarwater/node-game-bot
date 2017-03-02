fs = require('fs');
var bot = require('./server.js').Bot;
var channel = require('./server.js').channel;

var players = {};
var gameInProgress = false;
var answer;
var timer;
var answeredCorrectly;

//Permanent event listeners
bot.addListener('message' + channel, function (from, text) {

    triviaStart(from, text);
    triviaEnd(from, text);
    scoreReport(from, text);
});

bot.addListener('pm', function (from, message) {

    bot.say(from, "I'm a bot. Ask bugg about me.");
});

bot.addListener('error', function (message) {
    console.log('error: ', message);
});

//end event listeners

function triviaStart(from, text) {
    if (text.indexOf("!trivia") !== -1 && !gameInProgress) {

        bot.say(channel, "If you would like to join the trivia game, please type '!join'");
        bot.say(channel, "After all players are ready, type !start");

        bot.addListener('message' + channel, playerJoin);
        bot.addListener('message' + channel, startGame);

    }
}

function playerJoin(from, text) {

    if (text.indexOf("!join") !== -1) {
        bot.say(channel, from + " has joined the game.");
        players[from] = 0;
        bot.say(channel, "Current players: " + Object.keys(players));
    }
}

function startGame(from, text) {

    if (text.indexOf("!start") !== -1 && !gameInProgress) {

        if(Object.keys(players).length > 0) {
            gameInProgress = true;

            bot.say(channel, "Commencing game with players: " + Object.keys(players));
            newQuestion();
        } else {
            bot.say(channel, "There are no players! Type !join to join the game.");
        }
    }
}

function newQuestion(){



    if(!questionInProgress) {
        var secondsPassed = 0;

        fs.readFile('./game_files/questions.txt', 'utf8', function (err, data) {
            if (err) {
                return console.log(err);
            }


            var lines = data.split('\n');
            var randLine = lines[Math.floor(Math.random() * lines.length)].split('`');
            var question = randLine[0];
            answer = randLine[1];
            bot.say(channel, question);
            answeredCorrectly = false;
            bot.addListener('message' + channel, tempAnsListen);


        });

        timer = setInterval(waitForAnswer, 1000);

        function waitForAnswer() {

            secondsPassed += 1;

            if (secondsPassed > 30) {
                clearInterval(timer);e;
                bot.say(channel, "Time's up! The answer was: " + answer);
                newQuestion();
            }
        }
    }
}

function tempAnsListen(from, text) {

    console.log("tempansOUTER");

    answer = answer.toLowerCase();
    text = text.toLowerCase();

    if (text.indexOf(answer) !== -1 && from !== "bott" && !answeredCorrectly) {
        answeredCorrectly = true;
        bot.say(channel, answer + " is correct! " + from + " gets a point.");

        players[from] += 1;

        bot.removeListener('message' + channel, tempAnsListen);
        clearInterval(timer);
        newQuestion();
    }
}

function triviaEnd(from, text) {
    if(text.indexOf("!stop") !== -1){
        bot.say(channel, "Ending trivia game.");
        gameInProgress = false;
        clearInterval(timer);
        bot.removeListener('message' + channel, tempAnsListen);
    }
}

function scoreReport(from, text){
    if(text.indexOf("!score") !== -1){
        bot.say(channel, 'The current scores are: ');

        for(player in players){
            bot.say(channel, player + ": " + players[player]);
        }
    }
}






