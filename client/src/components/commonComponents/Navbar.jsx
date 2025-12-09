import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {Link} from "react-router-dom"
import { useNavigate } from 'react-router-dom'
import { logout } from '../../../app/features/authSlice'
import { toast } from 'react-hot-toast'
export const Navbar = () => {
    const {user} = useSelector((state)=>state.auth)

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const logoutUser=()=>
    {
        localStorage.removeItem("token")
        dispatch(logout())   
        toast.success("Logged out 😭. Pls Come Back Soon!")
    }
    return (
        <div className=' shadow bg-white'>
            <nav className=' flex items-center justify-between max-w-7xl mx-auto px-4  text-slate-800 transition-all'>
                <Link to="/">
                    <img src="/navLogo.png" className=' h-24 w-auto' />
                </Link>
                <div className=' flex items-center gap-4 text-sm'>
                    <p className=' max-sm:hidden'>Hi, {user?.name}</p>
                    <button onClick={logoutUser} className='bg-white hover:bg-slate-50 border border-gray-300 px-7 py-1.5 rounded-full active:scale-95 transition-all'>Logout</button>
                </div>
            </nav>
        </div>
    )
}
