import { Button, Pagination } from 'antd';
import React, { useEffect, useState } from 'react';
import FormAdd from './components/formadd/form';
import Listhero from './components/listhero/listhero';
import { ethers } from 'ethers';
import herofi from './apicontract/HeroFi.json';
import {create} from 'ipfs-http-client';
import {ClipLoader} from 'react-spinners';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { MAXSIZE, ERRORS } from './constanst/index';

const client = create('https://ipfs.infura.io:5001/api/v0');

const FormSizeDemo = () => {
    const [address, setAddress] = useState();
    const [contracts, setcontracts] = useState([]);
    const [fileUrl, updateFileUrl] = useState('')
    const [loading, setLoading] = useState(false);
    const [hidden, setHidden] = useState(false);

    const [activeTag, setActiveTag] = useState(1);
    const toggleTabs = (index) => {setActiveTag(index)};
    const getActiveClass = (index, className) => (activeTag === index ? className : "")
    
    // const PageSize = 10;
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(8);
    const firstPageIndex = (currentPage - 1) * pageSize;
    const lastPageIndex = firstPageIndex + pageSize;
    const contractsPagesize = contracts.slice(firstPageIndex, lastPageIndex);

    let provider, contract, signer;
    if(typeof window.ethereum !== 'undefined'){
        provider = new ethers.providers.Web3Provider(window.ethereum);
        contract = new ethers.Contract(process.env.REACT_APP_API_CONTRACT, herofi?.abi, provider);   
        signer = provider.getSigner();
    }
    else{
        toast.error(ERRORS.notExistMetamask);
        window.open(process.env.REACT_APP_URL_INSTALL_METAMASK, '_blank')
    }
    // const signer = provider.getSigner();
    // const contract = new ethers.Contract(process.env.REACT_APP_API_CONTRACT, herofi?.abi, provider);
    // const contractSigner = new ethers.Contract(process.env.REACT_APP_API_CONTRACT, herofi?.abi, signer);
    const contractSigner = new ethers.Contract(process.env.REACT_APP_API_CONTRACT, herofi?.abi, signer);

    const [isSize, setIsSize] = useState(false)
    async function onChange(e) {
        const file = e.target.files[0];
        try {
            if(file?.size > MAXSIZE){
                toast.warning(`${ERRORS.limitSizeFile} ${MAXSIZE/10000} MB`);
                setIsSize(true)
                return false
            }
            setIsSize(false)
            const added = await client.add(file)
            const url = `https://ipfs.infura.io/ipfs/${added.path}`
            updateFileUrl(url)
        } catch (error) {
        //   console.log('Error uploading file: ', error)
            toast.error(ERRORS.uploadFile)
        }  
    }

    const getHeroFiMetamask = async () => {
        try{
            setLoading(true)
            const cHerifi = await contract?.getAllHeroes()
            setcontracts(await cHerifi)
            // setLoading(false)
        }
        catch(err){
            // setLoading(false)
            if(err.message){
                toast.error(err.message.toString().substring(0, 30) + "...")
            }
            else{
                toast.error(ERRORS.somethingError)
            }
        }
        finally{setLoading(false)}
    }

    const getAddressMetamask = async () => {
        try{
            // const signer = provider.getSigner();
            setAddress(await signer.getAddress());
            sessionStorage.setItem('isMetamask', await signer.getAddress())
        }
        catch(err){
            if(err.message){
                toast.error(err.message.toString().substring(0, 30) + "...")
            }
            else{
                toast.error(ERRORS.somethingError)
            }
        }
    }

    const handleConnectMetamask = async () => {
        try{
            if (typeof window.ethereum !== 'undefined') {
                await provider.send("eth_requestAccounts", []);
                getAddressMetamask()
                setHidden(true)
            }
            else{
                window.open(process.env.REACT_APP_URL_INSTALL_METAMASK, '_blank')
            }
        }
        catch(err){
            setLoading(false)
            if(err.message){
                toast.error(err.message.toString().substring(0, 30) + "...")
            }
            else{
                toast.error(ERRORS.somethingError)
            }
        }
    }

    const handleGetALLHero = async () => {
        try{
            setLoading(true)
            const heroesAll = await contractSigner?.getAllHeroes();
            setcontracts(heroesAll)
            toggleTabs(1)
            setLoading(false)
        }
        catch(err){
            setLoading(false)
            if(err.message){
                toast.error(err.message.toString().substring(0, 30) + "...")
            }
            else{
                toast.error(ERRORS.somethingError)
            }
        }
    }
    const handleGetHeroOfAccount = async () => {
        try{
            setLoading(true)
            const heroesOfAccount = await contractSigner?.getHeroesOfAccount();
            setcontracts(heroesOfAccount)
            toggleTabs(2)
            setLoading(false)
        }
        catch(err){
            setLoading(false)
            if(err.message){
                toast.error(err.message.toString().substring(0, 30) + "...")
            }
            else{
                toast.error(ERRORS.somethingError)
            }
        }
    }

    useEffect(() => {
        if(typeof window.ethereum !== 'undefined'){
            getHeroFiMetamask();
            getAddressMetamask();
        }
        if(!sessionStorage.getItem('isMetamask')){
            toast.warning('You need reload page and you must logged in')
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const onShowSizeChange = (current, pageSize) => {
        setPageSize(pageSize)
    }
    const showTotal = (total) => {return(<>{`${total} items`}</>)}
    return (
        <>
            <div className='title'>
                <div className='logo_title'>
                    <img alt='' src='/blockchain.png' />
                    <h2 style={{textTransform:'uppercase', letterSpacing: 1}}>Contract API</h2>
                </div>
                {hidden ? "Your address wallet: " + address : (
                    <Button type='primary' onClick={handleConnectMetamask}>
                        Connect Metamask    
                    </Button>
                    )
                }
            </div>
            {/* Form Add heros */}
            <div className='heroes'>
                <FormAdd 
                    onChange={onChange} 
                    fileUrl={fileUrl} 
                    contract={contractSigner}
                    handleGetHeroOfAccount={handleGetHeroOfAccount}
                    isSize={isSize}
                />
                <div className='listheroes'>
                    <div className='btn_hero'>
                        <button type='text' className={`tabs ${getActiveClass(1, "active-tabs")}`} onClick={handleGetALLHero}>All heroes</button>
                        <button type='text' className={`tabs ${getActiveClass(2, "active-tabs")}`} onClick={handleGetHeroOfAccount}>My heroes</button>
                        <ClipLoader css="display: block; top: 50%; left: 50%; z-index: 100; position: absolute;" loading={loading} />
                    </div>
                    <Listhero 
                        contracts={contractsPagesize} 
                        contractSigner={contractSigner} 
                        address={address} 
                        handleGetHeroOfAccount={handleGetHeroOfAccount}
                    />
                </div>
            </div>
            <Pagination
                showSizeChanger
                onShowSizeChange={onShowSizeChange}
                defaultCurrent={currentPage}
                current={currentPage}
                pageSize={pageSize}
                onChange={page => setCurrentPage(page)}
                total={contracts.length}
                showTotal={showTotal}
                className="pagination"
                pageSizeOptions={[8, 10, 20, 50, 100]}
            />
            <ToastContainer
              autoClose={2000}
              hideProgressBar
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss={false}
              draggable
              pauseOnHover={false}
            />        
        </>
    );
};
export default FormSizeDemo;