import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { AppContent } from '../context/AppContext';
import axios from 'axios'
import { toast } from 'react-toastify';

const Login = () => {
    const navigate=useNavigate();

    const {backendURL, setIsLoggedIn, getUserData}=useContext(AppContent)

    const [state,setState]=useState('Sign Up');
    const [name, setName]=useState('');
    const [email, setEmail]=useState('');
    const [password, setPassword]=useState('');
    
    const onSubmitHandler = async(e) => {
        try {
            e.preventDefault();
            
            axios.defaults.withCredentials=true

            if(state==='Sign Up') {
                const {data}=await axios.post(backendURL+'/api/auth/register', {name, email, password})

                if(data.success) {
                    setIsLoggedIn(true);
                    getUserData()
                    toast.success(data.message);
                    navigate('/')
                }
                else {
                    toast.error(data.message);
                }
            }
            else {
                const {data}=await axios.post(backendURL+'/api/auth/login', {email, password})

                if(data.success) {
                    setIsLoggedIn(true);
                    getUserData()
                    toast.success(data.message);
                    navigate('/')
                }
                else {
                    toast.error(data.message);
                }
            }
        }
        catch(error) {
            toast.error(error.message);
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen px-6 bg-gradient-to-br from-blue-200 to-purple-400">
            <div className='flex flex-col text-center justify-content'>
                <h2 className='text-4xl font-semibold mb-10'>{state==="Sign Up" ? "Create account" : "Login"}</h2>
                <p className='mb-5'>{state==="Sign Up" ? "Create your account" : "Login to your account"}</p>
                
                <form onSubmit={onSubmitHandler}>
                    {state==='Sign Up' && (
                        <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-white">
                        Name: <input onChange={e=>setName(e.target.value)} value={name} className="outline-none" type="text" placeholder='Full Name' required/>
                    </div>
                    )}
                    
                    <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-white">
                        Email: <input onChange={e=>setEmail(e.target.value)} value={email} className="outline-none" type="email" placeholder='Enter email' required/>
                    </div>
                    <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-white">
                        Password: <input onChange={e=>setPassword(e.target.value)} value={password} className="outline-none" type="password" placeholder='Enter password' required/>
                    </div>
                    <p onClick={()=>navigate('/reset-password')} className='mb-4 text-indigo-500 cursor-pointer'>Forgot Password?</p>

                    <button className='w-full py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 cursor-pointer'>{state}</button>
                </form>
                
                {state==="Sign Up" ? (
                    <p className='text-black text-center mt-4'>Already have an account?{' '}
                        <span onClick={()=>setState('Login')} className='text-blue-800 cursor-pointer underline'>Login here</span>
                    </p>
                ) :
                (
                    <p className='text-black text-center mt-4'>Don't have an account?{' '}
                        <span onClick={()=>setState('Sign Up')} className='text-blue-800 cursor-pointer underline'>Sign Up</span>
                    </p>  
                )}
                

                
            </div>
        </div>
    )
}

export default Login
