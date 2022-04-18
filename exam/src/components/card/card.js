import React from "react";
import { Button, Card, Image } from 'antd';
import {TransactionOutlined, EllipsisOutlined} from '@ant-design/icons'
const CardHero = ({ data, setIsModal, setCurrentHero }) => {
    return (
        <div className="card">
            <Card 
            style={{ width: 250 }}
            hoverable
            actions={[
                <TransactionOutlined key="Transfer" onClick={() =>{setIsModal(true); setCurrentHero(data)}} />,
                <EllipsisOutlined key="ellipsis" />,
              ]}
            
            >
                <Image width={'100%'} height={150} src={data?.avatar} />
                <div>Class: {data?.class}</div>
                <div>Sex: {data?.sex}</div>
                <div>Generation: {data?.generation}</div>
                <div>star: {data?.star}</div>
                {/* <Button type="primary" onClick={() =>{setIsModal(true); setCurrentHero(data)}}>Transfer</Button> */}
            </Card>
        </div >
    )
}

export default CardHero;