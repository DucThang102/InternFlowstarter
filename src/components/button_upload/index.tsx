import { useState } from "react";
import "./style.scss";

type ButtonUploadprops = {
    className?: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};
function getBase64(file: any) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });
}
const ButtonUpload = (props: ButtonUploadprops) => {
    const [image, setImage] = useState("");
    const { onChange, className } = props;
    const onChangeinput = async (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(e);
        const files: any = e.target.files;
        const baseCode = await getBase64(files[0]);
        setImage(baseCode as string);
    };
    return (
        <label
            className={"_label-btn-upload" + (className ? ` ${className}` : "")}
        >
            <input className="w-full" onChange={onChangeinput} type="file" />
            {image ? (
                <div className="img">
                    <img src={image} alt="Upload" />
                </div>
            ) : (
                <div className="btn-upload">
                    <p>+</p>
                    <p>Upload</p>
                </div>
            )}
        </label>
    );
};
export default ButtonUpload;
