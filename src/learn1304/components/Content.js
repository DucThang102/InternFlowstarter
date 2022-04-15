import { Button } from 'antd';
import React from 'react';
import CardHero from './card';

const Tabs = ['All Heroes','My Heroes']
const Content = (props) => {
	const {
		getAllHeroes,
		getMyHeroes,
		isConnect,
		addressMeta,
		handleConnectMetaMask,
		heros,
		handleTransfer
		}=props
	return (
		<>
			<div className='content_top'>
				<div className='btn_left'>
					<Button
						onClick={getAllHeroes}
					>
						{Tabs[0]}
					</Button>
					<Button
						onClick={getMyHeroes}
					>
						{Tabs[1]}
					</Button>
				</div>
				{
					isConnect
						? <p>{addressMeta}</p>
						: <Button type='danger' onClick={handleConnectMetaMask}>Connect MetaMask</Button>
				}
			</div>
			<div className='content_list'>
				<CardHero data={heros} handleTransfer={handleTransfer} isConnect={isConnect} />
			</div>
		</>
	)
}
export default Content