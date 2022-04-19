import { Box, Grid, Stack, Tab, Tabs, Typography } from "@mui/material";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import "./App.css";
import { Backdrop, CardList, Header, Pagination, Sidebar } from "./components";
import { CONTRACT_ADDRESS } from "./constants/globalConstants";
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
  const [cardPerPage, setCardPerPage] = useState(() => {
    return window.innerWidth > 1024 ? 8 : 6;
  });

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
    const start = (currentPage - 1) * cardPerPage;
    const end = start + cardPerPage;
    const result = [...data].slice(start, end);
    setCards(result);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [currentPage, data, cardPerPage]);

  useEffect(() => {
    let timeout = null;

    const onWidthResize = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        const windowWidth = window.innerWidth;
        windowWidth <= 1024 ? setCardPerPage(6) : setCardPerPage(8);
        setWindowWidth(windowWidth);
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
          windowWidth={windowWidth}
        />
        <Grid container spacing={{ xs: 0, sm: 4 }}>
          <Grid item xs={12} sm={3.5} md={2.5}>
            {windowWidth > 600 && (
              <Sidebar signer={signer} getHeroOfAccount={getHeroOfAccount} />
            )}
          </Grid>
          <Grid item xs={12} sm={8.5} md={9.5}>
            <Stack
              direction={{ xxs: "column", xs: "row" }}
              alignItems="center"
              justifyContent="space-between"
              sx={{ mb: 2 }}
            >
              <Tabs
                value={tabNumber}
                onChange={handleTabChange}
                aria-label="disabled tabs example"
              >
                <Tab
                  sx={{
                    fontSize: { xxs: "12px", xs: "14px" },
                    px: { xxs: "10px", xs: "16px" },
                    py: { xxs: "8px", xs: "12px" },
                  }}
                  label="My Heros"
                  disabled={!signer}
                  onClick={getHeroOfAccount}
                />
                <Tab
                  sx={{
                    fontSize: { xxs: "12px", xs: "14px" },
                    px: { xxs: "10px", xs: "16px" },
                    py: { xxs: "8px", xs: "12px" },
                  }}
                  label="All Heros"
                  onClick={getAllHero}
                />
              </Tabs>
              <Typography sx={{ mt: { xxs: 3, xs: 0 } }} variant="body2">
                Total Hero:{" "}
                <Typography
                  component="span"
                  variant="subtitle2"
                  color="primary"
                >
                  {data.length}
                </Typography>
              </Typography>
            </Stack>
            <CardList
              currentAcc={account}
              signer={signer}
              data={cards}
              getHeroOfAccount={getHeroOfAccount}
            />
            <Pagination
              totalPage={Math.ceil(data.length / cardPerPage)}
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
