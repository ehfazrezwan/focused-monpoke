const prompt = require("prompt");
const Monpoke = {};

// Welcome message to players
Monpoke.welcome = () => {
  const welcomeMsg = `Welcome to Monpoke, a turn based battle system - where two teams face off against each other with their respective Monpoke! The games rules are as below: \n* The game consists of 2 teams, each team has a variable number of Monpoké. \n* Each Monpoké has 2 attributes, HitPoints (HP) and Attack Power (AP). \n* The 2 teams engage in a simple turn-based battle. \n* A team’s turn can be either choosing a Monpoké OR attacking with their currently \nchosen Monpoké. \n* Attacking Monpoké depletes the enemy Monpoké HP for the value of their AP. \n* A Monpoké is defeated when its HP is less than or equal to 0. \n* The game ends when all of a team’s Monpoké have been defeated. \nTo play the game, you have the following commands available to you: \n* CREATE <team-id> <monpoké-id> <hp> <attack> -> to create a team \n* ICHOOSEYOU <monpoké-id> -> to select current Monpoke \n* ATTACK -> attack opponent using your selected Monpoke \nGood luck!`;

  console.log(welcomeMsg);
};

// Function to allow user to send command to game
Monpoke.sendCommand = () => {
  prompt.message = "";
  prompt.delimiter = "";

  prompt.start();

  prompt.get(["COMMAND"], (err, result) => {
    const userCommand = result.COMMAND.split(" ");

    switch (userCommand[0]) {
      case "CREATE":
        console.log("Team creation");
        break;
      case "ICHOOSEYOU":
        console.log("Monpoke chosen");
        break;
      case "ATTACK":
        console.log("Attacking opponent");
        break;
      default:
        throw new SyntaxError();
        break;
    }
  });
};

Monpoke.sendCommand();

module.exports = Monpoke;
