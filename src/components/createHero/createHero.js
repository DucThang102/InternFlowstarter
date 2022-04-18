import React, { memo, useState } from "react";
import { Button, Form, Input, Select, Upload, useForm } from "antd";
import { create } from 'ipfs-http-client'
// import { contractSigner } from "../../App";
import Loader from "../loader/loader";
import ClipLoader from 'react-spinners/ClipLoader'
import { toast } from 'react-toastify';
import { UploadOutlined } from "@ant-design/icons";
import { validateNFTFileType } from "../../common/until";

const client = create('https://ipfs.infura.io:5001/api/v0')

export const sex = [
    { label: "Male", value: 0 },
    { label: "Female", value: 1 }
]

export const generation = [
    { label: "GENESIS", value: 0 },
    { label: "NORMAL", value: 1 }
]

export const heroClass = [
    { label: "WATER", value: 0 },
    { label: "PLANT", value: 1 },
    { label: "FIRE", value: 2 },
    { label: "THUNDER", value: 3 },
    { label: "DARK", value: 4 },
    { label: "LIGHT", value: 5 }
]

export const star = [
    { label: "ONE", value: 0 },
    { label: "TWO", value: 1 },
    { label: "THREE", value: 2 },
    { label: "FOUR", value: 3 },
    { label: "FIVE", value: 4 },
    { label: "SIX", value: 5 }
]

const CreateHero = ({ getMyHeroesContract, setIsLoading, contractSigner, setShowSider }) => {
    const [fileURL, setFileURL] = useState()
    const [status, setStatus] = useState(false)
    const [statusLoadImg, setStatusLoadImg] = useState('idle')

    const onFinish = async (value) => {
        if (statusLoadImg === 'done') {
            setIsLoading(true)
            setStatus(true)
            const hero = {
                ...value,
                avatar: fileURL
            }
            try {
                const res = await contractSigner.createHero(hero.avatar, hero.class, hero.sex, hero.generation, hero.star)
                const tx = await res.wait()
                console.log(1);
                await getMyHeroesContract()
                console.log(2);
                setIsLoading(false)
                setStatus(false)
                // setShowSider(false)
                toast.success('Create Successfully!')
            } catch (error) {
                console.log(3);
                setIsLoading(false)
                setStatus(false)
                toast.error('Create error')
            }
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

    const props = {
        name: 'file',
        headers: {
            authorization: 'authorization-text',
        },
        listType: "picture",
        maxCount: 1,
        beforeUpload(file) {
            if (!validateNFTFileType(file.type)) {
                toast.error('format file not support')
                return false
            }

            const fileSize = file.size / 1024 / 1024
            if (fileSize > 4) {
                toast.error('image must smaller than 4MB!')
                return false
            }
            return true
        },

        async customRequest(props) {

            const { file, onSuccess, onError } = props
            try {
                const added = await client.add(file)
                const url = `https://ipfs.infura.io/ipfs/${added.path}`
                setFileURL(url)
                onSuccess('ok')
                return url
            } catch (error) {
                toast.error('error')
                onError('false')

            }
        },

        onChange(info) {
            if (info.file.status !== 'uploading') {
                setStatusLoadImg('loading')
            }
            if (info.file.status === 'done') {
                toast.success(`${info.file.name} file uploaded successfully`);
                setStatusLoadImg('done')

            } else if (info.file.status === 'error') {
                toast.error(`${info.file.name} file upload failed.`);
                setStatusLoadImg('error')
            }
        },
    }

    return (
        <div>
            <h1 className="title-create">Create Herro</h1>
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
                <Form.Item
                    label="Avatar"
                    rules={[{ required: true, message: 'Please input your avatar!' }]}
                >
                    <Upload {...props} style={{ color: 'red' }}>
                        <Button icon={<UploadOutlined />}>Click to Upload</Button>
                    </Upload>
                    {/* {fileURL && <img src={fileURL} alt="avatar" style={{ width: '100%' }} /> } */}
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

                <Button size='large' type="primary" htmlType="submit" style={{ minWidth: 130 }} disabled={statusLoadImg!=='done'} >{status ? <ClipLoader size={20} color={'#fff'} /> : 'Create Hero'}</Button>
            </Form>
        </div >
    )
}

export default CreateHero;