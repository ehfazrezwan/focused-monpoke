const Monpoke = require("./Monpoke");
console.log(Monpoke.welcome());

if (process.argv.length > 2) {
  const inputFile = process.argv.slice(2)[0];
  Monpoke.commandFromFile(inputFile);
} else {
  const run = async () => {
    try {
      while (Monpoke.winner === -1) {
        await Monpoke.sendCommand();
      }
    } catch (e) {
      console.log(e);
    }
  };
  run();
}
