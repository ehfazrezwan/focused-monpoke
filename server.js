const express = require("express");
const { DEFAULT_MIN_VERSION } = require("tls");
const app = express();
const server = require("http").Server(app);

let Monpoke = require("./src/Monpoke");

Monpoke.executor = "server";

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.json());

app.get("/", (req, res) => {
  res.render("index");
});

app.post("/create", (req, res) => {
  const { teamName, monpokeID, hp, ap } = req.body;
  const monpokeData = req.body.Monpoke;

  Monpoke.teams = monpokeData.teams;
  Monpoke.currentTeam = monpokeData.currentTeam;
  Monpoke.started = monpokeData.started;
  Monpoke.playerTurn = monpokeData.playerTurn;
  Monpoke.winner = monpokeData.winner;

  const msg = Monpoke.createTeam(teamName, monpokeID, hp, ap);

  const response = {
    msg: msg,
    Monpoke: {
      teams: Monpoke.teams,
      currentTeam: Monpoke.currentTeam,
      started: Monpoke.started,
      playerTurn: Monpoke.playerTurn,
      winner: Monpoke.winner,
    },
  };
  res.status(200).send(JSON.stringify(response));
});

app.post("/choose", (req, res) => {
  const { monpokeID } = req.body;
  const monpokeData = req.body.Monpoke;

  Monpoke.teams = monpokeData.teams;
  Monpoke.currentTeam = monpokeData.currentTeam;
  Monpoke.started = monpokeData.started;
  Monpoke.playerTurn = monpokeData.playerTurn;
  Monpoke.winner = monpokeData.winner;

  const msg = Monpoke.chooseMonpoke(monpokeID);

  const response = {
    msg: msg,
    Monpoke: {
      teams: Monpoke.teams,
      currentTeam: Monpoke.currentTeam,
      started: Monpoke.started,
      playerTurn: Monpoke.playerTurn,
      winner: Monpoke.winner,
    },
  };
  res.status(200).send(JSON.stringify(response));
});

app.post("/attack", (req, res) => {
  const monpokeData = req.body.Monpoke;

  Monpoke.teams = monpokeData.teams;
  Monpoke.currentTeam = monpokeData.currentTeam;
  Monpoke.started = monpokeData.started;
  Monpoke.playerTurn = monpokeData.playerTurn;
  Monpoke.winner = monpokeData.winner;

  const msg = Monpoke.attack();

  console.log(msg);

  const response = {
    msg: msg,
    Monpoke: {
      teams: Monpoke.teams,
      currentTeam: Monpoke.currentTeam,
      started: Monpoke.started,
      playerTurn: Monpoke.playerTurn,
      winner: Monpoke.winner,
    },
  };

  res.status(200).send(JSON.stringify(response));
});

server.listen(9000);
