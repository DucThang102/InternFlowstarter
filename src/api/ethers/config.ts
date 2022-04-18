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
    const net_version = await ethereum.request({ method: "net_version" });
    if (parseInt(net_version) !== configs.PROVIDER_NETWORK) {
        throw new Error(
            `You can change network to ${configs.BLOCKCHAIN_NETWORK}`
        );
    }
    // const web3Modal = new Web3Modal();
    // const connection = await web3Modal.connect();
    // const provider = new ethers.providers.Web3Provider(connection);
    // const signer = provider.getSigner();
    const contract = new ethers.Contract(address, abi, signer);
    return contract;
};

const initRPC = (address: string, abi: AbiType) => {
    const provider = new ethers.providers.JsonRpcProvider(
        configs.PROVIDER_URL,
        configs.PROVIDER_NETWORK
    );
    const ct = new ethers.Contract(address, abi, provider);
    return ct;
};

export const HeroFiCT = async (signer: ethers.providers.JsonRpcSigner) => {
    return await init(configs.HEROES_ADDRESS, HEROFI.abi, signer);
};

export const HeroFiCT_RPC = () => {
    return initRPC(configs.HEROES_ADDRESS, HEROFI.abi);
};
