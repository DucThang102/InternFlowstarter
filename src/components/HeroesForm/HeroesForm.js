import { useState } from "react";
import './HeroesForm.css';

import { create } from "ipfs-http-client";

import { errToast } from '../../utils/ToastMessage';
import { sex, generation, heroClass, star } from "../../constants";

export default function HeroesForm ({createHero, disabled}) {
    const [dataInput, setDataInput] = useState({
        avatar: "",
        heroClass: "0",
        sex: "0",
        generation: "0",
        star: "0"
    });

    /* Create ipfs Image */
    const client = create("https://ipfs.infura.io:5001/api/v0");

    const onChangeImage = async(e) => {
        const file = e.target.files[0];
        const {size, type} = file;
        /* Check size */
        if (size > 100000) {
            errToast('Kich thuoc anh khong duoc qua 1MB. Vui long thu lai !');
        }
        else {
            /* Check type */
            if (type !== 'image/jpeg' && type !== 'image/png') {
                errToast('Dinh dang anh khong hop le. Vui long thu lai !');
            }
            else {
                try {
                    const added = await client.add(file);
                    const url = `https://ipfs.infura.io/ipfs/${added.path}`;
                    setDataInput({
                        ...dataInput,
                        avatar: url,
                    });
                } catch (error) {
                    errToast(`Loi upload: ${error} !`);
                }
            }
        }
    }

    return (
        <form className="form">
            <div className="form-group">
                <label htmlFor="avatar">Avatar:</label>
                <input type="file" id="avatar" onChange={(e) => {
                    onChangeImage(e);
                }} />
            </div>
            <div className="form-group">
                <label htmlFor="class">Class:</label>
                <select id="class" onChange={(e) => setDataInput({ ...dataInput, heroClass: e.target.value })}>
                    {heroClass.map((item, index) => {
                        return (
                            <option key={index} value={item.value}>
                                {item.label}
                            </option>
                        );
                    })}
                </select>
            </div>
            <div className="form-group">
                <label htmlFor="sex">Sex:</label>
                <select id="sex" onChange={(e) => setDataInput({ ...dataInput, sex: e.target.value })}>
                    {sex.map((item, index) => {
                        return (
                            <option key={index} value={item.value}>
                                {item.label}
                            </option>
                        );
                    })}
                </select>
            </div>
            <div className="form-group">
                <label htmlFor="generation">Generation:</label>
                <select id="generation" onChange={(e) => setDataInput({ ...dataInput, generation: e.target.value })}>
                    {generation.map((item, index) => {
                        return (
                            <option key={index} value={item.value}>
                                {item.label}
                            </option>
                        );
                    })}
                </select>
            </div>
            <div className="form-group">
                <label htmlFor="star">Star:</label>
                <select id="star" onChange={(e) => setDataInput({ ...dataInput, star: e.target.value })}>
                    {star.map((item, index) => {
                        return (
                            <option key={index} value={item.value}>
                                {item.label}
                            </option>
                        );
                    })}
                </select>
            </div>
            <button type="submit" className="btn btn--createheroes" onClick={(e) => createHero(e, dataInput)} disabled={disabled}>Create Hero</button>
        </form>
    );
}