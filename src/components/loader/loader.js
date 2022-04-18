import React from 'react';
import ClipLoader from 'react-spinners/ClipLoader'

const Loader = ({ color }) => {
    return (
        <div className='loader'>
            <ClipLoader size={50} color={color || '#4A90E2'} />
        </div>
    )
}

export default Loader;