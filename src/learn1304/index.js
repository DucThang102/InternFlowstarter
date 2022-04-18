import React, { useEffect, useState } from 'react';
import { Row, Col, Spin, notification } from 'antd';
import './styles/styles.css';
import FormCreate from './components/formCreate';
import Content from './components/Content';
import HeroFi from './contracts/HeroFi.sol/HeroFi.json'
import { ethers } from 'ethers';
import { create } from 'ipfs-http-client'
// import { api } from './api/index.js';

const CONTRACT_TYPE = '0x7575c71C24091954d219d59E3513b59f8F8a552f'
const client = create('https://ipfs.infura.io:5001/api/v0')
const openNotificationWithIcon = (type, message) => {
	notification[type]({
		message: message,
	});
};
const AppDemo = () => {
	const [loading, setLoading] = useState(false)
	const [isConnect, setIsConnect] = useState(false)
	const [addressMeta, setAddressMeta] = useState('')
	const [heros, setHeros] = useState([])
	let provider;
	let signer;
	if (window.ethereum) {
		provider = new ethers.providers.Web3Provider(window.ethereum)

		signer = provider.getSigner()
	}
	
	useEffect(() => {
		if (window.ethereum) {
			getAllHeroes()
		} else {
			openNotificationWithIcon('info', 'Please install MetaMask')
		}
	}, [])
	const getAddressContract = async () => {
		if (signer) {
			setLoading(true)
			try {
				await provider.send("eth_requestAccounts", []);
				const address = await signer.getAddress()
				setAddressMeta(address)
				setIsConnect(true)
			} catch (error) {
				openNotificationWithIcon('error', 'Please try again')
			}
			setLoading(false)
		} else {
			openNotificationWithIcon('info', 'Please install MetaMask')
			window.open('https://metamask.io/', '_blank')
		}
	}
	const handleConnectMetaMask = () => {
		getAddressContract()
	}
	const getAllHeroes = async () => {
		if (provider) {
			setLoading(true)
			try {
				console.log('pro',provider)
				let contract = new ethers.Contract(CONTRACT_TYPE, HeroFi.abi, provider)
				let netWork = new ethers.providers.getNetwork(4)
				const dataAll = await contract.getAllHeroes()
				setHeros(dataAll)
				setLoading(false)
			} catch (error) {
				openNotificationWithIcon('error', 'Please try again')
			}
		} else {
			window.open('https://metamask.io/', 'blank')
		}
	}
	const getMyHeroes = async () => {
		if (signer) {
			setLoading(true)
			try {
				let contract = new ethers.Contract(CONTRACT_TYPE, HeroFi.abi, signer)
				const myData = await contract.getHeroesOfAccount()
				if (myData?.length === 0) {
					openNotificationWithIcon('info', 'You have no heroes')
				}
				setHeros(myData)
			} catch (error) {
				openNotificationWithIcon('error', 'Please try again')
			}
			setLoading(false)
		} else {
			openNotificationWithIcon('info', 'You have no heroes')
		}
	}
	/////
	const [fileUrl, updateFileUrl] = useState(``)
	const onFinish = async (values) => {
		if (signer) {
			const hero = {
				...values,
				avatar: fileUrl
			}
			setLoading(true)
			try {
				let contract = new ethers.Contract(CONTRACT_TYPE, HeroFi.abi, signer)
				const isCreate = await contract.createHero(hero.avatar, hero.class, hero.generation, hero.sex, hero.star)
				const tx = await isCreate.wait()
				console.log(tx);
				if (tx?.status === 1) {
					getAllHeroes()
					setLoading(false)
					openNotificationWithIcon('success', 'Create Hero success')
				} else {
					console.log('error')
					setLoading(false)
					openNotificationWithIcon('error', 'Failure, please try again')
				}
			} catch (error) {
				setLoading(false)
				openNotificationWithIcon('error', 'Failure, please try again')
			}
		} else {
			openNotificationWithIcon('error', 'Failure, please try again')
		}
	}
	const handleChangeAvatar = async (info) => {
		const file = info.target.files[0]
		try {
			const added = await client.add(file)
			const url = `https://ipfs.infura.io/ipfs/${added.path}`
			updateFileUrl(url)
		} catch (error) {
			openNotificationWithIcon('error', 'Error uploading file, please try again')
		}
	}
	/////transfer
	const handleTransfer = async (value, heroId) => {
		if (isConnect) {
			setLoading(true)
			let contract = new ethers.Contract(CONTRACT_TYPE, HeroFi.abi, signer)
			try {
				const isTransfer = await contract.transferHero(addressMeta, value, heroId)
				const transferring = await isTransfer.wait()
				console.log('tran', transferring)
				getMyHeroes()
			} catch (error) {
				openNotificationWithIcon('error', 'Transfer failure, please try again')
			}
			setLoading(false)
		}
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