import { ethers } from "ethers";
import abi from "../HeroFi.json";

function useContract(signer) {
  const CONTRACT_ADDRESS = "0x7575c71C24091954d219d59E3513b59f8F8a552f";
  return new ethers.Contract(CONTRACT_ADDRESS, abi.abi, signer);
}

export default useContract;
