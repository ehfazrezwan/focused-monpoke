const assert = require("assert");
// Library for capturing stdout
const stdout = require("test-console").stdout;
// Library for mocking stdin
const stdin = require("mock-stdin").stdin();

const Monpoke = require("../src/index");

describe("player starts the game", () => {
  it("should display welcome message", () => {
    const expected = `Welcome to Monpoke, a turn based battle system - where two teams face off against each other with their respective Monpoke! The games rules are as below: \n* The game consists of 2 teams, each team has a variable number of Monpoké. \n* Each Monpoké has 2 attributes, HitPoints (HP) and Attack Power (AP). \n* The 2 teams engage in a simple turn-based battle. \n* A team’s turn can be either choosing a Monpoké OR attacking with their currently \nchosen Monpoké. \n* Attacking Monpoké depletes the enemy Monpoké HP for the value of their AP. \n* A Monpoké is defeated when its HP is less than or equal to 0. \n* The game ends when all of a team’s Monpoké have been defeated. \nTo play the game, you have the following commands available to you: \n* CREATE <team-id> <monpoké-id> <hp> <attack> -> to create a team \n* ICHOOSEYOU <monpoké-id> -> to select current Monpoke \n* ATTACK -> attack opponent using your selected Monpoke \nGood luck!\n`;
    const result = stdout.inspectSync(() => {
      Monpoke.welcome();
    });

    assert.strictEqual(result[0], expected);
  });

  it("should allow user to input commands", () => {
    const userCommand = "CREATE green pikachu 5 6";

    Monpoke.sendCommand();
    stdin.send(userCommand);

    const gameOutput = stdout.inspectSync(() => {
      stdin.end();
    });
    const result = gameOutput.join("");
    assert.notStrictEqual(result, "");
  });
});

describe("player enters commands", () => {
  it("should throw error upon invalid command keyword", () => {
    const userCommand = "CREATE team red";

    assert.throws(() => {
      Monpoke.sendCommand();
      stdin.send(userCommand);
      stdin.end();
    }, SyntaxError);
  });
});
