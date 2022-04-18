import React, { useEffect, useState } from 'react';
import { Row, Col, Spin, notification } from 'antd';
import './styles/styles.css';
import FormCreate from './components/formCreate';
import Content from './components/Content';
import HeroFi from './contracts/HeroFi.sol/HeroFi.json'
import { ethers } from 'ethers';
import { create } from 'ipfs-http-client'
import { useForm } from 'antd/lib/form/Form';
// import { api } from './api/index.js';

const CONTRACT_TYPE = '0x7575c71C24091954d219d59E3513b59f8F8a552f'
const client = create('https://ipfs.infura.io:5001/api/v0')
const MAX_SIZE = 1 * 10 ** 6
const openNotificationWithIcon = (type, message) => {
	notification[type]({
		message: message,
	});
};
const AppDemo = () => {
	const [formCreate] = useForm()
	const [loading, setLoading] = useState(false)
	const [isConnect, setIsConnect] = useState(false)
	const [addressMeta, setAddressMeta] = useState('')
	const [heros, setHeros] = useState([])
	const [total, setTotal] = useState(0)
	const [currentPage, setCurrentPage] = useState(1)
	const [pageSize, setpageSize] = useState(10)
	const [listHeroPage, setListHeroPage] = useState([])
	const [isReady, setIsReady] = useState(false)
	let provider;
	let signer;
	if (window.ethereum) {
		provider = new ethers.providers.Web3Provider(window.ethereum)
		signer = provider.getSigner()
	}
	useEffect(() => {
		if (window.ethereum) {
			getAllHeroes()
			getAddressContract()
		} else {
			openNotificationWithIcon('info', 'Please install MetaMask')
			window.open('https://metamask.io/', 'blank')
		}
	}, [])
	useEffect(() => {
		getPageList()
	}, [currentPage, heros])

	const getPageList = () => {
		const offset = (currentPage - 1) * pageSize
		const limit = currentPage * pageSize
		setListHeroPage(heros.slice(offset, limit))
	}
	const handleChangePage = (page) => {
		setCurrentPage(page)
	}
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
			openNotificationWithIcon('info', 'Please install MetaMask');
			window.open('https://metamask.io/', 'blank')
		}
	}
	const handleConnectMetaMask = () => {
		getAddressContract()
	}
	const getAllHeroes = async () => {
		setCurrentPage(1)
		if (provider) {
			setLoading(true)
			try {
				// console.log('pro',provider)
				let contract = new ethers.Contract(CONTRACT_TYPE, HeroFi.abi, provider)
				// let netWork = new ethers.providers.getNetwork(4)
				const dataAll = await contract.getAllHeroes()
				setHeros(dataAll)
				setTotal(dataAll?.length)
				setLoading(false)
			} catch (error) {
				openNotificationWithIcon('error', 'Please try again')
			}
		} else {
			window.open('https://metamask.io/', 'blank')
		}
	}
	const getMyHeroes = async () => {
		setCurrentPage(1)
		if (signer) {
			setLoading(true)
			try {
				let contract = new ethers.Contract(CONTRACT_TYPE, HeroFi.abi, signer)
				const myData = await contract.getHeroesOfAccount()
				if (myData?.length === 0) {
					openNotificationWithIcon('info', 'You have no heroes')
				}
				setHeros(myData)
				setTotal(myData?.length)
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
		if (isReady) {
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
						formCreate.resetFields()
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
		} else {
			openNotificationWithIcon('info', 'Failure, please reselect Avatar')
		}
	}
	const handleChangeAvatar = async (info) => {
		const file = info.target.files[0]
		const sizeAvatar = file.size
		if (sizeAvatar < MAX_SIZE) {
			setIsReady(true)
			try {
				const added = await client.add(file)
				const url = `https://ipfs.infura.io/ipfs/${added.path}`
				updateFileUrl(url)
			} catch (error) {
				openNotificationWithIcon('error', 'Error uploading file, please try again')
			}
		} else {
			setIsReady(false)
			openNotificationWithIcon('info', 'file size is too big please choose again')
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
						<FormCreate onFinish={onFinish} handleChangeAvatar={handleChangeAvatar} formCreate={formCreate} />
					</Col>
					<Col xs={24} sm={16} md={16} lg={16}>
						<Content
							getAllHeroes={getAllHeroes}
							getMyHeroes={getMyHeroes}
							isConnect={isConnect}
							addressMeta={addressMeta}
							handleConnectMetaMask={handleConnectMetaMask}
							heros={listHeroPage}
							handleTransfer={handleTransfer}
							currentPage={currentPage}
							pageSize={pageSize}
							total={total}
							handleChangePage={handleChangePage}
						/>
					</Col>
				</Row>
			</div>
		</Spin>
	)
}
export default AppDemo