import { Button, Col, Form, Input, Select } from 'antd';
import React from 'react';
import {sex, generation, heroClass, start} from '../../constanst/index';

const {Option} = Select
const FormAdd = ({onChange, fileUrl, contract, handleGetHeroOfAccount}) => {
    const handleCreateHero = async (values) => {
        const hero = {
            ...values,
            avatar: fileUrl
        }
        // console.log(hero);
        try{
            const res = await contract.createHero(
                hero.avatar, 
                hero.heroClass, 
                hero.sex, 
                hero.generation, 
                hero.star
            )
            await res.wait()
            handleGetHeroOfAccount();
        }catch(err){console.log(err)}
    }
    return (
    <Col xs={24} md={6} sm={6}>
        <Form layout="vertical" onFinish={handleCreateHero}>
            <Form.Item label="Avatar">
                <Input onChange={onChange} type='file' />
            </Form.Item>
            <Form.Item label="Class" name='heroClass'>
                <Select placeholder='CLASS'>
                    {heroClass.map((h, index) => (
                        <Option key={index} value={h?.value}>{h?.label}</Option>
                    ))}
                </Select>
            </Form.Item>
            <Form.Item label="Sex" name='sex'>
                <Select placeholder='SEX'>
                    {sex.map((s, index) => (
                        <Option key={index} value={s?.value}>{s?.label}</Option>
                    ))}
                </Select>
            </Form.Item>
            <Form.Item label="Genaration" name='generation'>
                <Select placeholder='GENARATION'>
                    {generation.map((g, index) => (
                        <Option key={index} value={g?.value}>{g?.label}</Option>
                    ))}
                </Select>
            </Form.Item>
            <Form.Item label="Star" name='star'>
                <Select placeholder='STAR'>
                    {start.map((s, index) => (
                        <Option key={index} value={s?.value}>{s?.label}</Option>
                    ))}
                </Select>
            </Form.Item>
            <Form.Item label="Button">
                <Button type='primary' htmlType='submit'>Create Hero</Button>
            </Form.Item>
        </Form>
    </Col>
    );
}

export default FormAdd;