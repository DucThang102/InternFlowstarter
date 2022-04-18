import React from "react";
import { Button, Card, Image } from 'antd';
import { TransactionOutlined, EllipsisOutlined } from '@ant-design/icons'
import { sex, heroClass, generation, star } from '../createHero/createHero'
const CardHero = ({ data, setIsModal, setCurrentHero, myHeroes }) => {

    const filterData = (data, ar) => {
        const result = ar.find(item => item.value === data)
        return result.label
    }
    const renderAction = () => {
        const x = myHeroes.find(item => parseInt(item.id) === parseInt(data.id))
        if (x) {
            return <TransactionOutlined key="Transfer" onClick={() => { setIsModal(true); setCurrentHero(data) }} style={{ fontSize: 25 }} />
        }
    }

    return (
        <div className="card">
            <Card
                style={{ width: 250 }}
                hoverable
                actions={[
                    renderAction(),
                    <EllipsisOutlined key="ellipsis" style={{ fontSize: 25 }} />,
                ]}

            >
                <Image width={'100%'} height={150} src={data?.avatar} />
                <div className="card-info">
                    <span>Class: </span>
                    <span>{filterData(data?.class, heroClass)}</span>
                </div>
                <div className="card-info">
                    <span>Sex: </span>
                    <span>{filterData(data?.sex, sex)}</span>
                </div>
                <div className="card-info">
                    <span>Generation: </span>
                    <span>{filterData(data?.generation, generation)}</span>
                </div>
                <div className="card-info">
                    <span>star: </span>
                    <span>{filterData(data?.star, star)}</span>
                </div>
            </Card>
        </div >
    )
}

export default CardHero;