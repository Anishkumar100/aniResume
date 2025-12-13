import React, { useEffect, useState } from 'react'
import { Mail, Lock, Loader2 } from 'lucide-react'
import { replace, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import adminApi from "../../../config/adminApi" // 👈 Use the new file
import { adminLogin, setAdminLoading } from '../../../app/features/adminSlice' // Import actions
import toast from 'react-hot-toast'

export const AdminLogin = () => {

  const token = localStorage.getItem('adminToken')
  const navigate = useNavigate()

  useEffect(() => {
    if (token) {
      navigate("/admin",{replace:true})
    }
  },[token,navigate])

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })


  const dispatch = useDispatch()

  // Get loading state from Redux to disable button while fetching
  const { loading } = useSelector((state) => state.admin)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Basic validation
    if (!formData.email || !formData.password) {
      return toast.error("Please fill in all fields")
    }

    try {
      dispatch(setAdminLoading(true)) // Start loading

      // 1. API Call
      const { data } = await adminApi.post('/api/admin/login', formData)

      if (data.success) {
        // 2. Save to Redux
        dispatch(adminLogin({
          token: data.token,
          admin: { email: data.email }
        }))

        // 3. Save to Local Storage (Critical for persistence)
        localStorage.setItem("adminToken", data.token)

        toast.success("Welcome Admin!")

        // 4. Redirect to Dashboard
        navigate("/admin")
      }

    } catch (error) {
      console.error("Login Error:", error)
      toast.error(error.response?.data?.message || "Invalid Email or Password")
    } finally {
      dispatch(setAdminLoading(false)) // Stop loading
    }
  }

  return (
    <div className='flex items-center justify-center min-h-screen bg-gray-50'>
      <form onSubmit={handleSubmit} className="sm:w-[350px] w-full text-center border border-gray-300/60 rounded-2xl px-8 bg-white pb-10 shadow-sm">
        <h1 className="text-gray-900 text-3xl mt-10 font-medium">Admin Login</h1>
        <p className="text-gray-500 text-sm mt-2">Secure access only</p>

        <div className="flex items-center w-full mt-6 bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2 focus-within:ring-1 focus-within:ring-red-500 transition-all">
          <Mail size={18} className="text-gray-400" />
          <input
            type="email"
            name="email"
            placeholder="Email id"
            className="border-none outline-none ring-0 w-full text-sm text-gray-700 placeholder:text-gray-400 h-full"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="flex items-center mt-4 w-full bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2 focus-within:ring-1 focus-within:ring-red-500 transition-all">
          <Lock size={18} className="text-gray-400" />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="border-none outline-none ring-0 w-full text-sm text-gray-700 placeholder:text-gray-400 h-full"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mt-4 text-left">
          {/* Optional: Add logic if you implement reset password later */}
          <button type="button" className="text-sm text-red-500 hover:text-red-600 transition-colors">
            Forgot password?
          </button>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full h-11 rounded-full text-white bg-red-500 hover:bg-red-600 transition-colors font-medium flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? <Loader2 className="animate-spin size-5" /> : "Login"}
        </button>
      </form>
    </div>
  )
}