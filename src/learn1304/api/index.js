import { ethers } from "ethers";
import HeroFi from '../contracts/HeroFi.sol/HeroFi.json'

const CONTRACT_TYPE = '0x7575c71C24091954d219d59E3513b59f8F8a552f'
const provider = new ethers.providers.Web3Provider(window.ethereum)
const signer = provider.getSigner()

const getAllHeroes = async () => {
	let contract = new ethers.Contract(CONTRACT_TYPE, HeroFi.abi, provider)
	const dataAll = await contract.getAllHeroes()
	return dataAll
}

const getAddressContract = async () => {
	const address = await signer.getAddress();
	return address
}

const getMyHeroes = async () => {
	let contract = new ethers.Contract(CONTRACT_TYPE, HeroFi.abi, signer)
	const myData = await contract.getHeroesOfAccount()
	return myData
}


export const api = {
	getAllHeroes,
	getAddressContract,
	getMyHeroes
}