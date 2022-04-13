import { Select } from "antd";
import { generation, heroClass, star, sex } from ".";
import { create as ipfsHttpClient } from "ipfs-http-client";
import React, { useState } from "react";
import { CreateHero } from "../../api/ethers/repo/HeroFi";
import configs from "../../config/const";
const client = ipfsHttpClient({ url: configs.IPFS_URL });
const { Option } = Select;

type SiderProps = {
    createHero: (data: any) => Promise<void>;
};

const Sider = ({ createHero }: SiderProps) => {
    const [file, setFile] = useState<any>(null);
    const [generationValue, setGenerationValue] = useState<number>();
    const [classValue, setClassValue] = useState<number>();
    const [starValue, setStarValue] = useState<number>();
    const [sexValue, setSexValue] = useState<number>();

    const createIPFS = async () => {
        if (file) {
            const added = await client.add(file[0]);
            return `${configs.IPFS_BASE}/${added.path}`;
        }
    };

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const avatar = await createIPFS();
        console.log({
            avatar,
            generationValue,
            classValue,
            starValue,
            sexValue,
        });

        // if (avatar && generationValue && classValue && starValue && sexValue) {
        createHero(
            new CreateHero(
                avatar,
                classValue,
                sexValue,
                generationValue,
                starValue
            )
        );
        // }
    };
    return (
        <div className="_sider flex flex-col pt-10 px-5">
            <form onSubmit={onSubmit} className="w-full overflow-hidden">
                <label>
                    Avatar
                    <input
                        className="w-full"
                        onChange={(e) => setFile(e.target.files)}
                        type="file"
                    />
                </label>
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
                <div className="mt-5">
                    <button type="submit">Create Hero</button>
                </div>
            </form>
        </div>
    );
};
export default Sider;
