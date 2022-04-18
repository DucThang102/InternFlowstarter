import { Button, Input, Modal } from 'antd';
import React, { useState } from 'react';
import { ClipLoader } from 'react-spinners';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ERRORS } from '../../../constanst/index';

const ModalTransfer = ({contracts, contractSigner, address, handleGetHeroOfAccount}) => {
    const[value, setValue] = useState();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [loading, setLoading] = useState(false);

    const showModal = () => {
      setIsModalVisible(true);
    };

    const handleOk = async () => {
      try{
        setLoading(true);
        const transfer = await contractSigner.transferHero(address, value, parseInt(contracts?.id))
        await transfer.wait();
        handleGetHeroOfAccount();
        setIsModalVisible(false);
        if(await transfer.wait()){
          toast.success('success')
        }
        setLoading(false)
      }
      catch(err){
        if(err.error){
          toast.error(err.error.message.toString().substring(0, 30) + "...");
        }else{
          toast.error(ERRORS.transferError);
        }
        setLoading(false)
      }
    };

    const handleCancel = () => {
      setIsModalVisible(false);
    };
    
    return (
        <div>
            {address && <Button type='default' onClick={showModal}>Transfer</Button>}
            <Modal 
                title="Transfer to address" 
                visible={isModalVisible} 
                onCancel={handleCancel} 
                onOk={handleOk}
                okText={loading ? <ClipLoader size={17} color='#fff' /> : 'Transfer'}
                className='model'
            >
                <Input value={value} onChange={(e) => setValue(e.target.value)} placeholder='to wallet address' />
            </Modal>
        </div>
    );
}

export default ModalTransfer;