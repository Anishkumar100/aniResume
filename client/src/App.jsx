import { useEffect, useState } from 'react'
import { Routes, Route } from "react-router-dom"
import { Home } from "./pages/Home"
import { Layout } from "./pages/Layout"
import { Dashboard } from "./pages/Dashboard"
import { ResumeBuilder } from './pages/ResumeBuilder'
import { Preview } from "./pages/Preview"
import { Login } from "./pages/Login"
import { PageNotFound } from './pages/PageNotFound'
import { Contact } from "./pages/Contact"


//Resume Analyser
import { ResumeAnalyser } from './pages/ResumeAnalyser'


// Admin Imports
import { AdminLayout } from './pages/Admin/AdminLayout'
import { AdminDashboard } from './pages/Admin/AdminDashboard'
import { AdminLogin } from './pages/Admin/AdminLogin'
import { ListOfUsers } from "./pages/Admin/ListOfUsers"
import { ListOfResumes } from "./pages/Admin/ListOfResumes"

import { useDispatch } from 'react-redux'
import { Toaster } from "react-hot-toast"

import api from "../config/api.js"
import { login, setLoading } from '../app/features/authSlice'
import { adminLogin } from '../app/features/adminSlice' // Import this!
import { IndividualUser } from './pages/Admin/IndividualUser.jsx'

export const App=()=> {
//redux dispatch function
  const dispatch = useDispatch()

  // --- 1. Check for Regular User ---
  const getUserData = async () => {
    const token = localStorage.getItem('token')
    try {
      if (token) {
        const { data } = await api.get("/api/users/data", {
          headers: { Authorization: `Bearer ${token}` }
        })

        if (data.user) {
          dispatch(login({ token, user: data.user }))
        }
      }
    }
    catch (error) {
      console.log(error.message)
    }
    finally {
      // Only stop loading if we aren't checking admin status too, 
      // but usually fine to dispatch false here as they run largely in parallel logic
      dispatch(setLoading(false)) 
    }
  }

  // --- 2. Check for Admin (New Function) ---
  const getAdminStatus = () => {
    // Since we don't have a specific "/api/admin/me" route yet, And the token is fetched from AdminLogin.jsx file. 
    // we simply check if the token exists in localStorage to keep them logged in.
    // Real validation happens when they try to hit the Dashboard APIs.
    const adminToken = localStorage.getItem('adminToken');
    
    if (adminToken) {
      dispatch(adminLogin({ 
        token: adminToken, 
        admin: { email: "Admin" } // Placeholder data until real data loads
      }));
    }
  }

  useEffect(() => {
    getUserData()
    getAdminStatus() // Run this on load
  }, [])

  return (
    <>
      <Toaster />
      <Routes>
        <Route path="/" element={<Home />} />

        {/* User Routes */}
        <Route path='app' element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="builder/:resumeId" element={<ResumeBuilder />} />
        </Route>

        <Route path="contact" element={<Contact />} />
        <Route path="view/:resumeId" element={<Preview />} />
        <Route path="login" element={<Login />} />

        {/* Admin Routes */}
        <Route path="admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<ListOfUsers />} />
          <Route path="resumes" element={<ListOfResumes />} />
          <Route path="users/:userId" element={<IndividualUser/>}/>
        </Route>

        <Route path="admin/login" element={<AdminLogin />} />

        <Route path="*" element={<PageNotFound />} />


        <Route path="resume-analyser" element={<ResumeAnalyser/>}/>
      </Routes>
    </>
  )
}

