import React, { memo, useState } from "react";
import { Button, Form, Input, Select, useForm } from "antd";
import { create } from 'ipfs-http-client'
// import { contractSigner } from "../../App";
import Loader from "../loader/loader";
import ClipLoader from 'react-spinners/ClipLoader'
import { toast } from 'react-toastify';

const client = create('https://ipfs.infura.io:5001/api/v0')

const sex = [
    { label: "Male", value: 0 },
    { label: "Female", value: 1 }
]

const generation = [
    { label: "GENESIS", value: 0 },
    { label: "NORMAL", value: 1 }
]

const heroClass = [
    { label: "WATER", value: 0 },
    { label: "PLANT", value: 1 },
    { label: "FIRE", value: 2 },
    { label: "THUNDER", value: 3 },
    { label: "DARK", value: 4 },
    { label: "LIGHT", value: 5 }
]

const star = [
    { label: "ONE", value: 0 },
    { label: "TO", value: 1 },
    { label: "THREE", value: 2 },
    { label: "FOUR", value: 3 },
    { label: "FIVE", value: 4 },
    { label: "SIX", value: 5 }
]

const CreateHero = ({ getMyHeroesContract, setIsLoading, contractSigner }) => {
    const [fileURL, setFileURL] = useState()
    const [status, setStatus] = useState(false)

    console.log('vao day')

    const onFinish = async (value) => {
        setIsLoading(true)
        setStatus(true)
        const hero = {
            ...value,
            avatar: fileURL
        }
        try {
            const res = await contractSigner.createHero(hero.avatar, hero.class, hero.sex, hero.generation, hero.star)
            const tx = await res.wait()
            getMyHeroesContract()
            setIsLoading(false)
            setStatus(false)
            toast.success('Success')
        } catch (error) {
            setIsLoading(false)
            setStatus(false)
            console.log(error)
            toast.error('error')
        }
    }

    const renderOption = (value) => {
        return (
            <Select >
                {
                    value.map((item, index) => (
                        <Select.Option key={index} value={item.value}>{item.label}</Select.Option>
                    ))
                }
            </Select>
        )
    }

    const onChangeFile = async (e) => {
        const file = e.target.files[0]
        try {
            const added = await client.add(file)
            const url = `https://ipfs.infura.io/ipfs/${added.path}`
            setFileURL(url)
        } catch (error) {
            console.log('Error uploading file: ', error)
            toast.error('error')
        }
    }

    return (
        <div>
            <Form
                labelCol={{
                    span: 14,
                }}
                wrapperCol={{
                    span: 22,
                }}
                layout="vertical"
                onFinish={onFinish}
                initialValues={{
                    class: heroClass[0].value,
                    sex: sex[0].value,
                    generation: generation[0].value,
                    star: star[0].value,
                }}
                size='large'
            >
                <Form.Item label="Avatar">
                    <Input type="file" onChange={onChangeFile} />
                </Form.Item>

                <Form.Item label="Class" name="class">
                    {renderOption(heroClass)}
                </Form.Item>
                <Form.Item label="Sex" name="sex">
                    {renderOption(sex)}
                </Form.Item>
                <Form.Item label="Generation" name="generation">
                    {renderOption(generation)}
                </Form.Item>
                <Form.Item label="star" name="star">
                    {renderOption(star)}
                </Form.Item>

                <Button size='large' type="primary" htmlType="submit" style={{ minWidth: 130 }} >{status ? <ClipLoader size={20} color={'#fff'} /> : 'Create Hero'}</Button>
            </Form>
        </div>
    )
}

export default memo(CreateHero);