import React, { useState } from 'react'
import { Button, Card, Input, Modal } from 'antd';

const SEX = [
	{
		label: 'Male',
		value: 0
	},
	{
		label: 'Female',
		value: 1
	}
]



const CardHero = (props) => {
	const { data, handleTransfer } = props
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
	
	const renderSex = (value) => {
		return (SEX.filter(item => item.value === value))[0].label
	}

	return (
		<>
			{data?.length > 0 && data.map((hero, index) => (
				<>
					<Card
						className='card_style'
						key={index}
					>
						<div className='card_image'>
							<img className='card_avatar' alt="example" src={hero?.avatar} />
						</div>
						<div className='card_content'>
							<p>Class: {hero?.class}</p>
							<p>Sex: {hero.sex}</p>
							<p>Generation: {hero?.generation}</p>
							<p>Star: {hero?.star}</p>
						</div>
						<div className='card_bottom'>
							<Button onClick={() => onHandleTransfer(hero)}>Transfer</Button>
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