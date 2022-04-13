import { Button } from 'antd';
import React, { useEffect, useState } from 'react';
import FormAdd from './components/formadd/form';
import Listhero from './components/listhero/listhero';
import { ethers } from 'ethers';
import herofi from './apicontract/HeroFi.json';
import {create} from 'ipfs-http-client';
import {ClipLoader} from 'react-spinners';

const client = create('https://ipfs.infura.io:5001/api/v0');

const FormSizeDemo = () => {
    const [address, setAddress] = useState([]);
    const [contracts, setcontracts] = useState([]);
    const [fileUrl, updateFileUrl] = useState('')
    const [loading, setLoading] = useState(false);
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
        const signer = provider.getSigner();
        setAddress(await signer.getAddress());
    }
    const getHeroFiMetamask = async () => {
        setLoading(true)
        const cHerifi = await contract?.getAllHeroes()
        setcontracts(await cHerifi)
        setLoading(false)
    }

    const handleConnectMetamask = async () => {
        if (typeof window.ethereum !== 'undefined') {
            await provider.send("eth_requestAccounts", []);
            getAddressMetamask()
        }
        else{
            window.open(process.env.REACT_APP_URL_INSTALL_METAMASK, '_blank')
        }
    }

    const handleGetALLHero = async () => {
        setLoading(true)
        const heroesAll = await contractSigner?.getAllHeroes();
        setcontracts(heroesAll)
        setLoading(false)
    }
    const handleGetHeroOfAccount = async () => {
        setLoading(true)
        const heroesOfAccount = await contractSigner?.getHeroesOfAccount();
        setcontracts(heroesOfAccount)
        setLoading(false)
    }

    useEffect(() => {
        getAddressMetamask();
        getHeroFiMetamask();
    }, [])
    return (
        <>
            <div className='title'>
                <h2>Contract API</h2>
                {address ? <p>{address}</p> : (
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
                    setLoading={setLoading}
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
        </>
    );
};
export default FormSizeDemo;