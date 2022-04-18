import React, { useState } from 'react'
import { Button, Card, Input, Modal } from 'antd';
import { SEX, GENERATION, HERO_CLASS, STAR } from '../constant/index.js'

const CardHero = (props) => {
	const { data, handleTransfer, isConnect } = props
	const [onTransfer, setOnTransfer] = useState(false)
	const [value, setValue] = useState('')
	const [heroTransfer, setHeroTransfer] = useState()
	const onHandleTransfer = (hero) => {
		setHeroTransfer(hero?.id)
		setValue('')
		setOnTransfer(true)
	}
	const handleOk = () => {
		setOnTransfer(false);
		handleTransfer(value, heroTransfer)
	};

	const handleCancel = () => {
		setOnTransfer(false);
	};
	
	const getDetail = (type, value) => {
		return (type.find(item => item?.value === value)).label
	}
	return (
		<>
			{data?.length > 0 && data.map((hero, index) => (
				<>
					<Card
						hoverable
						className='card_style'
						key={index}
					>
						<div className='content_card'>
							<div className='card_image'>
								<img className='card_avatar' alt="example" src={hero?.avatar} />
							</div>
							<div className='card_content'>
								<p>Class: {getDetail(HERO_CLASS,hero?.class)}</p>
								<p>Sex: {getDetail(SEX,hero.sex)}</p>
								<p>Generation: {getDetail(GENERATION,hero?.generation)}</p>
								<p>Star: {getDetail( STAR,hero?.star)}</p>
							</div>
							{
								isConnect 
								&&
								<div className='card_bottom'>
									<Button onClick={() => onHandleTransfer(hero)}>Transfer</Button>
								</div>
							}
						</div>
					</Card>
				</>
			))}
			<Modal
				title="Transfer"
				visible={onTransfer}
				onOk={handleOk}
				onCancel={handleCancel}
				okText="transfer"
			>
				<Input
					type={'text'}
					value={value}
					onChange={(e) => setValue(e.target.value)}
				/>
			</Modal>
		</>
	)
}
export default CardHero;