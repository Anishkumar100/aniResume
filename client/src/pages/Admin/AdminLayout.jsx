import React from 'react'
import { Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { AdminNavbar } from "../../components/Admin/AdminNavbar" 
import { AdminSidebar } from '../../components/Admin/AdminSidebar' 
import { AdminLogin } from './AdminLogin' 
import { Loader } from '../../components/commonComponents/Loader'

export const AdminLayout = () => {

  // 1. Get auth state from the admin slice
  const { adminToken, loading } = useSelector((state) => state.admin)

  // 2. Show Loader if state is loading
  if (loading) {
    return <Loader />
  }

  // 3. If NOT logged in (no token), show AdminLogin page
  if (!adminToken) {
    return <AdminLogin />
  }

  // 4. If logged in, show the Admin Dashboard Layout
  return (
    <div className='min-h-screen bg-gray-50'>
      
      {/* Navbar Fixed at Top */}
      <AdminNavbar />

      {/* Flex Container for Side-by-Side Layout */}
      <div className='flex'>
          
          {/* Sidebar (Always Visible) */}
          <AdminSidebar />

          {/* Main Content Area */}
          <main className='flex-1 min-w-0 p-4 md:p-8 overflow-x-hidden'>
              <Outlet />
          </main>
      </div>
    </div>
  )
}

export default AdminLayout;