import { Box, Grid, Tab, Tabs } from "@mui/material";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import "./App.css";
import { Backdrop, CardList, Header, Pagination, Sidebar } from "./components";
import { CARD_PER_PAGE, CONTRACT_ADDRESS } from "./constants/globalConstants";
import abi from "./HeroFi.json";
import useContract from "./hooks/useContract";
import { generateErrMsg } from "./utils/common";
import { notify } from "./utils/toastify";

function App() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [account, setAccount] = useState("");
  const [signer, setSigner] = useState(null);
  const contract = useContract(signer);

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [tabNumber, setTabNumber] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [cards, setCards] = useState([]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        if (typeof window.ethereum === "undefined") {
          throw new Error("Browser have not metamask");
        }
        await getAllHero();
      } catch (error) {
        console.log(error);
        notify.error(generateErrMsg(error.message));
      }
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    const start = (currentPage - 1) * CARD_PER_PAGE;
    const end = start + CARD_PER_PAGE;
    const result = [...data].slice(start, end);
    setCards(result);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [currentPage, data]);

  useEffect(() => {
    let timeout = null;

    const onWidthResize = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        setWindowWidth(window.innerWidth);
      }, 400);
    };

    window.addEventListener("resize", onWidthResize);

    return () => {
      window.removeEventListener("resize", onWidthResize);
    };
  });

  const connectWallet = async () => {
    try {
      if (typeof window.ethereum === "undefined") {
        throw new Error("Browser have not metamask");
      }
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const accountAddress = (
        await provider.send("eth_requestAccounts", [])
      )[0];
      const signer = provider.getSigner();

      setAccount(accountAddress);
      setSigner(signer);
    } catch (error) {
      notify.error(error.message);
    }
  };

  const getAllHero = async () => {
    setTabNumber(1);
    setCurrentPage(1);
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = new ethers.Contract(CONTRACT_ADDRESS, abi.abi, provider);
    const res = await contract.getAllHeroes();
    setData(res);
  };

  const getHeroOfAccount = async () => {
    if (!signer) notify.error("You aren't connect to wallet");
    setLoading(true);
    try {
      setTabNumber(0);
      setCurrentPage(1);
      const res = await contract.getHeroesOfAccount();
      setData(res);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  const handleTabChange = (event, newValue) => {
    setTabNumber(newValue);
  };

  return (
    <>
      <Box
        sx={{
          maxWidth: "1440px",
          m: "0 auto",
          px: { xxs: 1.5, sm: 3, md: 5 },
        }}
      >
        <Header
          currentAcc={account}
          signer={signer}
          getHeroOfAccount={getHeroOfAccount}
          onConnect={connectWallet}
        />
        <Grid container spacing={{ xs: 0, sm: 4 }}>
          <Grid item xs={12} sm={3.5} md={2.5}>
            {windowWidth > 600 && (
              <Sidebar signer={signer} getHeroOfAccount={getHeroOfAccount} />
            )}
          </Grid>
          <Grid item xs={12} sm={8.5} md={9.5}>
            <Box mb={2}>
              <Tabs
                value={tabNumber}
                onChange={handleTabChange}
                aria-label="disabled tabs example"
              >
                <Tab
                  label="My Heros"
                  disabled={!signer}
                  onClick={getHeroOfAccount}
                />
                <Tab label="All Heros" onClick={getAllHero} />
              </Tabs>
            </Box>
            <CardList
              currentAcc={account}
              signer={signer}
              data={cards}
              getHeroOfAccount={getHeroOfAccount}
            />
            <Pagination
              totalPage={Math.ceil(data.length / CARD_PER_PAGE)}
              currentPage={currentPage}
              onPageChange={(page) => setCurrentPage(page)}
            />
          </Grid>
        </Grid>
      </Box>
      <Backdrop show={loading} />
    </>
  );
}

export default App;
