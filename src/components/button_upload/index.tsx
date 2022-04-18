import { useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import "./style.scss";
type ButtonUploadprops = {
    className?: string;
    onChange: (file: any) => Promise<boolean>;
    beforeUpload?: (file: any) => boolean;
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
    const [uploading, setUploading] = useState(false);

    const { onChange, className, beforeUpload } = props;

    const onChangeinput = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files: any = e.target.files;
        if (typeof beforeUpload !== "undefined" && !beforeUpload(files[0]))
            return;

        setUploading(true);
        const change = await onChange(files[0]);
        if (change) {
            const baseCode = await getBase64(files[0]);
            setImage(baseCode as string);
        }
        setUploading(false);
    };

    const clear = () => {
        onChange(undefined);
        setImage("");
    };
    return (
        <div className={"_btn-upload" + (className ? ` ${className}` : "")}>
            <label className="_label-btn-upload">
                <input
                    className="w-full"
                    onChange={onChangeinput}
                    type="file"
                />
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
            {image && (
                <div onClick={clear} className="_clear">
                    x
                </div>
            )}
            {uploading && (
                <div className="_loading">
                    <AiOutlineLoading3Quarters />
                </div>
            )}
        </div>
    );
};
export default ButtonUpload;
