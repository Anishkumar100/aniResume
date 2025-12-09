import React, { useEffect } from 'react'
import { useState } from 'react'
import {User2Icon} from "lucide-react"
import { Mail } from 'lucide-react'
import { Lock } from 'lucide-react'
import {useSearchParams } from 'react-router-dom'
import api from '../../config/api'
import { useDispatch } from 'react-redux'
import { login } from '../../app/features/authSlice'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
export const Login = () =>
{

  const token = localStorage.getItem('token')
  const navigate = useNavigate()
  useEffect(()=>
  {
    if(token)
    {
      navigate("/app",{replace:true})
    }
  },[token,navigate])
  
  const dispatch = useDispatch()

  const [searchParams] = useSearchParams()
  const queryState = searchParams.get('state')
  const [state, setState] = useState(queryState === "login"? "login":"register")
  /* Here, i am getting the login or register state from the query and assigning it */

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    try 
    {
      /* This is for login and register. And note that the login in authSlice is just to store user data when logged in or signup */
      const {data}=  await api.post(`/api/users/${state}`, formData)
      dispatch(login(data))
      localStorage.setItem("token",data.token)
      toast.success(data.message)
      /*
      response from backend will have user data and token. U r storing that token in local storage and user data as object and the token in redux store.
      */

    } 
    catch (error) 
    {
      toast.error(error?.response?.data?.message || error.message)
    }

  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    /*
    this [name] will signify whatever field of the form that is changed (name,email and password), and value represents its values.
    */
  }


  return (
    <div className=' flex items-center justify-center min-h-screen bg-gray-50'>
      <form onSubmit={handleSubmit} className="sm:w-[350px] w-full text-center border border-gray-300/60 rounded-2xl px-8 bg-white">
        <h1 className="text-gray-900 text-3xl mt-10 font-medium">{state === "login" ? "Login" : "Register"}</h1>
        <p className="text-gray-500 text-sm mt-2">Please {state} to continue</p>
        {state !== "login" && (
          <div className="flex items-center mt-6 w-full bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2">
            <User2Icon size={16} color='#6B7280' />
            <input type="text" name="name" placeholder="Name" className="border-none outline-none ring-0" value={formData.name} onChange={handleChange} required />

          </div>
        )}
        <div className="flex items-center w-full mt-4 bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2">
          <Mail size={13} color='#6B7280'/>
          <input type="email" name="email" placeholder="Email id" className="border-none outline-none ring-0" value={formData.email} onChange={handleChange} required />

        </div>
        <div className="flex items-center mt-4 w-full bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2">
          <Lock size={13} color="#6B7280"/>
          <input type="password" name="password" placeholder="Password" className="border-none outline-none ring-0" value={formData.password} onChange={handleChange} required />
        </div>
        <div className="mt-4 text-left text-red-500">
          <button className="text-sm" type="reset">Forget password?</button>
        </div>
        <button type="submit" className="mt-2 w-full h-11 rounded-full text-white bg-red-500 hover:opacity-90 transition-opacity">
          {state === "login" ? "Login" : "Register"}
        </button>
        <p onClick={() => setState(prev => prev === "login" ? "Sign" : "login")} className="text-gray-500 text-sm mt-3 mb-11">{state === "login" ? "Don't have an account?" : "Already have an account?"} <a href="#" className="text-red-500 hover:underline">click here</a></p>

      </form>
    </div>
  )
}

