type Headerprops = {
    account: string;
    getSigner: () => Promise<void>;
};

const Header = ({ account, getSigner }: Headerprops) => {
    return (
        <div className="w-full flex justify-end h-10">
            {account ? (
                <button>{account}</button>
            ) : (
                <button onClick={getSigner}>Connect Metamask</button>
            )}
        </div>
    );
};
export default Header;
