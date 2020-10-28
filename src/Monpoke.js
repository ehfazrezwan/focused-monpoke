const prompt = require("prompt-async");
const validateTeamCreationDataTypes = require("../utils/validator");

const Monpoke = {};

Monpoke.teams = [];
Monpoke.currentTeam = [];
Monpoke.started = false;
Monpoke.playerTurn = 0;
Monpoke.winner = -1;

Monpoke.executor = "cli";

// Welcome message to players
Monpoke.welcome = () => {
  const welcomeMsg = `Welcome to Monpoke, a turn based battle system - where two teams face off against each other with their respective Monpoke! The games rules are as below: \n* The game consists of 2 teams, each team has a variable number of Monpoké. \n* Each Monpoké has 2 attributes, HitPoints (HP) and Attack Power (AP). \n* The 2 teams engage in a simple turn-based battle. \n* A team’s turn can be either choosing a Monpoké OR attacking with their currently \nchosen Monpoké. \n* Attacking Monpoké depletes the enemy Monpoké HP for the value of their AP. \n* A Monpoké is defeated when its HP is less than or equal to 0. \n* The game ends when all of a team’s Monpoké have been defeated. \nTo play the game, you have the following commands available to you: \n* CREATE <team-id> <monpoké-id> <hp> <attack> -> to create a team \n* ICHOOSEYOU <monpoké-id> -> to select current Monpoke \n* ATTACK -> attack opponent using your selected Monpoke \nGood luck!`;

  return welcomeMsg;
};

Monpoke.commandFromFile = (path) => {
  const lineReader = require("readline").createInterface({
    input: require("fs").createReadStream(path),
  });

  lineReader.on("line", function (line) {
    const userCommand = line.split(" ");
    Monpoke.commandHandler(userCommand);
  });
};

Monpoke.commandHandler = (userCommand) => {
  switch (userCommand[0]) {
    case "CREATE":
      const createTeam = Monpoke.createTeam(
        userCommand[1],
        userCommand[2],
        parseInt(userCommand[3]),
        parseInt(userCommand[4])
      );
      console.log(createTeam);
      return createTeam;
    case "ICHOOSEYOU":
      const chooseMonpoke = Monpoke.chooseMonpoke(userCommand[1]);
      console.log(chooseMonpoke);
      return chooseMonpoke;
    case "ATTACK":
      const attackMonpoke = Monpoke.attack();
      console.log(attackMonpoke);
      return attackMonpoke;
    default:
      process.exitCode = 1;
      if (Monpoke.executor === "executor") {
        return "Error: SyntaxError";
      }
      throw new SyntaxError();
  }
};

// Function to allow user to send command to game
Monpoke.sendCommand = async () => {
  if (Monpoke.winner !== -1) {
    process.exit(1);
  }

  prompt.message = "";
  prompt.delimiter = "";
  prompt.description = "";

  prompt.start();

  const { COMMAND } = await prompt.get(["COMMAND"]);
  // prompt.stop();
  const userCommand = COMMAND.split(" ");

  return Monpoke.commandHandler(userCommand);
};

// Function to create team
Monpoke.createTeam = (teamName, monpokeID, hp, ap) => {
  if (Monpoke.started) {
    if (Monpoke.executor === "server") {
      return "Error: Cannot run CREATE team after game has started!";
    }
    process.exitCode = 1;
    throw new Error("Cannot run CREATE team after game has started!");
  }

  if (hp < 1) {
    if (Monpoke.executor === "server") {
      return "Error: Monpoke must have HP of 1 or higher!";
    }

    process.exitCode = 1;
    throw new RangeError("Monpoke must have HP of 1 or higher");
  }

  if (ap < 1) {
    if (Monpoke.executor === "server") {
      return "Error: Monpoke must have AP of 1 or higher!";
    }

    process.exitCode = 1;
    throw new RangeError("Monpoke must have AP of 1 or higher");
  }

  if (validateTeamCreationDataTypes(teamName, monpokeID, hp, ap)) {
    const newMonpoke = {
      monpokeID: monpokeID,
      hp: hp,
      ap: ap,
    };

    const team = {};

    if (!Monpoke.teams.length) {
      team.name = teamName;
      team.monpoke = [newMonpoke];

      Monpoke.teams.push(team);
      Monpoke.initCurrentTeam(teamName);

      return `${monpokeID} has been assigned to team ${teamName}`;
    } else if (Monpoke.teams.length < 2) {
      for (teamMember of Monpoke.teams) {
        if (teamMember.name === teamName) {
          for (monpokeMember of teamMember.monpoke) {
            if (monpokeMember.monpokeID === monpokeID) {
              if (Monpoke.executor === "server") {
                return "Error: Monpoke already assigned to team!";
              }
              process.exitCode = 1;
              throw new Error("Monpoke already assigned to team!");
            }
          }
          teamMember.monpoke.push(newMonpoke);
          return `${monpokeID} has been assigned to team ${teamName}`;
        }
      }

      team.name = teamName;
      team.monpoke = [newMonpoke];
      Monpoke.teams.push(team);
      Monpoke.initCurrentTeam(teamName);
      return `${monpokeID} has been assigned to team ${teamName}`;
    }

    let partOfTeam = false;

    if (Monpoke.teams.length === 2) {
      for (teamMember of Monpoke.teams) {
        if (teamMember.name === teamName) {
          for (monpokeMember of teamMember.monpoke) {
            if (monpokeMember.monpokeID === monpokeID) {
              if (Monpoke.executor === "server") {
                return "Error: Monpoke already assigned to team!";
              }

              process.exitCode = 1;
              throw new Error("Monpoke already assigned to team!");
            }
          }
          partOfTeam = true;
          teamMember.monpoke.push(newMonpoke);
          return `${monpokeID} has been assigned to team ${teamName}`;
        } else {
          partOfTeam = false;
        }
      }

      if (partOfTeam) {
        team.name = teamName;
        team.monpoke = [newMonpoke];
        Monpoke.teams.push(team);
        Monpoke.initCurrentTeam(teamName);
        return `${monpokeID} has been assigned to team ${teamName}`;
      } else {
        return "Cannot have more than 2 teams";
      }
    }
  }
};

// Function to initialize current team object
Monpoke.initCurrentTeam = (teamName) => {
  const team = {
    name: teamName,
    monpoke: {},
  };

  Monpoke.currentTeam.push(team);
};

// Function to choose Monpoke
Monpoke.chooseMonpoke = (monpokeID) => {
  if (Monpoke.currentTeam.length < 2) {
    if (Monpoke.executor === "server") {
      return "Error: Total number of teams has to be 2!";
    }

    process.exitCode = 1;
    throw new Error("Total number of teams has to be 2!");
  }

  let monpokeStats,
    found = false;

  const team = Monpoke.teams[Monpoke.playerTurn];
  for (monpoke of team.monpoke) {
    // console.log(monpoke);
    if (monpoke.monpokeID === monpokeID) {
      monpokeStats = monpoke;
      found = true;
    }
  }
  if (!found) {
    if (Monpoke.executor === "server") {
      return "Error: Monpoke does not exist on your team!";
    }

    process.exitCode = 1;
    throw new Error("Monpoke does not exist on your team!");
  }

  Monpoke.currentTeam[Monpoke.playerTurn].monpoke = monpokeStats;

  Monpoke.started = true;

  //   Iterating through currentTeam to check if Monpoke has been chosen
  for (teamMember of Monpoke.currentTeam) {
    if (Object.keys(teamMember.monpoke).length < 1) {
      Monpoke.started = false;
    }
  }

  //   Switching player turn
  Monpoke.playerTurn = Monpoke.playerTurn === 0 ? 1 : 0;

  return `${monpokeStats.monpokeID} has entered the battle!`;
};

// Function to attack monpoke
Monpoke.attack = () => {
  if (!Monpoke.started) {
    if (Monpoke.executor === "server") {
      return "Error: You have to choose a Monpoke before attacking!";
    }

    process.exitCode = 1;
    throw new Error("You have to choose a Monpoke before attacking!");
  }

  let msg = "";
  const currentHP = Monpoke.currentTeam[Monpoke.playerTurn].monpoke.hp;
  const currentMonpoke =
    Monpoke.currentTeam[Monpoke.playerTurn].monpoke.monpokeID;

  if (currentHP < 1) {
    msg += `${currentMonpoke} has been defeated! Please choose new Monpoke`;
    return msg;
  }

  const attackerAP = Monpoke.currentTeam[Monpoke.playerTurn].monpoke.ap;
  const opponentIndex = Monpoke.playerTurn === 0 ? 1 : 0;
  const opponentMonpoke = Monpoke.currentTeam[opponentIndex].monpoke.monpokeID;
  //   Reducing opponent's HP
  Monpoke.currentTeam[opponentIndex].monpoke.hp -= attackerAP;

  for (monpokeMember of Monpoke.teams[opponentIndex].monpoke) {
    if (monpokeMember.name === opponentMonpoke) {
      monpokeMember.hp -= attackerAP;
    }
  }
  //   Monpoke.teams[opponentIndex].monpoke.hp -= attackerAP;
  msg += `${currentMonpoke} attacked ${opponentMonpoke} for ${attackerAP} damage!`;
  if (Monpoke.currentTeam[opponentIndex].monpoke.hp < 1) {
    msg += `\n${opponentMonpoke} has been defeated!`;
  }

  const defeated = isDefeated();

  if (defeated !== -1) {
    msg += `\n${
      Monpoke.currentTeam[defeated === 0 ? 1 : 0].name
    } is the winner!\n`;
    Monpoke.winner = defeated === 0 ? 1 : 1;
  }

  // Switching player turn
  Monpoke.playerTurn = opponentIndex;

  return msg;
};

// Function to check if Monpoke are defeated
const isDefeated = () => {
  let monpokeCount = [0, 0];
  let defeatedCount = [0, 0];

  for (let i = 0; i < Monpoke.teams.length; i++) {
    for (j = 0; j < Monpoke.teams[i].monpoke.length; j++) {
      monpokeCount[i]++;
      if (Monpoke.teams[i].monpoke[j].hp < 1) {
        defeatedCount[i]++;
      }
    }
  }

  if (monpokeCount[0] === defeatedCount[0]) {
    return 0;
  } else if (monpokeCount[1] === defeatedCount[1]) {
    return 1;
  } else {
    return -1;
  }
};

module.exports = Monpoke;
