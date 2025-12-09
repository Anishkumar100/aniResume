import React from 'react'
import { Outlet } from 'react-router-dom'
import { Navbar } from '../components/commonComponents/Navbar'
import {useSelector} from "react-redux"
import { Loader } from '../components/commonComponents/Loader'
import { Login } from './Login'


export const Layout = () => {

/*using redux store to get the user auth data from auth slice */

const {user,loading} = useSelector((state)=>state.auth)

if(loading)
{
  return <Loader/>
}

//if user is logged in then show layout is shown with navbar and outlet else login page is shown

  return (
    <div>
      {
        user ? (<div className=' min-h-screen overflow-hidden  bg-gray-50'>
          <Navbar/>
          <Outlet/>
        </div>) :(
          <Login/>
        )
      }
        
       
    </div>
  )
}
