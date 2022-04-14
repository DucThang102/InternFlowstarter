import { useCallback, useEffect, useState } from "react";
import errorContract from "../../../utils/errorContract";
import Web3Modal from "web3modal";
import { ethers } from "ethers";

const useAccount = () => {
    const [signer, setSigner] = useState<ethers.providers.JsonRpcSigner>();

    const [account, setAccount] = useState("");
    const getSigner = useCallback(async () => {
        try {
            const ethereum = window.ethereum;
            if (!ethereum) {
                throw new Error("Please install MetaMask!");
            }
            const web3Modal = new Web3Modal();
            const connection = await web3Modal.connect();
            const provider = new ethers.providers.Web3Provider(connection);
            const signer = provider.getSigner();
            setSigner(signer);
        } catch (e) {
            errorContract(e);
        }
    }, []);

    useEffect(() => {
        window.ethereum?.on("accountsChanged", function (accounts: any) {
            if (account) getSigner();
        });
    }, [account, getSigner]);

    const getAccount = useCallback(async () => {
        try {
            if (signer) {
                const addr = await signer.getAddress();
                setAccount(addr);
            }
        } catch (e) {
            errorContract(e);
        }
    }, [signer]);

    useEffect(() => {
        getAccount();
    }, [getAccount]);
    return { account, signer, getSigner };
};
export default useAccount;
