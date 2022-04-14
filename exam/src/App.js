import './App.css';
import { Button, Col, Input, Modal, Row, Space } from 'antd'
import CreateHero from './components/createHero/createHero';
import CardHero from './components/card/card';
import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import heroAbi from './contract/HeroFi.json'
import Loader from './components/loader/loader';
import ClipLoader from 'react-spinners/ClipLoader';
import { ToastContainer, toast } from 'react-toastify';

const provider = new ethers.providers.Web3Provider(window.ethereum)
const ADDRESS = '0x7575c71C24091954d219d59E3513b59f8F8a552f'
const contract = new ethers.Contract(ADDRESS, heroAbi.abi, provider)
const signer = provider.getSigner()
export const contractSigner = new ethers.Contract(ADDRESS, heroAbi.abi, signer)

function App() {
  const [addressWallet, setAddressWallet] = useState()
  const [heroes, setHeroes] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isModal, setIsModal] = useState(false)
  const [text, setText] = useState()
  const [currentHero, setCurrentHero] = useState()

  const getAddressMetamask = async () => {
    const myAddress = await signer.getAddress()
    setAddressWallet(myAddress)
  }

  useEffect(() => {
    getAddressMetamask()
    getAllHeroesContract()
  }, [])

  const connectMetamask = async () => {
    const { ethereum } = window
    if (typeof ethereum === 'undefined') {
      window.open('https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=en', 'blank')
    } else {
      await provider.send("eth_requestAccounts", []);
      getAddressMetamask()
    }
  }

  const getAllHeroesContract = async () => {
    setIsLoading(true)
    try {
      const result = await contract.getAllHeroes()
      setHeroes(result)
      setIsLoading(false)
    } catch (error) {
      setIsLoading(false)
      toast.error('error')
    }
  }

  const getMyHeroesContract = async () => {
    setIsLoading(true)
    try {
      const result = await contractSigner.getHeroesOfAccount()
      setHeroes(result)
      setIsLoading(false)
    } catch (error) {
      setIsLoading(false)
      toast.error('error')
    }
  }

  const handleCancel = () => {
    setIsModal(false)
    setCurrentHero(null)
    setText(null)
  }

  const handleOk = async () => {
    if (text) {
      setIsLoading(true)
      try {
        const transaction = await contractSigner.transferHero(addressWallet, text, parseInt(currentHero.id))
        const tx = await transaction.wait()
        getMyHeroesContract()
        setIsModal(false)
        setIsLoading(false)
        toast.success('Success')
    } catch (error) {
        setIsLoading(false)
        toast.error('error')
      }
    } else {
      setText('')
      setIsLoading(false)
    }
  }

  return (
    <div className="App">
      <Row>
        <Col span={6}>
          <CreateHero getMyHeroesContract={getMyHeroesContract} setIsLoading={setIsLoading} />
        </Col>
        <Col span={18}>
          <Row>
            <Col span={18}>
              <Space>
                <Button type="primary" onClick={getAllHeroesContract} >All Heroes</Button>
                <Button type="primary" onClick={getMyHeroesContract}>My Heroes</Button>
              </Space>
            </Col>
            <Col span={6}>
              {!addressWallet ? <Button type="primary" onClick={connectMetamask}>Connect Metamask</Button> : <div>{addressWallet}</div>}

            </Col>
          </Row>
          <Row>
            {isLoading ? <Loader /> : (
              <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                {
                  heroes.map((hero, index) => {
                    return (
                      <div key={index}>
                        <Space>
                          <CardHero data={hero} setIsModal={setIsModal} setCurrentHero={setCurrentHero} />
                        </Space>
                      </div>
                    )
                  })
                }
              </div>
            )}

          </Row>
        </Col>
      </Row>

      <Modal title="Transfer" visible={isModal} onOk={handleOk} onCancel={handleCancel} okText={isLoading ? <ClipLoader size={20} color={'#fff'} /> : 'Transfer'} cancelText='Cancel'>
        <Input type="text" placeholder="Enter wallet address..." onChange={(e) => setText(e.target.value)} value={text} />
        {text === '' && <div style={{ color: 'red' }}>Address wallet can not be empty!</div>}
      </Modal>
      <ToastContainer />
    </div>
  );
}

export default App;
