import { useState } from "react";
import notify from "../../../components/notify";
import utils from "../../../utils";
import { create as ipfsHttpClient } from "ipfs-http-client";
import { IPFSError } from "../../../utils/errorContract";
import configs from "../../../config/const";
import { CreateHero } from "../../../api/ethers/repo/HeroFi";

const client = ipfsHttpClient({ url: configs.IPFS_URL });

const useSider = (createHero: (data: any) => Promise<void>) => {
    const [avatar, setAvatar] = useState("");
    const [valiAvatar, setValiAvatar] = useState(false);
    const beforeUpload = (file: any) => {
        if (!utils.validateImageUpload(file)) {
            notify.error("Chỉ cho phép upload file JPG và PNG");
            return false;
        }
        if (!utils.validateImageSize(file)) {
            notify.error("Dung lượng file quá lớn");
            return false;
        }
        return true;
    };

    const createIPFS = async (file: any) => {
        if (typeof file === "undefined") {
            setAvatar("");
            setValiAvatar(true);
            return true;
        }
        try {
            const added = await client.add(file);
            const str = `${configs.IPFS_BASE}/${added.path}`;
            setAvatar(str);
            setValiAvatar(!str);
            return true;
        } catch (e) {
            IPFSError(e);
            return false;
        }
    };

    const onFinish = (values: {
        class: number;
        generation: number;
        sex: number;
        star: number;
    }) => {
        if (avatar) {
            createHero(
                new CreateHero(
                    avatar,
                    values.class,
                    values.sex,
                    values.generation,
                    values.star
                )
            );
        }
    };
    return {
        avatar,
        valiAvatar,
        setValiAvatar,
        createIPFS,
        onFinish,
        beforeUpload,
    };
};
export default useSider;
