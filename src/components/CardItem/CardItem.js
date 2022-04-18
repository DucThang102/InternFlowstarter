import './CardItem.css';
import { sex, generation, heroClass, star } from "../../constants";

export default function CardItem ({item, setTransferDataCb, setModalDataCb, setToggleCb, setToggle2Cb}) {
    return (
        <li className="container-item">
            <img src={item.avatar} alt='img' />
            <div className="container-item-data">
                <span>Class:
                    <span>{heroClass.find((item2) => item2.value === item.class).label}</span>
                </span>
                <span>Sex:
                    <span>{sex.find((item2) => item2.value === item.sex).label}</span>
                </span>
                <span>Generation:
                    <span>{generation.find((item2) => item2.value === item.generation).label}</span>
                </span>
                <span>Star:
                       <span>{star.find((item2) => item2.value === item.star).label}</span>
                </span>
            </div>
            <button onClick={() => {
                setToggle2Cb();
                setModalDataCb(item);
            }} className="btn btn--details">Details</button>
            <button onClick={() => {
                setToggleCb();
                setTransferDataCb(item);
            }} className="btn btn--infotransfer">Transfer</button>
        </li>
    );
}