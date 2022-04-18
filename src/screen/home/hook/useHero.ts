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
    const [heroeShow, setHeroesShow] = useState<Heroes[]>([]);
    const [filter, setFilter] = useState<"all-heroes" | "my-heroes">(
        "all-heroes"
    );
    const [showTransfer, setShowTransfer] = useState(false);
    const [itemTransfer, setItemTransfer] = useState<Heroes>();

    const [pagination, setPagination] = useState({
        page: 1,
        limit: 8,
    });

    useEffect(() => {
        const start = (pagination.page - 1) * pagination.limit;
        const end = pagination.page * pagination.limit;

        setHeroesShow(heroes.slice(start, end));
    }, [heroes, pagination]);
    const getAllHeroes = useCallback(async () => {
        if (filter === "all-heroes") {
            try {
                setLoading("Loading...");
                const res = await API.ethers.herofi.getAllHeroes();
                setHeroes(res);
            } catch (e) {
                errorContract(e);
            } finally {
                setLoading("");
            }
        }
    }, [filter]);

    const getHeroesOfAccount = useCallback(async () => {
        if (filter === "my-heroes") {
            if (signer) {
                try {
                    setLoading("Loading...");
                    const res = await API.ethers.herofi.getHeroesOfAccount(
                        signer
                    );
                    setHeroes(res);
                } catch (e) {
                    errorContract(e);
                } finally {
                    setLoading("");
                }
            } else {
                setHeroes([]);
            }
        }
    }, [filter, signer]);

    useEffect(() => {
        getAllHeroes();
    }, [getAllHeroes]);

    useEffect(() => {
        getHeroesOfAccount();
    }, [getHeroesOfAccount]);

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
                            setPagination((p) => {
                                return {
                                    ...p,
                                    page: 1,
                                };
                            });
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
                        const res = await API.ethers.herofi.getHeroesOfAccount(
                            signer
                        );
                        setHeroes(res);

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
        [itemTransfer, signer]
    );

    return {
        heroeShow,
        heroes,
        setFilter,
        createHero,
        loading,
        filter,
        setItemTransfer,
        showTransfer,
        setShowTransfer,
        transfer,
        setPagination,
        pagination,
    };
};
export default useHero;
