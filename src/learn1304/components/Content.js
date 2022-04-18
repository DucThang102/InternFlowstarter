import { Button, Pagination, Radio } from 'antd';
import React from 'react';
import CardHero from './card';
import {Tabs} from '../constant/index.js'


const Content = (props) => {
	const {
		getAllHeroes,
		getMyHeroes,
		isConnect,
		addressMeta,
		handleConnectMetaMask,
		heros,
		handleTransfer,
		currentPage,
		pageSize,
		total,
		handleChangePage
		}=props

	const handleChange =(e)=>{
		if(e.target.value === 'All Heroes'){
			getAllHeroes()
		}else{
			getMyHeroes()
		}
	}
	return (
		<>
			<div className='content_top'>
				<div className='btn_left'>
					<Radio.Group defaultValue='All Heroes' onChange={handleChange}>
					{ Tabs.map(tab => (
							<Radio.Button value={tab}>{tab}</Radio.Button>
					))}
					</Radio.Group>
				</div>
				{
					isConnect
						? <p className='address'>{addressMeta}</p>
						: <Button type='danger' onClick={handleConnectMetaMask}>Connect MetaMask</Button>
				}
			</div>
			{heros && heros.length > 0 && 
				<>
					<div className='content_list'>
						<CardHero data={heros} handleTransfer={handleTransfer} isConnect={isConnect} />
					</div>
					<Pagination
						total={total}
						current={currentPage}
						pageSize={pageSize}
						onChange={handleChangePage}
						showSizeChanger={false}
						showTotal={total => `Total ${total} items`}
					/>
				</>
			}
		</>
	)
}
export default Content