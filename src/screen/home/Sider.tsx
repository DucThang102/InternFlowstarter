import { Select, Form } from "antd";
import { generation, heroClass, star, sex } from ".";
import { create as ipfsHttpClient } from "ipfs-http-client";
import React, { useState } from "react";
import { CreateHero } from "../../api/ethers/repo/HeroFi";
import configs from "../../config/const";
// import notify from "../../components/notify";
import ButtonUpload from "../../components/button_upload";
import { IPFSError } from "../../utils/errorContract";
const client = ipfsHttpClient({ url: configs.IPFS_URL });
const { Option } = Select;

type SiderProps = {
    createHero: (data: any) => Promise<void>;
    account: string;
};

const Sider = ({ createHero, account }: SiderProps) => {
    const [avatar, setAvatar] = useState("");
    const [valiAvatar, setValiAvatar] = useState(false);

    const createIPFS = async (file: any) => {
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
    return (
        <div className="_sider flex flex-col pt-10 px-5 relative">
            <Form onFinish={onFinish}>
                <p>Avatar</p>
                <ButtonUpload onChange={createIPFS} />
                <div className="h-7 text-red-500">
                    {valiAvatar && "Avatar không được để trống"}
                </div>
                <label htmlFor="class">Class</label>
                <Form.Item
                    name="class"
                    rules={[
                        {
                            required: true,
                            message: "Class không được để trống",
                        },
                    ]}
                >
                    <Select id="class" placeholder="Class" className="w-full">
                        {heroClass.map((c, i) => (
                            <Option value={c.value} key={i}>
                                {c.label}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>{" "}
                <label htmlFor="sex">Sex</label>
                <Form.Item
                    name="sex"
                    rules={[
                        {
                            required: true,
                            message: "Giới tính không được để trống",
                        },
                    ]}
                >
                    <Select id="sex" placeholder="Sex" className="w-full">
                        {sex.map((c, i) => (
                            <Option value={c.value} key={i}>
                                {c.label}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>{" "}
                <label htmlFor="generation">Generation</label>
                <Form.Item
                    name="generation"
                    rules={[
                        {
                            required: true,
                            message: "Generation không được để trống",
                        },
                    ]}
                >
                    <Select
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
                </Form.Item>
                <label htmlFor="star">Star</label>
                <Form.Item
                    name="star"
                    rules={[
                        { required: true, message: "Star không được để trống" },
                    ]}
                >
                    <Select id="star" placeholder="Star" className="w-full">
                        {star.map((c, i) => (
                            <Option value={c.value} key={i}>
                                {c.label}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>
                {account && (
                    <div className="mt-5">
                        <button onClick={() => setValiAvatar(!avatar)}>
                            Create Hero
                        </button>
                    </div>
                )}
            </Form>
        </div>
    );
};
export default Sider;
