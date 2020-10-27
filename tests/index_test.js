const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");

chai.use(chaiAsPromised);

const assert = chai.assert;
const expect = chai.expect;

const Monpoke = require("../src/index");

describe("player starts the game", () => {
  it("should display welcome message", () => {
    const expected = `Welcome to Monpoke, a turn based battle system - where two teams face off against each other with their respective Monpoke! The games rules are as below: \n* The game consists of 2 teams, each team has a variable number of Monpoké. \n* Each Monpoké has 2 attributes, HitPoints (HP) and Attack Power (AP). \n* The 2 teams engage in a simple turn-based battle. \n* A team’s turn can be either choosing a Monpoké OR attacking with their currently \nchosen Monpoké. \n* Attacking Monpoké depletes the enemy Monpoké HP for the value of their AP. \n* A Monpoké is defeated when its HP is less than or equal to 0. \n* The game ends when all of a team’s Monpoké have been defeated. \nTo play the game, you have the following commands available to you: \n* CREATE <team-id> <monpoké-id> <hp> <attack> -> to create a team \n* ICHOOSEYOU <monpoké-id> -> to select current Monpoke \n* ATTACK -> attack opponent using your selected Monpoke \nGood luck!`;

    const result = Monpoke.welcome();

    assert.strictEqual(result, expected);
  });

  it("should allow user to input commands", async () => {
    // Library for mocking stdin
    const stdin = require("mock-stdin").stdin();

    const userCommand = "CREATE green pikachu 5 6";

    process.nextTick(() => {
      stdin.send(`${userCommand}\r`);
    });

    const result = await Monpoke.sendCommand();
    assert.strictEqual(result, "Team creation");
  });
});

describe("player enters commands", () => {
  let stdin;
  beforeEach(() => {
    // Library for mocking stdin
    stdin = require("mock-stdin").stdin();
  });

  it("should throw error upon invalid command keyword", async () => {
    const userCommand = "DELETE green pikachu 5 6";

    process.nextTick(() => {
      stdin.send(`${userCommand}\r`);
    });

    expect(Monpoke.sendCommand()).to.eventually.be.rejectedWith(SyntaxError);
  });

  describe("player runs CREATE command", () => {
    beforeEach(() => {
      Monpoke.teams = [];
    });

    it("should create team with passed arguments", () => {
      const expected = {
        name: "red",
        monpoke: [
          {
            monpokeID: "reekachu",
            hp: 5,
            ap: 2,
          },
        ],
      };

      Monpoke.createTeam("red", "reekachu", 5, 2);
      const result = Monpoke.teams;

      assert.deepNestedInclude(result, expected);
    });

    it("should create team with passed arguments", () => {
      const expected = {
        name: "blue",
        monpoke: [
          {
            monpokeID: "smorelax",
            hp: 5,
            ap: 2,
          },
        ],
      };

      Monpoke.createTeam("blue", "smorelax", 5, 2);
      const result = Monpoke.teams;

      assert.deepNestedInclude(result, expected);
    });

    it("should throw TypeError when passed invalid arguments", () => {
      assert.throws(
        () => {
          Monpoke.createTeam(5, "reekachu", 5, 6);
        },
        TypeError,
        "The first argument, team name, needs to be a string"
      );
    });

    it("should throw TypeError when passed invalid arguments", () => {
      assert.throws(
        () => {
          Monpoke.createTeam("red", "reekachu", 5, "HP of 6");
        },
        TypeError,
        "The fourth argument, ap, needs to be a number"
      );
    });

    it("should not be able to create more than 2 teams", () => {
      const expectedNumTeams = 2;

      Monpoke.createTeam("red", "reekachu", 5, 2);
      Monpoke.createTeam("blue", "smorelax", 5, 3);
      Monpoke.createTeam("green", "watermillion", 5, 6);

      const result = Monpoke.teams.length;

      assert.isAtMost(result, expectedNumTeams);
    });
  });
});
