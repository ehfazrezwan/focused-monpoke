const validateTeamCreationDataTypes = (teamName, monpokeID, hp, ap) => {
  if (typeof teamName !== "string") {
    throw new TypeError("The first argument, team name, needs to be a string");
  }

  if (typeof monpokeID !== "string") {
    throw new TypeError("The second argument, monpokeID, needs to be a string");
  }

  if (typeof hp !== "number") {
    throw new TypeError("The third argument, hp, needs to be a number");
  }

  if (typeof ap !== "number") {
    throw new TypeError("The fourth argument, ap, needs to be a number");
  }

  return true;
};

module.exports = validateTeamCreationDataTypes;
