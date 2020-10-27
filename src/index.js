const prompt = require("prompt-async");
const validateTeamCreationDataTypes = require("../utils/validator");

const Monpoke = {};

Monpoke.teams = [];

// Welcome message to players
Monpoke.welcome = () => {
  const welcomeMsg = `Welcome to Monpoke, a turn based battle system - where two teams face off against each other with their respective Monpoke! The games rules are as below: \n* The game consists of 2 teams, each team has a variable number of Monpoké. \n* Each Monpoké has 2 attributes, HitPoints (HP) and Attack Power (AP). \n* The 2 teams engage in a simple turn-based battle. \n* A team’s turn can be either choosing a Monpoké OR attacking with their currently \nchosen Monpoké. \n* Attacking Monpoké depletes the enemy Monpoké HP for the value of their AP. \n* A Monpoké is defeated when its HP is less than or equal to 0. \n* The game ends when all of a team’s Monpoké have been defeated. \nTo play the game, you have the following commands available to you: \n* CREATE <team-id> <monpoké-id> <hp> <attack> -> to create a team \n* ICHOOSEYOU <monpoké-id> -> to select current Monpoke \n* ATTACK -> attack opponent using your selected Monpoke \nGood luck!`;

  return welcomeMsg;
};

// Function to allow user to send command to game
Monpoke.sendCommand = async () => {
  prompt.message = "";
  prompt.delimiter = "";

  prompt.start();

  const { COMMAND } = await prompt.get(["COMMAND"]);
  prompt.stop();
  const userCommand = COMMAND.split(" ");

  switch (userCommand[0]) {
    case "CREATE":
      return "Team creation";
    case "ICHOOSEYOU":
      return "Monpoke chosen";
    case "ATTACK":
      return "Attacking opponent";
    default:
      throw new SyntaxError();
  }
};

Monpoke.createTeam = (teamName, monpokeID, hp, ap) => {
  if (validateTeamCreationDataTypes(teamName, monpokeID, hp, ap)) {
    const team = {
      name: teamName,
      monpoke: [
        {
          monpokeID: monpokeID,
          hp: hp,
          ap: ap,
        },
      ],
    };

    if (Monpoke.teams.length < 2) {
      Monpoke.teams.push(team);
    }

    return team;
  }
};

module.exports = Monpoke;
