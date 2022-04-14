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
        <form onSubmit={onSubmit} className="p-5 flex flex-col">
            <input
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="Nhập địa chỉ ví"
            />
            <div className="mt-5 flex justify-end">
                <button
                    type="submit"
                    className="bg-green-500 text-red-600 border border-solid border-gray-400"
                >
                    Transfer
                </button>
                <button
                    type="button"
                    className="bg-white text-red-600 ml-3 border border-solid border-gray-400"
                >
                    Cancel
                </button>
            </div>
        </form>
    );
};
export default Form;
