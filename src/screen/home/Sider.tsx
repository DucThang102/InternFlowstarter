import { Form, Select } from "antd";
import { generation, heroClass, sex, star } from ".";
import ButtonUpload from "../../components/button_upload";
import useSider from "./hook/useSider";
const { Option } = Select;

type SiderProps = {
    createHero: (data: any) => Promise<void>;
    account: string;
};

const Sider = ({ createHero, account }: SiderProps) => {
    const {
        avatar,
        beforeUpload,
        createIPFS,
        onFinish,
        setValiAvatar,
        valiAvatar,
    } = useSider(createHero);

    return (
        <div className="_sider flex flex-col pt-10 px-5 relative">
            <Form onFinish={onFinish}>
                <p>Avatar</p>
                <ButtonUpload
                    onChange={createIPFS}
                    beforeUpload={beforeUpload}
                />
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
