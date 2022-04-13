import { Button, Input, Modal } from 'antd';
import React, { useState } from 'react';

const ModalTransfer = ({contracts, contractSigner, address, handleGetHeroOfAccount}) => {
    const[value, setValue] = useState();
    const [isModalVisible, setIsModalVisible] = useState(false);

    const showModal = () => {
      setIsModalVisible(true);
    };

    const handleOk = async () => {
      const transfer = await contractSigner.transferHero(address, value, parseInt(contracts?.id))
      const r = await transfer.wait();
      console.log(r);
      handleGetHeroOfAccount();
      setIsModalVisible(false);
    };

    const handleCancel = () => {
      setIsModalVisible(false);
    };
    
    return (
        <div>
            <Button type='default' onClick={showModal}>Transfer</Button>
            <Modal 
                title="Basic Modal" 
                visible={isModalVisible} 
                onCancel={handleCancel} 
                onOk={handleOk}
                okText="Transfer"
            >
                <Input onChange={(e) => setValue(e.target.value)} placeholder='to wallet address' />
            </Modal>
        </div>
    );
}

export default ModalTransfer;