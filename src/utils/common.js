export const getLabels = (label) => {
  const labels = {
    Class: ["WATER", "PLANT", "FIRE", "THUNDER", "DARK", "LIGHT"],
    Sex: ["Male", "Female"],
    Generation: ["GENESIS", "NORMAL"],
    Star: ["ONE", "TWO", "THREE", "FOUR", "FIVE", "SIX"],
  };

  return labels[label] || [];
};

export const generateErrMsg = (errMsg) => {
  const errors = {
    "code=UNPREDICTABLE_GAS_LIMIT": "You have not permission",
    "code=INVALID_ARGUMENT": "Receiver id invalid",
  };

  for (const errCode in errors) {
    if (errMsg.includes(errCode)) return errors[errCode];
  }

  return "Something went wrong";
};
