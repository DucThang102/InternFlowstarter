import { useState } from "react";

type FormProps = {
    transfer: (toAccount: string) => Promise<void>;
};

const Form = ({ transfer }: FormProps) => {
    const [value, setValue] = useState("");
    const onSubmit = async (e: React.FocusEvent<HTMLFormElement>) => {
        e.preventDefault();
        await transfer(value);
        setValue("");
    };
    return (
        <form onSubmit={onSubmit} className="p-10 flex flex-col">
            <h1 className="text-2xl mb-5">Địa chỉ </h1>
            <input
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="Nhập địa chỉ"
            />
            <div className="mt-5 ">
                <button className="bg-green-600 text-white">Transfer</button>
            </div>
        </form>
    );
};
export default Form;
