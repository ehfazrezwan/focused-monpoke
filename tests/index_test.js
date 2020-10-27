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
      Monpoke.currentTeam = [];
    });

    it("should create team with passed arguments - red team", () => {
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

    it("should create team with passed arguments - blue team", () => {
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

    it("should throw TypeError when passed invalid arguments - 1st arg wrong", () => {
      assert.throws(
        () => {
          Monpoke.createTeam(5, "reekachu", 5, 6);
        },
        TypeError,
        "The first argument, team name, needs to be a string"
      );
    });

    it("should throw TypeError when passed invalid arguments - 4th arg wrong", () => {
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
      Monpoke.createTeam("orange", "watermillion", 5, 6);

      const result = Monpoke.teams.length;

      assert.isAtMost(result, expectedNumTeams);
    });

    it("should add monpoke to team", () => {
      const expected = {
        name: "blue",
        monpoke: [
          {
            monpokeID: "smorelax",
            hp: 5,
            ap: 2,
          },
          {
            monpokeID: "reekachu",
            hp: 3,
            ap: 6,
          },
          {
            monpokeID: "watermillion",
            hp: 4,
            ap: 7,
          },
        ],
      };

      Monpoke.createTeam("blue", "smorelax", 5, 2);
      Monpoke.createTeam("blue", "reekachu", 3, 6);
      Monpoke.createTeam("blue", "watermillion", 4, 7);

      assert.deepNestedInclude(Monpoke.teams, expected);
    });

    it("should handle multiple teams and monpokes", () => {
      const expectedTeam1 = {
        name: "blue",
        monpoke: [
          {
            monpokeID: "smorelax",
            hp: 5,
            ap: 2,
          },
          {
            monpokeID: "reekachu",
            hp: 3,
            ap: 6,
          },
          {
            monpokeID: "watermillion",
            hp: 4,
            ap: 7,
          },
        ],
      };

      const expectedTeam2 = {
        name: "red",
        monpoke: [
          {
            monpokeID: "reekachu",
            hp: 3,
            ap: 6,
          },
        ],
      };

      Monpoke.createTeam("blue", "smorelax", 5, 2);
      Monpoke.createTeam("blue", "reekachu", 3, 6);
      Monpoke.createTeam("blue", "watermillion", 4, 7);
      Monpoke.createTeam("red", "reekachu", 3, 6);

      assert.deepNestedInclude(Monpoke.teams, expectedTeam1);
      assert.deepNestedInclude(Monpoke.teams, expectedTeam2);
    });

    it("should throw exception when assigning same monpoke to team", () => {
      Monpoke.createTeam("night", "smorelax", 3, 6);
      Monpoke.createTeam("night", "reekachu", 5, 6);

      assert.throws(
        () => {
          Monpoke.createTeam("night", "reekachu", 5, 6);
        },
        Error,
        "Monpoke already assigned to team!"
      );
    });

    it("should initialize currentTeam object", () => {
      const expected = [
        {
          name: "red",
          monpoke: {},
        },
        {
          name: "blue",
          monpoke: {},
        },
      ];

      Monpoke.createTeam("red", "pikachu", 10, 6);
      Monpoke.createTeam("blue", "smorelax", 10, 6);

      assert.deepEqual(Monpoke.currentTeam, expected);
    });

    it('should throw error ')
  });

  describe("player runs ICHOOSEYOU command", () => {
    beforeEach(() => {
      Monpoke.teams = [];
      Monpoke.currentTeam = [];
    });

    it("should throw error if total number of teams is not 2", () => {
      assert.throws(
        () => {
          Monpoke.chooseMonpoke();
        },
        Error,
        "Total number of teams has to be 2!"
      );
    });

    it("should populate current team with chosen monpoke", () => {
      const expected = {
        name: "red",
        monpoke: {
          monpokeID: "reekachu",
          hp: 7,
          ap: 5,
        },
      };

      Monpoke.createTeam("red", "reekachu", 7, 5);
      Monpoke.createTeam("red", "bulbee", 7, 6);
      Monpoke.createTeam("blue", "smorelax", 10, 3);

      Monpoke.chooseMonpoke("red", "reekachu");

      assert.deepNestedInclude(Monpoke.currentTeam, expected);
    });

    it("should populate current team with chosen monpoke for both teams", () => {
      const expected = [
        {
          name: "red",
          monpoke: {
            monpokeID: "reekachu",
            hp: 7,
            ap: 5,
          },
        },
        {
          name: "blue",
          monpoke: {
            monpokeID: "smorelax",
            hp: 10,
            ap: 3,
          },
        },
      ];

      Monpoke.createTeam("red", "reekachu", 7, 5);
      Monpoke.createTeam("red", "bulbee", 7, 6);
      Monpoke.createTeam("blue", "smorelax", 10, 3);

      Monpoke.chooseMonpoke("red", "reekachu");
      Monpoke.chooseMonpoke("blue", "smorelax");

      assert.deepStrictEqual(Monpoke.currentTeam, expected);
    });

    it('should throw error when choosing non-existent monpoke', () => {
      Monpoke.createTeam("red", "reekachu", 7, 5);
      Monpoke.createTeam("red", "bulbee", 7, 6);
      Monpoke.createTeam("blue", "smorelax", 10, 3);

      assert.throws(() => {
        Monpoke.chooseMonpoke("blue", "reekachu")
      }, Error, 'Monpoke does not exist on your team!')
    })

  });
});
