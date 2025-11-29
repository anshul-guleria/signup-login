import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";

export const AppContent=createContext();

export const AppContextProvider = (props) => {

    const backendURL=import.meta.env.VITE_BACKEND_URL;
    const [isLoggedIn, setIsLoggedIn]=useState(false);
    const [userData, setUserData]=useState(false);

    const getAuthState=async() => {
        try {
            const {data}=await axios.get(backendURL+'/api/auth/is-auth',{withCredentials: true})
            if(data.success) {
                setIsLoggedIn(true)
                getUserData()
                // console.log(data);
                toast.success("User data fetched successfully");
            }
            else {
                console.log("Please Login")
            }
        }
        catch(error) {
            toast.error(error.message);
        }
    }

    const getUserData= async() => {
        try {
            const {data}=await axios.get(backendURL+'/api/user/data',{withCredentials:true})
            data.success ? setUserData(data.userData): toast.error(data.message);
            // console.log(data.userData)
        }
        catch (error) {
            toast.error(error.message);
        }
    }

    useEffect(()=>{
        getAuthState();
    },[])

    const value= {
        backendURL,
        isLoggedIn,
        setIsLoggedIn,
        userData,
        setUserData,
        getUserData
    }

    return (
        <AppContent.Provider value={value}>
            {props.children}
        </AppContent.Provider>
    )
}