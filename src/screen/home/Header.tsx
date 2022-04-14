type Headerprops = {
    account: string;
    getSigner: () => Promise<void>;
};

const Header = ({ account, getSigner }: Headerprops) => {
    return (
        <div className="w-full flex justify-end py-5 px-10">
            {account ? (
                <div className="text-orange-400 cursor-pointer">{account}</div>
            ) : (
                <div
                    className="text-orange-400 cursor-pointer"
                    onClick={getSigner}
                >
                    Connect Metamask
                </div>
            )}
        </div>
    );
};
export default Header;
