import React from 'react'
import { assets } from '../assets/assets';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {

    const navigate=useNavigate();

    return (
        <div className='bg-blue-200 w-full flex justify-between item-center p-4 sm:p-6 sm:px-24 absolute top-0'>
            <img src={assets.logo_icon} className='w-16 sm:w-20'></img>
            <button onClick={()=>navigate('/login')} className='items-center gap-2 border border-black-500 rounded-lg px-6 text-gray-800 text-2xl hover:bg-blue-300 transition-all cursor-pointer'>Login →</button>
        </div>
    )
}

export default Navbar;
