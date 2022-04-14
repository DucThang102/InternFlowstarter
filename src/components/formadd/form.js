import { Button, Col, Form, Input, Select } from 'antd';
import React, { useState } from 'react';
import {sex, generation, heroClass, start, somethingError} from '../../constanst/index';
// import { ClipLoader } from 'react-spinners';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const {Option} = Select
const FormAdd = ({onChange, fileUrl, contract, handleGetHeroOfAccount}) => {
    const [loading, setLoading] = useState(false);
    const [formCreateHero] = Form.useForm()
    const handleCreateHero = async (values) => {
        const hero = {
            ...values,
            avatar: fileUrl
        }
        try{
            setLoading(true)
            const res = await contract.createHero(
                hero.avatar, 
                hero.heroClass, 
                hero.sex, 
                hero.generation, 
                hero.star
            )
            await res.wait()
            handleGetHeroOfAccount();
            if(await res.wait()){
                toast.success('success')
            }
            setLoading(false)
            formCreateHero.resetFields()
        }catch(err){
            if(err.message){
                toast.error(err.message.toString().substring(0, 30) + "...")
            }
            else{
                toast.error(somethingError)
            }
            setLoading(false)
        }
    }
    return (
    <Col xs={24} md={6} sm={6}>
        <Form layout="vertical" onFinish={handleCreateHero} form={formCreateHero}>
            <Form.Item 
                label="Avatar"
                name="avatar"
                rules={[{ required: true, message: 'Please choose avatar!' }]}
            >
                <Input className="custom-file-input" onChange={onChange} type='file' />
            </Form.Item>
            <Form.Item 
                label="Class" 
                name='heroClass'
                rules={[{ required: true, message: 'Please input heroClass!' }]}
            >
                <Select placeholder='CLASS'>
                    {heroClass.map((h, index) => (
                        <Option key={index} value={h?.value}>{h?.label}</Option>
                    ))}
                </Select>
            </Form.Item>
            <Form.Item 
                label="Sex" 
                name='sex'
                rules={[{ required: true, message: 'Please input sex!' }]}
            >
                <Select placeholder='SEX'>
                    {sex.map((s, index) => (
                        <Option key={index} value={s?.value}>{s?.label}</Option>
                    ))}
                </Select>
            </Form.Item>
            <Form.Item 
                label="Genaration" 
                name='generation'
                rules={[{ required: true, message: 'Please input generation!' }]}
            >
                <Select placeholder='GENARATION'>
                    {generation.map((g, index) => (
                        <Option key={index} value={g?.value}>{g?.label}</Option>
                    ))}
                </Select>
            </Form.Item>
            <Form.Item 
                label="Star" 
                name='star'
                rules={[{ required: true, message: 'Please input star!' }]}
            >
                <Select placeholder='STAR'>
                    {start.map((s, index) => (
                        <Option key={index} value={s?.value}>{s?.label}</Option>
                    ))}
                </Select>
            </Form.Item>
            <Form.Item>
                <Button 
                    type='primary' 
                    htmlType='submit' 
                    loading={loading ? true : false}
                    style={{width: 150, height: 50, borderRadius: 5}}
                >
                    CREATE HERO
                </Button>
            </Form.Item>
        </Form>
        {/* <ClipLoader css="display: block; top: 50%; left: 50%; z-index: 100; position: absolute;" loading={loading} /> */}
    </Col>
    );
}

export default FormAdd;