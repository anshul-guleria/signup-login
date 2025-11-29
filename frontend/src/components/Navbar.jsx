import React, { useContext } from 'react'
import { assets } from '../assets/assets';
import { useNavigate } from 'react-router-dom';
import { AppContent } from '../context/AppContext';
import { toast } from 'react-toastify';
import axios from 'axios';

const Navbar = () => {

    const navigate=useNavigate();

    const {userData, backendURL, setUserData, setIsLoggedIn} = useContext(AppContent)

    const logout = async() => {
        try {
            axios.defaults.withCredentials=true;

            const {data} = await axios.post(backendURL + '/api/auth/logout')
            data.success && setIsLoggedIn(false)
            data.success && setUserData(false)
            toast.success("Logged out successfully!")
            navigate('/')
        }
        catch(error) {
            toast.error(error.message)
        }

    }

    const sendVerificationOtp = async()=> {
        try{
            axios.defaults.withCredentials=true;

            const {data} =await axios.post(backendURL+'/api/auth/send-verify-otp')

            if(data.success) {
                navigate('/email-verify')
                toast.success(data.message)
            }
            else {
                toast.error(data.message)
            }

        }
        catch(error) {
            toast.error(error.message)
        }
    }

    return (
        <div className='bg-blue-200 w-full flex justify-between item-center p-2 sm:p-6 sm:px-24 absolute top-0'>

            <img src={assets.logo_icon} className='w-16 sm:w-20'></img>
            {userData ? (
                <div className="w-10 h-10 mt-2 flex justify-center items-center rounded-full bg-green-900 text-white relative group">
                    {userData.name[0].toUpperCase()}
                    <div className='absolute w-30 hidden group-hover:block top-0 right-0 z-10 text-black rounded pt-10'>
                        <ul className='list-none m-0 p-2 bg-gray-100 text-sm'>
                            {!userData.verified && (<li onClick={sendVerificationOtp} className='py-1 px-2 hover:bg-gray-200 cursor-pointer'>Verify Email</li>)}
                            <li onClick={logout} className='py-1 px-2 hover:bg-gray-200 cursor-pointer'>Logout</li>
                        </ul>
                    </div>
                </div>
            ):
            (
                <button onClick={()=>navigate('/login')} className='items-center gap-2 border border-black-500 rounded-lg px-6 text-gray-800 text-2xl hover:bg-blue-300 transition-all cursor-pointer'>Login →</button>
            )}
            
        </div>
    )
}

export default Navbar;
