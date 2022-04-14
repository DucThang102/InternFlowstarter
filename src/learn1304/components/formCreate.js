import { Button, Col, Form, Input, Row, Select } from 'antd';
import React from 'react';

const { Option } = Select
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
const GENERATION = [
	{
		label: 'GENESIS',
		value: 0
	},
	{
		label: 'NORMAL',
		value: 1
	},
]
const HERO_CLASS = [
	{
		label: 'WATER',
		value: 0
	},
	{
		label: 'PLANT',
		value: 1
	},
	{
		label: 'FIRE',
		value: 2
	},
	{
		label: 'THUNDER',
		value: 3
	},
	{
		label: 'DARK',
		value: 4
	},
	{
		label: 'LIGHT',
		value: 5
	}
]
const STAR = [
	{
		label: 'ONE',
		value: 0
	},
	{
		label: 'TWO',
		value: 1
	},
	{
		label: 'THREE',
		value: 2
	},
	{
		label: 'FOUR',
		value: 3
	},
	{
		label: 'FIVE',
		value: 4
	},
	{
		label: 'SIX',
		value: 5
	}
]

const FormCreate = (props) => {
	const {onFinish, handleChangeAvatar}=props
	return (
		<>
			<Row>
				<Form
					className='form_create'
					onFinish={onFinish}
					layout="vertical"
					autoComplete="off"
					initialValues={{
						Avatar: '',
						Class: HERO_CLASS[0].value,
						Generation: GENERATION[0].value,
						Sex: SEX[0].value,
						Star: STAR[0].value
					}}
				>
				<Col span={24}>
					<Form.Item
						name="Avatar"
						label='Avatar'
					>
						<Input type={'file'} onChange={handleChangeAvatar}/>
					</Form.Item>
				</Col>
				<Col span={24}>
					<Form.Item
						name="Class"
						label='Class'
					>
						<Select
							defaultValue={{ value: 'WATER' }}
							style={{ width: '100%' }}
						>
							{HERO_CLASS.map(item => (
								<Option key={item?.value} value={item?.value}>{item?.label}</Option>
							))}
						</Select>
					</Form.Item>
				</Col>
				<Col span={24}>
					<Form.Item
						name="Sex"
						label='Sex'
					>
						<Select
							style={{ width: '100%' }}
						>
							{SEX.map(item => (
								<Option key={item?.value} value={item?.value}>{item?.label}</Option>
							))}
						</Select>
					</Form.Item>
				</Col>
				<Col span={24}>
					<Form.Item
						name="Generation"
						label='Generation'
					>
						<Select
							defaultValue={{ value: 'GENESIS' }}
							style={{ width: '100%' }}
						>
							{GENERATION.map(item => (
								<Option key={item?.value} value={item?.value}>{item?.label}</Option>
							))}
						</Select>
					</Form.Item>
				</Col>
				<Col span={24}>
					<Form.Item
						name="Star"
						label='Star'
					>
						<Select
							defaultValue={{ value: 'ONE' }}
							style={{ width: '100%' }}
						>
							{STAR.map(item => (
								<Option key={item?.value} value={item?.value}>{item?.label}</Option>
							))}
						</Select>
					</Form.Item>
				</Col>
				<Col span={24} style={{ marginTop: '20px', marginBottom: '20px' }}>
					<Form.Item>
						<Button type="primary" htmlType="submit">
							Create Hero
						</Button>
					</Form.Item>
				</Col>
			</Form>
		</Row>
		</>
	)
}
export default FormCreate;