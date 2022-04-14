import { Button } from 'antd';
import React, { useEffect, useState } from 'react';
import FormAdd from './components/formadd/form';
import Listhero from './components/listhero/listhero';
import { ethers } from 'ethers';
import herofi from './apicontract/HeroFi.json';
import {create} from 'ipfs-http-client';
import {ClipLoader} from 'react-spinners';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { somethingError } from './constanst/index';

const client = create('https://ipfs.infura.io:5001/api/v0');

const FormSizeDemo = () => {
    const [address, setAddress] = useState();
    const [contracts, setcontracts] = useState([]);
    const [fileUrl, updateFileUrl] = useState('')
    const [loading, setLoading] = useState(false);
    const [hidden, setHidden] = useState(false)
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = new ethers.Contract(process.env.REACT_APP_API_CONTRACT, herofi?.abi, provider);
    const signer = provider.getSigner()
    const contractSigner = new ethers.Contract(process.env.REACT_APP_API_CONTRACT, herofi?.abi, signer);
    async function onChange(e) {
        const file = e.target.files[0]
        try {
          const added = await client.add(file)
          const url = `https://ipfs.infura.io/ipfs/${added.path}`
          updateFileUrl(url)
        } catch (error) {
          console.log('Error uploading file: ', error)
        }  
    }

    const getAddressMetamask = async () => {
        try{
            const signer = provider.getSigner();
            setAddress(await signer.getAddress());
        }
        catch(err){
            if(err.message){
                toast.error(err.message.toString().substring(0, 30) + "...")
            }
            else{
                toast.error(somethingError)
            }
        }
    }
    const getHeroFiMetamask = async () => {
        try{
        setLoading(true)
        const cHerifi = await contract?.getAllHeroes()
        setcontracts(await cHerifi)
        setLoading(false)
        }
        catch(err){
            setLoading(false)
            if(err.message){
                toast.error(err.message.toString().substring(0, 30) + "...")
            }
            else{
                toast.error(somethingError)
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
                toast.error(somethingError)
            }
        }
    }

    const handleGetALLHero = async () => {
        try{
            setLoading(true)
            const heroesAll = await contractSigner?.getAllHeroes();
            setcontracts(heroesAll)
            setLoading(false)
        }
        catch(err){
            setLoading(false)
            if(err.message){
                toast.error(err.message.toString().substring(0, 30) + "...")
            }
            else{
                toast.error(somethingError)
            }
        }
    }
    const handleGetHeroOfAccount = async () => {
        try{
            setLoading(true)
            const heroesOfAccount = await contractSigner?.getHeroesOfAccount();
            setcontracts(heroesOfAccount)
            setLoading(false)
        }
        catch(err){
            setLoading(false)
            if(err.message){
                toast.error(err.message.toString().substring(0, 30) + "...")
            }
            else{
                toast.error(somethingError)
            }
        }
    }

    useEffect(() => {
        getAddressMetamask();
        getHeroFiMetamask();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
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
                />
                <div className='listheroes'>
                    <div className='btn_hero'>
                        <Button className='btn_all' onClick={handleGetALLHero}>All heroes</Button>
                        <Button className='btn_my' onClick={handleGetHeroOfAccount}>My heroes</Button>
                        <ClipLoader css="display: block; top: 50%; left: 50%; z-index: 100; position: absolute;" loading={loading} />
                    </div>
                    <Listhero 
                        contracts={contracts} 
                        contractSigner={contractSigner} 
                        address={address} 
                        handleGetHeroOfAccount={handleGetHeroOfAccount}
                    />
                </div>
            </div>
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