import React from 'react';
import Card from './cards/card';

const Listhero = ({contracts, contractSigner, address, handleGetHeroOfAccount}) => {
    return (
        <div className='lists'>
            <Card 
                contracts={contracts} 
                contractSigner={contractSigner} 
                address={address} 
                handleGetHeroOfAccount={handleGetHeroOfAccount}
            />
        </div>
    );
}

export default Listhero;