import { Box, Button, Grid, Stack } from "@mui/material";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import "./App.css";
import { Backdrop, CardList, Header, Sidebar } from "./components";
import SnackbarCustom from "./components/Snackbar/Snackbar";
import abi from "./HeroFi.json";
import useContract from "./hooks/useContract";

function App() {
  const CONTRACT_ADDRESS = "0x7575c71C24091954d219d59E3513b59f8F8a552f";
  const [loading, setLoading] = useState(false);

  const [data, setData] = useState([]);
  const [account, setAccount] = useState("");
  const [signer, setSigner] = useState(null);
  const [errSigner, setErrSigner] = useState();
  const contract = useContract(signer);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        await getAllHero();
      } catch (error) {
        console.log(error);
      }
      setLoading(false);
    })();
  }, []);

  const connectWallet = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const accountAddress = (await provider.send("eth_requestAccounts", []))[0];
    const signer = provider.getSigner();

    setAccount(accountAddress);
    setSigner(signer);
  };

  const getAllHero = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = new ethers.Contract(CONTRACT_ADDRESS, abi.abi, provider);
    const res = await contract.getAllHeroes();
    setData(res);
  };

  const getHeroOfAccount = async () => {
    if (!signer)
      setErrSigner({ type: "error", msg: "You aren't connect to wallet" });
    try {
      setLoading(true);
      const res = await contract.getHeroesOfAccount();
      setData(res);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  const handleSnackbar = (newValue) => {
    setErrSigner(newValue);
  };

  return (
    <>
      <Box px={{ xs: 2, sm: 3, md: 5 }}>
        <Header account={account} onConnect={connectWallet} />
        <Grid container spacing={4}>
          <Grid item xs={12} sm={3}>
            <Sidebar
              signer={signer}
              setSnackbar={handleSnackbar}
              getHeroOfAccount={getHeroOfAccount}
            />
          </Grid>
          <Grid item xs={12} sm={9}>
            <Stack columnGap={2} direction="row">
              <Button
                onClick={getHeroOfAccount}
                variant="contained"
                sx={{ textTransform: "none", mb: 4 }}
              >
                My Heroes
              </Button>
              <Button
                onClick={getAllHero}
                variant="contained"
                sx={{ textTransform: "none", mb: 4 }}
              >
                All Heroes
              </Button>
            </Stack>
            <CardList
              currentAcc={account}
              setSnackbar={handleSnackbar}
              signer={signer}
              data={data}
              getHeroOfAccount={getHeroOfAccount}
            />
          </Grid>
        </Grid>
      </Box>
      <Backdrop show={loading} />
      <SnackbarCustom
        open={Boolean(errSigner)}
        type={errSigner?.type}
        onClose={() => setErrSigner(false)}
        msg={errSigner?.msg}
      />
    </>
  );
}

export default App;
