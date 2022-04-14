import { Heroes } from "../../api/ethers/repo/HeroFi";
import Header from "./Header";
import useAccount from "./hook/useAccount";
import useHero from "./hook/useHero";
import Sider from "./Sider";
import "./style.scss";
import Model from "../../components/model";
import Form from "./Form";
import { FiLoader } from "react-icons/fi";

export const sex = [
    { label: "Male", value: 0 },
    { label: "Female", value: 1 },
];
export const generation = [
    { label: "GENESIS", value: 0 },
    { label: "NORMAL", value: 1 },
];
export const heroClass = [
    { label: "WATER", value: 0 },
    { label: "PLANT", value: 1 },
    { label: "FIRE", value: 2 },
    { label: "THUNDER", value: 3 },
    { label: "DARK", value: 4 },
    { label: "LIGHT", value: 5 },
];
export const star = [
    { label: "ONE", value: 0 },
    { label: "TWO", value: 1 },
    { label: "THREE", value: 2 },
    { label: "FOUR", value: 3 },
    { label: "FIVE", value: 4 },
    { label: "SIX", value: 5 },
];

const Index = () => {
    const { account, signer, getSigner } = useAccount();
    const {
        heroes,
        setFilter,
        createHero,
        loading,
        filter,
        setItemTransfer,
        setShowTransfer,
        showTransfer,
        transfer,
    } = useHero(signer);

    return (
        <div className="flex w-screen h-screen flex-col overflow-hidden">
            <Header account={account} getSigner={getSigner} />
            <div className="flex flex-row _content">
                <Sider account={account} createHero={createHero} />
                <div className="flex flex-col w-full p-10 h-full overflow-auto _items">
                    <div className="flex flex-row _item-max-width pl-5">
                        <button
                            className="mr-5"
                            onClick={() => setFilter("all-heroes")}
                        >
                            All Heroes
                        </button>
                        <button onClick={() => setFilter("my-heroes")}>
                            My Heroes
                        </button>
                    </div>
                    <div className="flex flex-wrap _item-max-width">
                        {heroes.map((hero, i) => (
                            <Item
                                setItemTransfer={setItemTransfer}
                                setShowTransfer={setShowTransfer}
                                filter={filter}
                                key={i}
                                hero={hero}
                            />
                        ))}
                    </div>
                </div>
            </div>
            {loading && (
                <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center _loading">
                    <div className="flex flex-row">
                        <FiLoader className="_loading-icon" /> {loading}
                    </div>
                </div>
            )}
            <Model
                className="_modal-form"
                show={showTransfer}
                onClose={() => setShowTransfer(false)}
            >
                <Form transfer={transfer} />
            </Model>
        </div>
    );
};
export default Index;

const Item = ({
    hero,
    filter,
    setShowTransfer,
    setItemTransfer,
}: {
    hero: Heroes;
    filter: string;
    setShowTransfer: React.Dispatch<React.SetStateAction<boolean>>;
    setItemTransfer: React.Dispatch<React.SetStateAction<Heroes | undefined>>;
}) => {
    return (
        <div className="_item flex flex-col">
            <div className="img flex justify-center">
                <img src={hero.avatar} alt="avatar" />
            </div>
            <p>class: {heroClass[hero.class].label}</p>
            <p>sex: {sex[hero.sex].label}</p>
            <p>generation: {generation[hero.generation].label}</p>
            <p>star: {star[hero.star].label}</p>
            {filter === "my-heroes" && (
                <div>
                    <button
                        className="mt-3 _transfer"
                        onClick={() => {
                            setShowTransfer(true);
                            setItemTransfer(hero);
                        }}
                    >
                        Tranfer
                    </button>
                </div>
            )}
        </div>
    );
};
