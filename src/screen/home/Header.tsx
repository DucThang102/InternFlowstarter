type Headerprops = {
    account: string;
    getSigner: () => Promise<void>;
};

const Header = ({ account, getSigner }: Headerprops) => {
    return (
        <div className="w-full flex justify-end h-10">
            {account ? (
                <div className="text-orange-400">{account}</div>
            ) : (
                <div className="text-orange-400" onClick={getSigner}>
                    Connect Metamask
                </div>
            )}
        </div>
    );
};
export default Header;
