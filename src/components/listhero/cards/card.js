import React from 'react';
import { Card, Image } from 'antd';
import ModalTransfer from '../modal/modal';

const Cards = ({contracts, contractSigner, address, handleGetHeroOfAccount}) => {
    return (
        <>
            {contracts.map((con, index) => (
            <Card className='card' key={index} hoverable>
                <Image className='img_cards' src={con?.avatar} />
                <div>{`CLASS: ${con?.class}`}</div>
                <div>{`SEX: ${con?.sex}`}</div>
                <div>{`GENARATION: ${con?.generation}`}</div>
                <div>{`STAR: ${con?.star}`}</div>
                <ModalTransfer 
                    contracts={con} 
                    contractSigner={contractSigner} 
                    address={address} 
                    handleGetHeroOfAccount={handleGetHeroOfAccount}
                />
            </Card>
            ))}
        </>
    );
}

export default Cards;