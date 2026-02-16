import React from 'react'

const Error = ({ error }) => {
    return (
        // <div className='relative bg-[#2d0101] border border-black/5 p-5 rounded-xl w-2xs flex flex-col space-y-6 h-62'>
            <div className='flex items-center justify-center'>Error : {error}</div>
        //     <span className="w-full h-0.5 rounded-full bg-black/5 "></span>
        // </div>
    )
}

export default Error