import { useState } from "react";
import utils from "../../utils";
import "./style.scss";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import notify from "../notify";
type ButtonUploadprops = {
    className?: string;
    onChange: (file: any) => Promise<boolean>;
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

    const { onChange, className } = props;

    const onChangeinput = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files: any = e.target.files;
        console.log(files[0]);
        if (!utils.validateImageUpload(files[0])) {
            notify.error("Chỉ cho phép upload file JPG và PNG");
            return;
        }
        if (!utils.validateImageSize(files[0])) {
            notify.error("Dung lượng file quá lớn");
            return;
        }
        setUploading(true);

        const change = await onChange(files[0]);
        if (change) {
            const baseCode = await getBase64(files[0]);
            setImage(baseCode as string);
        }
        setUploading(false);
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
            {uploading && (
                <div className="_loading">
                    <AiOutlineLoading3Quarters />
                </div>
            )}
        </div>
    );
};
export default ButtonUpload;
