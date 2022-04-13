import { BigNumber } from "ethers";

export const big2Number = (balance?: BigNumber, decimals = 18, toFixed = 9) => {
    if (!balance) return 0;
    const div = BigNumber.from((10 ** decimals).toString());
    const start = balance.div(div).toString();
    const end = balance.mod(div).toString();
    let strings = "";
    for (let i = decimals - end.length; i > 0; i--) strings += "0";
    return parseFloat(parseFloat(start + "." + strings + end).toFixed(toFixed));
};

// export const big2NumberString = (balance?: BigNumber, decimals = 18) => {
//     if (!balance) return "0";
//     const sValue = ethers.utils.formatUnits(balance).replace(".", "");
//     console.log(sValue);

//     const start = sValue.slice(0, sValue.length - decimals);
//     console.log("s", start);

//     const end = sValue.slice(sValue.length - decimals);
//     return end ? start + "." + end : start;
// };
