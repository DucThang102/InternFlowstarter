import React from 'react';
import { Card, Image } from 'antd';
import ModalTransfer from '../modal/modal';
import {generation, heroClass, sex, start} from '../../../constanst/index';

const Cards = ({contracts, contractSigner, address, handleGetHeroOfAccount}) => {
    return (
        <>
            {contracts.map((con, index) => (
            <Card className='card' key={index} hoverable>
                <Image className='img_cards' src={con?.avatar} />
                <div>{`CLASS: ${heroClass[con?.class].label}`}</div>
                <div>{`SEX: ${sex[con?.sex].label}`}</div>
                <div>{`GENARATION: ${generation[con?.generation].label}`}</div>
                <div>{`STAR: ${start[con?.star].label}`}</div>
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