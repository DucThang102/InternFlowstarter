import React, { useEffect, useState } from 'react';
import { Row, Col, Spin } from 'antd';
import './styles/styles.css';
import FormCreate from './components/formCreate';
import Content from './components/Content';
import HeroFi from './contracts/HeroFi.sol/HeroFi.json'
import { ethers } from 'ethers';
import { create } from 'ipfs-http-client'

const CONTRACT_TYPE = '0x7575c71C24091954d219d59E3513b59f8F8a552f'
const AppDemo = () => {
	const [loading, setLoading] = useState(false)
	const [isConnect, setIsConnect] = useState(false)
	const [addressMeta, setAddressMeta] = useState('')
	const [heros, setHeros] = useState([])
	const provider = new ethers.providers.Web3Provider(window.ethereum)
	const signer = provider.getSigner()
	const client = create('https://ipfs.infura.io:5001/api/v0')

	useEffect(() => {
		getAddress()
		getHeroes()
	}, [])
	const getAddress = async () => {
		setLoading(true)
		if (typeof window.ethereum !== 'undefined') {
			try {
				const address = await provider.send("eth_requestAccounts", []);
				const address1 = await signer.getAddress();
				setAddressMeta(address1)
				setIsConnect(true)
			} catch (error) {
				console.log(error)
			}
			setLoading(false)
		}else{
			setLoading(false)
		}
	}
	const handleConnectMetaMask = () => {
		getAddress()
	}
	const getHeroes = async () => {
		setLoading(true)
		try {
			let contract = new ethers.Contract(CONTRACT_TYPE, HeroFi.abi, provider)
			const dataAll = await contract.getAllHeroes()
			setHeros(dataAll)
			setLoading(false)
		} catch (error) {
			console.log(error)
			setLoading(false)
		}
	}
	const getAllHeroes = () => {
		getHeroes();
	}
	const getMyHeroes = async () => {
		setLoading(true)
		try {
			let contract = new ethers.Contract(CONTRACT_TYPE, HeroFi.abi, signer)
			const myData = await contract.getHeroesOfAccount()
			setHeros(myData)
			setLoading(false)
		} catch (error) {
			console.log(error)
			setLoading(false)
		}
	}
	/////
	const [fileUrl, updateFileUrl] = useState(``)
	const onFinish = async (values) => {
		console.log(values)
		const hero = {
			...values,
			Avatar: fileUrl
		}
		setLoading(true)
		try {
			let contract = new ethers.Contract(CONTRACT_TYPE, HeroFi.abi, signer)
			console.log(hero.Avatar, hero.Class, hero.Generation, hero.Sex, hero.Star)
			const isCreate = await contract.createHero(hero.Avatar, hero.Class, hero.Generation, hero.Sex, hero.Star)
			const tx = await isCreate.wait()
			console.log(tx);
			if(tx?.status === 1){
				getHeroes()
				setLoading(false)
			}else{
				console.log('error')
				setLoading(false)
			}
		} catch (error) {
			console.log(error)
			setLoading(false)
		}
	}
	const handleChangeAvatar = async (info) => {
		const file = info.target.files[0]
		try {
			const added = await client.add(file)
			const url = `https://ipfs.infura.io/ipfs/${added.path}`
			updateFileUrl(url)
		} catch (error) {
			console.log('Error uploading file: ', error)
		}
	}
	/////transfer
	const handleTransfer = async (value, heroId) => {
		setLoading(true)
		let contract = new ethers.Contract(CONTRACT_TYPE, HeroFi.abi, signer)
		try {
			const isTransfer = await contract.transferHero(addressMeta, value, heroId)
			const transferring = await isTransfer.wait() 
			console.log('tran',transferring)
			getMyHeroes()
		} catch (error) {
			console.log(error)
		}
		setLoading(false)
		
	}

	return (
		<Spin spinning={loading} tip="Loading...">
		<div className='layout'>
			<Row>
				<Col xs={24} sm={8} md={8} lg={8}>
					<FormCreate onFinish={onFinish} handleChangeAvatar={handleChangeAvatar} />	
				</Col>
				<Col xs={24} sm={16} md={16} lg={16}>
					<Content
						getAllHeroes={getAllHeroes}
						getMyHeroes={getMyHeroes}
						isConnect={isConnect}
						addressMeta={addressMeta}
						handleConnectMetaMask={handleConnectMetaMask}
						heros={heros}
						handleTransfer={handleTransfer}
					/>
				</Col>
			</Row>
		</div>
		</Spin>
	)
}
export default AppDemo