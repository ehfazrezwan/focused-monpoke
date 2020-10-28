let Monpoke = {};
Monpoke.teams = [];
Monpoke.currentTeam = [];
Monpoke.started = false;
Monpoke.playerTurn = 0;
Monpoke.winner = -1;

window.onload = () => {
  $("#terminal").terminal(
    {
      CREATE: function (teamName, monpokeID, hp, ap) {
        this.echo(createCommand(teamName, monpokeID, hp, ap).msg);
      },
      ICHOOSEYOU: function (monpokeID) {
        this.echo(chooseCommand(monpokeID).msg);
      },
      ATTACK: function () {
        this.echo(attackCommand().msg);
      },
    },
    {
      greetings: "Monpoke game",
    }
  );
};

const createCommand = (teamName, monpokeID, hp, ap) => {
  const data = {
    teamName: teamName,
    monpokeID: monpokeID,
    hp: hp,
    ap: ap,
    Monpoke: Monpoke,
  };

  const res = $.ajax({
    url: "/create",
    type: "POST",
    data: JSON.stringify(data),
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    async: false,
    success: function (msg) {
      let monpokeData = msg.Monpoke;

      Monpoke.teams = monpokeData.teams;
      Monpoke.currentTeam = monpokeData.currentTeam;
      Monpoke.started = monpokeData.started;
      Monpoke.playerTurn = monpokeData.playerTurn;
      Monpoke.winner = monpokeData.winner;

      return msg;
    },
  });

  return res.responseJSON;
};

const chooseCommand = (monpokeID) => {
  const data = {
    monpokeID: monpokeID,
    Monpoke: Monpoke,
  };

  const res = $.ajax({
    url: "/choose",
    type: "POST",
    data: JSON.stringify(data),
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    async: false,
    success: function (msg) {
      let monpokeData = msg.Monpoke;

      Monpoke.teams = monpokeData.teams;
      Monpoke.currentTeam = monpokeData.currentTeam;
      Monpoke.started = monpokeData.started;
      Monpoke.playerTurn = monpokeData.playerTurn;
      Monpoke.winner = monpokeData.winner;

      return msg;
    },
  });

  return res.responseJSON;
};

const attackCommand = () => {
  const data = {
    Monpoke: Monpoke,
  };

  const res = $.ajax({
    url: "/attack",
    type: "POST",
    contentType: "application/json; charset=utf-8",
    data: JSON.stringify(data),
    dataType: "json",
    async: false,
    success: function (msg) {
      let monpokeData = msg.Monpoke;

      Monpoke.teams = monpokeData.teams;
      Monpoke.currentTeam = monpokeData.currentTeam;
      Monpoke.started = monpokeData.started;
      Monpoke.playerTurn = monpokeData.playerTurn;
      Monpoke.winner = monpokeData.winner;

      return msg;
    },
  });

  return res.responseJSON;
};
