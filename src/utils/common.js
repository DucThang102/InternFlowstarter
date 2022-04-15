export const getLabels = (label) => {
  const labels = {
    Class: ["WATER", "PLANT", "FIRE", "THUNDER", "DARK", "LIGHT"],
    Sex: ["Male", "Female"],
    Generation: ["GENESIS", "NORMAL"],
    Star: ["ONE", "TWO", "THREE", "FOUR", "FIVE", "SIX"],
  };

  return labels[label] || [];
};
