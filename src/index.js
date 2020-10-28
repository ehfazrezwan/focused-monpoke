const Monpoke = require("./Monpoke");

console.log(Monpoke.welcome());

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
