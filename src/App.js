import { useEffect, useState, useRef, useMemo } from "react";
import "./App.css";
import Loading from './components/Loading/Loading';
import CardItem from "./components/CardItem/CardItem";
import HeroesForm from "./components/HeroesForm/HeroesForm";

import { ethers } from "ethers";

import { ToastContainer } from 'react-toastify';
import { successToast, errToast, warnToast } from './utils/ToastMessage';
import 'react-toastify/dist/ReactToastify.css';

import { data } from "./HeroFi";
import { address, sex, generation, heroClass, star } from "./constants";

function App() {
  const [addressAccount, setAddressAccount] = useState("");
  const [allHeroes, setAllHeroes] = useState([]);

  /* Mobile Detail Modal */
  const [modalData, setModalData] = useState({
    heroClass: "",
    sex: "",
    generation: "",
    star: ""
  });

  const [contract, setContract] = useState(null);
  const [signer, setSigner] = useState(null);
  const [transferAccount, setTransferAccount] = useState("");
  const [transferData, setTransferData] = useState({});

  /* Loading */
  const [loading, setLoading] = useState(false);
  const [toggle, setToggle] = useState(false);
  const [toggle2, setToggle2] = useState(false);
  const [tabIndex, setTabIndex] = useState(1);
  const [pageIndex, setPageIndex] = useState(1);
  const [disabled, setDisabled] = useState(true);

  let pageNum = 20;

  /* Input ref */
  const inputRef = useRef();

  /* Connect MetaMask */
  const connectMetaMask = async () => {
    try {
      const account = await signer.getAddress();
      setAddressAccount(account);
      setDisabled(!disabled);
      successToast("Ket noi MetaMask thanh cong !");
    } catch (error) {
      errToast("Ket noi MetaMask that bai !");
      throw error;
    }
  };

  /* Get All Heroes method */
  const getAllHeroes = async () => {
    try {
      setLoading(true);
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      setSigner(signer);
      const contractRes = new ethers.Contract(address, data.abi, signer);
      setContract(contractRes);
      const heroRes = await contractRes.getAllHeroes();
      const heroResExecuted = heroRes.map(item => Object.assign({}, item));
      setAllHeroes([...heroResExecuted]);
      setPageIndex(1);
      setLoading(false);
    } catch (error) {
      throw error;
    }
  };

  /* Get All Heroes Account method */
  const getAllHeroesAccount = async () => {
    try {
      setLoading(true);
      const heroAccountRes = await contract.getHeroesOfAccount();
      setAllHeroes([...heroAccountRes]);
      setPageIndex(1);
      setLoading(false);
    } catch (error) {
      throw error;
    }
  };

  /* Create Hero method */
  const createHero = async (e, dataInput) => {
    e.preventDefault();
    try {
      const { avatar, heroClass, sex, generation, star } = dataInput;
      if(avatar === "")
        warnToast("Vui long chon anh !");
      else {
        const res = await contract.createHero(avatar, heroClass, sex, generation, star);
        const { status } = await res.wait();
        if(status === 1) {
          getAllHeroesAccount();
          setPageIndex(1);
        }
        else {
          errToast("Tao hero that bai !");
        }
      }
    } catch (error) {
        errToast("Tao hero that bai !");
      throw error;
    }
  };

  /* Transfer Hero method */
  const transferHero = async (e) => {
    e.preventDefault();
    if(addressAccount === "")
      warnToast("Hay ket noi voi MetaMask truoc !");
    else {
      if(transferAccount === "") 
        errToast("Hay nhap tai khoan nhan !");
      else {
        try {
          /* 0x46431225342257388cA3FD6248C0db14D055bb4c */
          const res = await contract.transferHero(addressAccount, transferAccount, transferData.id._hex);
          console.log("Transfer");
          const { status } = await res.wait();
          if(status === 1) {
            successToast("Chuyen doi thanh cong !");
            setTransferAccount("");
            setToggle(false);
            getAllHeroesAccount();
          }
          else {
            errToast("Chuyen doi that bai !");
          }
        } catch (error) {
          errToast("Chuyen doi that bai !");
          throw error;
        }
      }
    }
  }

  /* Card callback */
  const setTransferDataCb = (item) => {
    setTransferData(item);
  }

  const setModalDataCb = (item) => {
    setModalData({
      ...modalData,
      heroClass: heroClass.find((item2) => item2.value === item.class).label,
      sex: sex.find((item2) => item2.value === item.sex).label,
      generation: generation.find((item2) => item2.value === item.generation).label,
      star: star.find((item2) => item2.value === item.star).label
    })
  }

  const setToggleCb = () => {
    setToggle(!toggle)
  }

  const setToggle2Cb = () => {
    setToggle2(!toggle2)
  }

  /* Pagination */
  const page = useMemo(() => {
    return Math.ceil(allHeroes.length / pageNum);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allHeroes]);

  let pageTemplate = [];
  for (let i = 1; i <= page; i++) 
    pageTemplate.push(
      <li className={pageIndex === i ? "container-page-item active" : "container-page-item"} 
        onClick={() => {
          setPageIndex(i); 
          window.scrollTo({top: "0", behavior: "smooth"});
        }}>{i}
      </li>
    );

  useEffect(() => {
    if (typeof window.ethereum !== "undefined") {
      console.log("MetaMask is installed!");
      getAllHeroes();
      warnToast("Vui long hay ket noi MetaMask truoc !");
    }
    else {
      errToast("Trinh duyet khong co MetaMask. Vui long tai ve !")
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    inputRef.current.focus();
  }, [toggle]);

  return (
    <div className="App">
      <ToastContainer position="top-center" autoClose={3000} pauseOnHover={false} newestOnTop={true} />

      <HeroesForm createHero={createHero} disabled={disabled} />

      <div className="container">
        <div className="container-top">
          <div>
            {/* Get All Heroes */}
            <button className="btn" style={tabIndex === 1 ? {transform: 'scale(1.2)'} : {}} onClick={() => {
              getAllHeroes(); 
              setTabIndex(1);
            }}>All Heroes</button>
            {/* Get All Heroes Of Account */}
            <button className="btn btn--myheroes" style={tabIndex === 2 ? {transform: 'scale(1.2)'} : {}} onClick={() => {
              getAllHeroesAccount(); 
              setTabIndex(2);
            }} disabled={disabled}>My Heroes</button>
          </div>
          {addressAccount.length === 0 ? (
            <a href="/#" onClick={(event) => {
              connectMetaMask(event);
            }}>Connect MetaMask</a>
          ) : (
            <div className="container-top-address">{`Address: ${addressAccount}`}</div>
          )}
        </div>
        <div className="container-bottom">
          <div className="container-count">
            <div>Page: {pageIndex}</div>
            Total Heroes: {allHeroes?.length}
          </div> 
          {typeof window.ethereum === "undefined" ? 
            <div className="container-err-message">Get All Heroes failed!</div> : 
            <>
              <ul className="container-list">
              {loading ? <Loading />
              : (allHeroes.length !== 0 && (allHeroes.slice(pageNum * (pageIndex - 1), pageNum * pageIndex).map((item, index) => 
                  <CardItem 
                    key={index} 
                    item={item} 
                    setTransferDataCb={setTransferDataCb} 
                    setModalDataCb={setModalDataCb}
                    setToggleCb={setToggleCb}
                    setToggle2Cb={setToggle2Cb}
                  />)
                ))}
            </ul>
            {
              loading || <ul className="container-page-list">
                <button className="container-page-item" onClick={() => setPageIndex(pageIndex - 1)} disabled={pageIndex === 1}>Prev</button>
                {pageTemplate.map((item, index) => <div key={index}>{item}</div>)}
                <button className="container-page-item" onClick={() => setPageIndex(pageIndex + 1)} disabled={pageIndex === page}>Next</button>
              </ul>
            }
            </>
          }
        </div>
      </div>

      {/* Transfer Modal */}
      <div className={toggle ? "transfer-modal active" : "transfer-modal"}>
        <div className="transfer-modal-overlay" onClick={() => {setToggle(false)}}></div>
        <div className="transfer">
          <form className="transfer-form">
            <i className="fa-solid fa-xmark transfer-form-icon" onClick={(e) => {
              e.preventDefault();
              setToggle(!toggle);
            }}></i>
            <input type="text" placeholder="Nhap dia chi vi..." ref={inputRef} value={transferAccount} onChange={(e) => setTransferAccount(e.target.value)}/>
            <div className="transfer-button-wrap">
              <button
                type="submit"
                className="btn btn--transfer"
                onClick={(e) => transferHero(e)}
              >
                Transfer
              </button>
              <button type="reset" className="btn btn--cancel" onClick={() => {
                inputRef.current.focus();
                setTransferAccount("");
              }}>
                Clear
              </button>
            </div>
          </form>
        </div>
      </div>
      
      {/* Detail Modal */}
      <div className={toggle2 ? "detail-modal active" : "detail-modal"}>
        <div className="detail-modal-overlay" onClick={() => {setToggle2(false)}}></div>
        <div className="detail-modal-container">
          <i className="fa-solid fa-xmark detail-modal-icon" onClick={() => setToggle2(false)}></i>
          <div className="detail-modal-data">
            <span>Class:
              <span>{modalData.heroClass}</span>
            </span>
            <span>Sex:
              <span>{modalData.sex}</span>
            </span>
            <span>Generation:
              <span>{modalData.generation}</span>
            </span>
            <span>Star:
              <span>{modalData.star}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
