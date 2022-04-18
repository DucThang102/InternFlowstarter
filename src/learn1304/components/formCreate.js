import { Button, Col, Form, Input, Row, Select } from 'antd';
import React from 'react';
import {SEX, GENERATION, HERO_CLASS, STAR } from '../constant/index.js'

const { Option } = Select

const FormCreate = (props) => {
	const {onFinish, handleChangeAvatar, formCreate}=props
	return (
		<>
			<Row>
				<Form
					className='form_create'
					onFinish={onFinish}
					layout="vertical"
					autoComplete="off"
					// initialValues={{
					// 	avatar: '',
					// 	class: '',
					// 	generation: '',
					// 	sex: '',
					// 	star: ''
					// }}
					form={formCreate}
				>
				<Col span={24}>
					<Form.Item
						name="avatar"
						label='Avatar'
					>
						<Input type={'file'} onChange={handleChangeAvatar} accept=".jpg, .png" />
					</Form.Item>
				</Col>
				<Col span={24}>
					<Form.Item
						name="class"
						label='Class'
						rules={[{ required: true, message: 'Please select class' }]}
					>
						<Select
							style={{ width: '100%' }}
							placeholder="CLASS"
						>
							{HERO_CLASS.map(item => (
								<Option key={item?.value} value={item?.value}>{item?.label}</Option>
							))}
						</Select>
					</Form.Item>
				</Col>
				<Col span={24}>
					<Form.Item
						name="sex"
						label='Sex'
						rules={[{ required: true, message: 'Please select sex' }]}
					>
						<Select
							style={{ width: '100%' }}
							placeholder="SEX"
						>
							{SEX.map(item => (
								<Option key={item?.value} value={item?.value}>{item?.label}</Option>
							))}
						</Select>
					</Form.Item>
				</Col>
				<Col span={24}>
					<Form.Item
						name="generation"
						label='Generation'
						rules={[{ required: true, message: 'Please select generation' }]}
					>
						<Select
							placeholder="GENERATION"
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
						name="star"
						label='Star'
						rules={[{ required: true, message: 'Please select star' }]}
					>
						<Select
							placeholder="STAR"
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