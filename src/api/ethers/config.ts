import HEROFI from "../../artifacts/HeroFi.json";
// import Web3Modal from "web3modal";
import { ethers } from "ethers";
import configs from "../../config/const";

type AbiType = typeof HEROFI.abi;

const init = async (
    address: string,
    abi: AbiType,
    signer: ethers.providers.JsonRpcSigner
) => {
    const ethereum = window.ethereum;
    if (!ethereum) {
        throw new Error("Please install MetaMask!");
    }
    // const web3Modal = new Web3Modal();
    // const connection = await web3Modal.connect();
    // const provider = new ethers.providers.Web3Provider(connection);
    // const signer = provider.getSigner();
    const contract = new ethers.Contract(address, abi, signer);
    return contract;
};

export const HeroFiCT = async (signer: ethers.providers.JsonRpcSigner) => {
    return await init(configs.HEROES_ADDRESS, HEROFI.abi, signer);
};
