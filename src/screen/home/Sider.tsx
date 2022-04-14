import { Select } from "antd";
import { generation, heroClass, star, sex } from ".";
import { create as ipfsHttpClient } from "ipfs-http-client";
import React, { useState } from "react";
import { CreateHero } from "../../api/ethers/repo/HeroFi";
import configs from "../../config/const";
import notify from "../../components/notify";
import ButtonUpload from "../../components/button_upload";
const client = ipfsHttpClient({ url: configs.IPFS_URL });
const { Option } = Select;

type SiderProps = {
    createHero: (data: any) => Promise<void>;
    account: string;
};

const Sider = ({ createHero, account }: SiderProps) => {
    const [file, setFile] = useState<any>(null);
    const [generationValue, setGenerationValue] = useState<number>();
    const [classValue, setClassValue] = useState<number>();
    const [starValue, setStarValue] = useState<number>();
    const [sexValue, setSexValue] = useState<number>();
    const [uploading, setUploading] = useState(false);

    const createIPFS = async () => {
        try {
            setUploading(true);
            const added = await client.add(file[0]);
            return `${configs.IPFS_BASE}/${added.path}`;
        } catch {
            notify.error("Upload file không thành công");
        } finally {
            setUploading(false);
        }
    };

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (
            file &&
            typeof generationValue !== "undefined" &&
            typeof classValue !== "undefined" &&
            typeof starValue !== "undefined" &&
            typeof sexValue !== "undefined"
        ) {
            const avatar = await createIPFS();
            if (!avatar) return;
            createHero(
                new CreateHero(
                    avatar,
                    classValue,
                    sexValue,
                    generationValue,
                    starValue
                )
            );
        } else {
            notify.error("Không được để trống dữ liệu");
        }
    };
    return (
        <div className="_sider flex flex-col pt-10 px-5 relative">
            <form onSubmit={onSubmit} className="w-full overflow-hidden">
                <p>Avatar</p>
                {/* <label>
                    <input
                        className="w-full"
                        onChange={(e) => setFile(e.target.files)}
                        type="file"
                    />
                </label> */}
                <ButtonUpload onChange={(e) => setFile(e.target.files)} />
                <label htmlFor="class">Class</label>
                <Select
                    onChange={(value) => setClassValue(value)}
                    id="class"
                    placeholder="Class"
                    className="w-full"
                >
                    {heroClass.map((c, i) => (
                        <Option value={c.value} key={i}>
                            {c.label}
                        </Option>
                    ))}
                </Select>
                <label htmlFor="sex">Sex</label>
                <Select
                    onChange={(value) => setSexValue(value)}
                    id="sex"
                    placeholder="Sex"
                    className="w-full"
                >
                    {sex.map((c, i) => (
                        <Option value={c.value} key={i}>
                            {c.label}
                        </Option>
                    ))}
                </Select>
                <label htmlFor="generation">Generation</label>
                <Select
                    onChange={(value) => setGenerationValue(value)}
                    id="generation"
                    placeholder="Seneration"
                    className="w-full"
                >
                    {generation.map((c, i) => (
                        <Option value={c.value} key={i}>
                            {c.label}
                        </Option>
                    ))}
                </Select>
                <label htmlFor="star">Star</label>
                <Select
                    onChange={(value) => setStarValue(value)}
                    id="star"
                    placeholder="Star"
                    className="w-full"
                >
                    {star.map((c, i) => (
                        <Option value={c.value} key={i}>
                            {c.label}
                        </Option>
                    ))}
                </Select>
                {account && (
                    <div className="mt-5">
                        <button>Create Hero</button>
                    </div>
                )}
            </form>
            {uploading && <div className="_uploading">Uploading image</div>}
        </div>
    );
};
export default Sider;
