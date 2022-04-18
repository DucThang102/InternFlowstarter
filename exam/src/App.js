import './App.css';
import { Button, Col, Input, Modal, Row, Space, Layout, Menu, Card, Spin, Drawer } from 'antd'
import CreateHero from './components/createHero/createHero';
import CardHero from './components/card/card';
import { ethers } from 'ethers';
import { useCallback, useEffect, useMemo, useState } from 'react';
import heroAbi from './contract/HeroFi.json'
import Loader from './components/loader/loader';
import ClipLoader from 'react-spinners/ClipLoader';
import { ToastContainer, toast } from 'react-toastify';
import { MenuOutlined, MenuUnfoldOutlined } from '@ant-design/icons'
import { Pagination } from 'antd';

const ADDRESS = '0x7575c71C24091954d219d59E3513b59f8F8a552f'

function App() {
  const [addressWallet, setAddressWallet] = useState()
  const [heroes, setHeroes] = useState([])
  const [allHeroes, setAllHeroes] = useState([])
  const [myHeroes, setMyHeroes] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isModal, setIsModal] = useState(false)
  const [text, setText] = useState()
  const [currentHero, setCurrentHero] = useState()
  const [rule, setRule] = useState()
  const [showSider, setShowSider] = useState(false)
  const [breakpoint, setBreakPoint] = useState(false)
  const [total, setTotal] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(12)

  const { Header, Sider, Content } = Layout;
  const getAddressMetamask = async () => {
    const myAddress = await signer.getAddress()
    setAddressWallet(myAddress)
  }
  let provider
  let contract
  let signer
  let contractSigner

  if (typeof window.ethereum !== 'undefined') {
    provider = new ethers.providers.Web3Provider(window.ethereum)
    contract = new ethers.Contract(ADDRESS, heroAbi.abi, provider)
    signer = provider.getSigner()
    contractSigner = new ethers.Contract(ADDRESS, heroAbi.abi, signer)
  }

  useEffect(() => {
    if(typeof window.ethereum !== 'undefined'){
      getAddressMetamask()
      getAllHeroesContract()
    }
  }, [])

  useEffect(() => {
    setDataHerror()
  }, [currentPage, allHeroes, pageSize])

  const setDataHerror = () => {
    const limit = pageSize
    const skip = (currentPage - 1) * pageSize
    const dataHero = allHeroes.slice(skip, skip + limit)
    setHeroes(dataHero)
  }

  const connectMetamask = async () => {
    const { ethereum } = window
    if (typeof ethereum === 'undefined') {
      window.open('https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=en', 'blank')
    } else {
      await provider.send("eth_requestAccounts", []);
      const myAddress = await signer.getAddress()
      setAddressWallet(myAddress)
    }
  }

  const getAllHeroesContract = async () => {
    setRule('All Heroes')
    setIsLoading(true)
    try {
      const result = await contract.getAllHeroes()
      if (addressWallet) {
        const res = await contractSigner.getHeroesOfAccount()
        setMyHeroes(res)
      }
      setAllHeroes(result)
      setTotal(result.length)
      setIsLoading(false)
    } catch (error) {
      setIsLoading(false)
      toast.error('error')
    }
  }

  const getMyHeroesContract = useCallback(async () => {
    setCurrentPage(1)
    setIsLoading(true)
    setRule('My Heroes')
    try {
      const result = await contractSigner.getHeroesOfAccount()
      setAllHeroes(result)
      setMyHeroes(result)
      setTotal(result.length)
      setIsLoading(false)
    } catch (error) {
      setIsLoading(false)
      toast.error('error')
    }
  }, [allHeroes])

  const handleCancel = () => {
    setIsModal(false)
    setCurrentHero(null)
    setText(null)
    setIsLoading(false)
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

    <Spin tip="Loading..." size='large' spinning={isLoading}>
      <Layout>
        <Sider
          width={breakpoint ? 0 : 300}
          theme='light'
          trigger={null}
          collapsedWidth="0"
          breakpoint='md'
          onBreakpoint={broken => {
            setBreakPoint(broken)
          }}>
          {
            breakpoint ? (
              <Drawer visible={showSider} placement="left" onClose={() => setShowSider(false)} className='drawer'>
                <CreateHero getMyHeroesContract={getMyHeroesContract} setIsLoading={setIsLoading} contractSigner={contractSigner} />
              </Drawer>
            ) : (
              <CreateHero getMyHeroesContract={getMyHeroesContract} setIsLoading={setIsLoading} contractSigner={contractSigner} />
            )
          }
        </Sider>
        <Layout className="site-layout">
          <Header className="site-layout-background header" theme='light' >
            <Space>
              {breakpoint && <MenuOutlined style={{ fontSize: 20 }} onClick={() => setShowSider(true)} />}

            </Space>

            {!addressWallet ? <Button type="primary" size='large' onClick={connectMetamask}>Connect Metamask</Button> : <div className='adress-wallet'>{addressWallet}</div>}
          </Header>
          <Content
            className="site-layout-background"
            style={{
              margin: '24px 16px',
              padding: 24,
              minHeight: 280,
            }}
          >
            <Card
              title={
                <div className='cardContainer-title'>
                  <div>{rule}</div>
                  <div className='button-group'>
                    <Button size='large' type={rule === 'All Heroes' ? 'danger' : 'primary'} onClick={getAllHeroesContract} style={{ margin: 10 }}>All Heroes</Button>
                    <Button size='large' type={rule !== 'All Heroes' ? 'danger' : 'primary'} onClick={getMyHeroesContract}>My Heroes</Button>
                  </div>
                </div>
              }

            >
              <div className='list-heroes'>
                {
                  heroes.map((hero, index) => {
                    return (
                      <div key={index} className='card-item'>
                        <Space>
                          <CardHero data={hero} setIsModal={setIsModal} setCurrentHero={setCurrentHero} myHeroes={myHeroes} />
                        </Space>
                      </div>
                    )
                  })
                }
              </div>
              <div className='page'>
                <Pagination
                  current={currentPage}
                  pageSize={pageSize}
                  total={total}
                  pageSizeOptions={[10, 12, 20, 50, 100]}
                  showTotal={(total, range) => {
                    return 'Total ' + total + ' items '
                  }}
                  onChange={(page, pageSize) => {
                    setCurrentPage(page)
                  }}
                  onShowSizeChange={(current, size) => {
                    setPageSize(size)
                  }}
                />
              </div>
            </Card>
            <Modal
              title="Transfer"
              visible={isModal}
              onOk={handleOk}
              onCancel={handleCancel}
              okText={isLoading ? <ClipLoader size={20} color={'#fff'} /> : 'Transfer'}
              cancelText='Cancel'
            >
              <Input
                type="text"
                placeholder="Enter wallet address..."
                onChange={(e) => setText(e.target.value)}
                value={text}
              />
              {text === '' && <div style={{ color: 'red' }}>Address wallet can not be empty!</div>}
            </Modal>
            <ToastContainer />
          </Content>
        </Layout>
      </Layout>
    </Spin>

    // <div className="App">
    //   <Row>
    //     <Col span={6}>
    //       <CreateHero getMyHeroesContract={getMyHeroesContract} />
    //     </Col>
    //     <Col span={18}>
    //       <Row>
    //         <Col span={18}>
    //           <Space>
    //             <Button type="primary" onClick={getAllHeroesContract} >All Heroes</Button>
    //             <Button type="primary" onClick={getMyHeroesContract}>My Heroes</Button>
    //           </Space>
    //         </Col>
    //         <Col span={6}>
    //           {!addressWallet ? <Button type="primary" onClick={connectMetamask}>Connect Metamask</Button> : <div>{addressWallet}</div>}

    //         </Col>
    //       </Row>
    //       <Row>
    //         {isLoading ? <Loader /> : (
    //           <div style={{ display: 'flex', flexWrap: 'wrap' }}>
    //             {
    //               heroes.map((hero, index) => {
    //                 return (
    //                   <div key={index}>
    //                     <Space>
    //                       <CardHero data={hero} setIsModal={setIsModal} setCurrentHero={setCurrentHero} />
    //                     </Space>
    //                   </div>
    //                 )
    //               })
    //             }
    //           </div>
    //         )}

    //       </Row>
    //     </Col>
    //   </Row>

    //   <Modal title="Transfer" visible={isModal} onOk={handleOk} onCancel={handleCancel} okText={isLoading ? <ClipLoader size={20} color={'#fff'} /> : 'Transfer'} cancelText='Cancel'>
    //     <Input type="text" placeholder="Enter wallet address..." onChange={(e) => setText(e.target.value)} value={text} />
    //     {text === '' && <div style={{ color: 'red' }}>Address wallet can not be empty!</div>}
    //   </Modal>
    //   <ToastContainer />
    // </div>
  );
}

export default App;
