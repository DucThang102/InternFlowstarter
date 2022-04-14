import { useCallback, useEffect, useState } from "react";
import API from "../../../api";
import errorContract from "../../../utils/errorContract";
import { CreateHero, Heroes } from "../../../api/ethers/repo/HeroFi";
import { ethers } from "ethers";
import notify from "../../../components/notify";

const useHero = (signer: ethers.providers.JsonRpcSigner | undefined) => {
    const [loading, setLoading] = useState<
        "" | "Loading..." | "Creating..." | "Transferring..."
    >("");
    const [heroes, setHeroes] = useState<Heroes[]>([]);
    const [filter, setFilter] = useState<"all-heroes" | "my-heroes">(
        "all-heroes"
    );
    const [showTransfer, setShowTransfer] = useState(false);
    const [itemTransfer, setItemTransfer] = useState<Heroes>();
    const getAllHeroes = useCallback(async () => {
        try {
            if (signer) {
                setLoading("Loading...");
                if (filter === "all-heroes") {
                    const res = await API.ethers.herofi.getAllHeroes(signer);
                    setHeroes(res);
                } else {
                    const res = await API.ethers.herofi.getHeroesOfAccount(
                        signer
                    );
                    setHeroes(res);
                }
            }
        } catch (e) {
            errorContract(e);
        } finally {
            setLoading("");
        }
    }, [filter, signer]);

    useEffect(() => {
        getAllHeroes();
    }, [getAllHeroes]);

    const createHero = useCallback(
        async (data: CreateHero) => {
            try {
                if (signer) {
                    setLoading("Creating...");

                    const res = await API.ethers.herofi.createHero(
                        signer,
                        data
                    );
                    const tx = await res.wait();
                    if (tx.status === 1) {
                        if (filter === "my-heroes") {
                            const res =
                                await API.ethers.herofi.getHeroesOfAccount(
                                    signer
                                );
                            setHeroes(res);
                        } else {
                            setFilter("my-heroes");
                        }

                        notify.success("Tạo mới hero thành công");
                    } else {
                        notify.error("đã có lỗi sảy ra");
                    }
                }
            } catch (e) {
                errorContract(e);
            } finally {
                setLoading("");
            }
        },
        [filter, signer]
    );

    const transfer = useCallback(
        async (toAccount: string) => {
            if (signer && itemTransfer) {
                try {
                    setLoading("Transferring...");

                    const res = await API.ethers.herofi.transferHero(
                        signer,
                        toAccount,
                        itemTransfer.id
                    );
                    const tx = await res.wait();
                    if (tx.status === 1) {
                        if (filter === "my-heroes") {
                            const res =
                                await API.ethers.herofi.getHeroesOfAccount(
                                    signer
                                );
                            setHeroes(res);
                        } else {
                            setFilter("my-heroes");
                        }

                        notify.success("Transfer hero thành công");
                    } else {
                        notify.error("Đã có lỗi sảy ra");
                    }
                } catch (e) {
                    errorContract(e);
                } finally {
                    setShowTransfer(false);
                    setLoading("");
                }
            }
        },
        [filter, itemTransfer, signer]
    );

    return {
        heroes,
        setFilter,
        createHero,
        loading,
        filter,
        setItemTransfer,
        showTransfer,
        setShowTransfer,
        transfer,
    };
};
export default useHero;
