import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { 
  Users, 
  FileText, 
  TrendingUp, 
  ArrowRight, 
  Calendar, 
  MoreHorizontal,
  Activity,
  ShieldCheck
} from 'lucide-react'
import api from '../../../config/api'
import { Loader } from '../../components/commonComponents/Loader'

export const AdminDashboard = () => {
  // --- STATE MANAGEMENT ---
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalResumes: 0,
    recentUsers: []
  })
  const [loading, setLoading] = useState(true)

  const currentDate = new Date().toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });

  // --- DATA FETCHING & LOGIC ---
  useEffect(() => {
    const loadData = async () => {
      try {
        const token = localStorage.getItem('adminToken')
        const config = { headers: { 'Authorization': `Bearer ${token}` } }

        // 1. Parallel Data Fetching
        const [usersRes, resumesRes] = await Promise.all([
          api.get('/api/admin/users', config),
          api.get('/api/admin/resumes', config)
        ])

        const users = usersRes.data.users || []
        const resumes = resumesRes.data.resumes || []

        // 2. Process Data: Map Resumes to Users
        const resumeCountMap = {}
        resumes.forEach(resume => {
            const uId = typeof resume.userId === 'object' ? resume.userId?._id : resume.userId
            if(uId) resumeCountMap[uId] = (resumeCountMap[uId] || 0) + 1
        })

        // 3. Process Data: Get Top 5 Recent Users with Counts
        const recentUsersList = users.slice(0, 5).map(user => ({
            ...user,
            resumeCount: resumeCountMap[user._id] || 0,
            initial: user.name.charAt(0).toUpperCase()
        }))

        // 4. Update State
        setStats({
            totalUsers: users.length,
            totalResumes: resumes.length,
            recentUsers: recentUsersList
        })

      } catch (error) {
        console.error("Dashboard Error:", error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  if (loading) return <Loader />

  return (
    <div className='w-full max-w-[1600px] mx-auto p-4 sm:p-6 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700'>
        
        {/* ================= HEADER SECTION ================= */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 pb-6 border-b border-gray-200">
            <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-gray-200 text-xs font-semibold text-slate-500 shadow-sm mb-3">
                    <Calendar size={12} className="text-purple-600" />
                    <span>{currentDate}</span>
                </div>
                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                    Admin <span className='text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600'>Dashboard</span>
                </h1>
                <p className="text-slate-500 mt-1">Overview of system performance and user growth.</p>
            </div>
            
            <Link to="/admin/users" className="group flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white px-5 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 w-full sm:w-auto justify-center">
              <span className="text-sm font-semibold">Manage Users</span>
              <ArrowRight size={16} className="text-gray-400 group-hover:text-white group-hover:translate-x-1 transition-transform" />
            </Link>
        </div>

        {/* ================= STATS CARDS ================= */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            
            {/* Card 1: Total Users */}
            <Link to="/admin/users" className='group relative overflow-hidden bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:border-blue-100 transition-all duration-300'>
                {/* Decor Blob */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-50 to-transparent rounded-full -mr-12 -mt-12 opacity-50 group-hover:scale-125 transition-transform duration-700"></div>
                
                <div className='relative z-10 flex justify-between items-start'>
                    <div>
                        <div className="p-3 bg-blue-50 w-fit rounded-xl mb-4 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                            <Users size={24} />
                        </div>
                        <p className='text-sm font-semibold text-slate-400 uppercase tracking-wider'>Total Users</p>
                        <h3 className='text-4xl font-black text-slate-900 mt-1'>{stats.totalUsers.toLocaleString()}</h3>
                    </div>
                    {/* MODIFIED: Active Badge */}
                    <div className='flex items-center gap-1.5 text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100 shadow-sm'>
                        <TrendingUp size={14} className="text-emerald-600"/>
                        <span className="text-xs font-bold">Live Data</span>
                    </div>
                </div>
            </Link>

            {/* Card 2: Total Resumes */}
            <Link to="/admin/resumes" className='group relative overflow-hidden bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:border-purple-100 transition-all duration-300'>
                {/* Decor Blob */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-50 to-transparent rounded-full -mr-12 -mt-12 opacity-50 group-hover:scale-125 transition-transform duration-700"></div>
                
                <div className='relative z-10 flex justify-between items-start'>
                    <div>
                        <div className="p-3 bg-purple-50 w-fit rounded-xl mb-4 text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors duration-300">
                            <FileText size={24} />
                        </div>
                        <p className='text-sm font-semibold text-slate-400 uppercase tracking-wider'>Resumes Created</p>
                        <h3 className='text-4xl font-black text-slate-900 mt-1'>{stats.totalResumes.toLocaleString()}</h3>
                    </div>
                    {/* MODIFIED: Active Badge */}
                    <div className='flex items-center gap-1.5 text-purple-700 bg-purple-50 px-3 py-1.5 rounded-full border border-purple-100 shadow-sm'>
                        <Activity size={14} className="text-purple-600" />
                        <span className="text-xs font-bold">Active</span>
                    </div>
                </div>
            </Link>
        </div>

        {/* ================= RECENT USERS TABLE ================= */}
        <div className='bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden'>
            {/* Table Header */}
            <div className='px-6 py-5 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-50/50'>
                <div>
                    <h3 className='font-bold text-slate-800 text-lg flex items-center gap-2'>
                        <ShieldCheck size={18} className="text-slate-400"/>
                        Recent Signups
                    </h3>
                    <p className='text-xs text-slate-500 mt-1'>Showing the last 5 users who joined the platform.</p>
                </div>
                <Link to="/admin/users" className="text-sm font-bold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-lg transition-colors">
                    View All Users
                </Link>
            </div>
            
            {/* DESKTOP: Table Layout */}
            <div className='hidden sm:block overflow-x-auto'>
                <table className='w-full text-left'>
                    <thead className='bg-slate-50 border-b border-slate-200 text-xs text-slate-500 font-bold uppercase tracking-wider'>
                        <tr>
                            <th className='px-6 py-4'>User Profile</th>
                            <th className='px-6 py-4 text-center'>Resumes</th>
                            <th className='px-6 py-4 text-right'>Joined Date</th>
                        </tr>
                    </thead>
                    <tbody className='divide-y divide-slate-100'>
                        {stats.recentUsers.length > 0 ? stats.recentUsers.map((user) => (
                            <tr key={user._id} className='group hover:bg-slate-50/80 transition-colors duration-200'>
                                <td className='px-6 py-4'>
                                    <div className='flex items-center gap-4'>
                                        <div className='w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 shadow-md flex items-center justify-center text-white font-bold text-sm'>
                                            {user.initial}
                                        </div>
                                        <div>
                                            <p className='text-sm font-bold text-slate-900'>{user.name}</p>
                                            <p className='text-xs text-slate-500 font-medium'>{user.email}</p>
                                        </div>
                                    </div>
                                </td>
                                
                                <td className='px-6 py-4 text-center'>
                                    <span className={`inline-flex items-center justify-center min-w-[2rem] px-2 py-1 rounded-md text-xs font-bold border 
                                        ${user.resumeCount > 0 
                                            ? 'bg-purple-50 text-purple-700 border-purple-100' 
                                            : 'bg-slate-100 text-slate-400 border-slate-200'}`}>
                                        {user.resumeCount}
                                    </span>
                                </td>
                                <td className='px-6 py-4 text-right text-sm text-slate-500 font-medium'>
                                    {new Date(user.createdAt).toLocaleDateString()}
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="3" className="px-6 py-12 text-center text-slate-400 text-sm">
                                    No users found in the system.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* ================= MOBILE: IMPROVED CARD LAYOUT ================= */}
            <div className='sm:hidden flex flex-col gap-4 p-4 bg-slate-50'>
                {stats.recentUsers.length > 0 ? stats.recentUsers.map((user) => (
                    <div key={user._id} className='bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col gap-4 relative overflow-hidden'>
                        
                        {/* Decor */}
                        <div className="absolute top-0 right-0 w-16 h-16 bg-slate-50 rounded-bl-full -mt-2 -mr-2 z-0"></div>

                        {/* Top: User Profile */}
                        <div className="flex justify-between items-start relative z-10">
                            <div className='flex items-center gap-3'>
                                <div className='w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-md flex items-center justify-center text-white font-bold text-lg'>
                                    {user.initial}
                                </div>
                                <div className='flex flex-col'>
                                    <p className='text-base font-bold text-slate-900 leading-tight'>{user.name}</p>
                                    <p className='text-xs text-slate-500 font-medium mt-0.5'>{user.email}</p>
                                </div>
                            </div>
                            <button className='text-slate-300 p-1'>
                                <MoreHorizontal size={20} />
                            </button>
                        </div>

                        {/* Divider */}
                        <div className="h-px bg-slate-100 w-full"></div>

                        {/* Bottom: Stats & Date */}
                        <div className="flex gap-4 items-center justify-between">
                            <div className='flex flex-col'>
                                <span className='text-[10px] uppercase tracking-wider text-slate-400 font-bold'>Joined On</span>
                                <span className="text-xs font-bold text-slate-600 mt-0.5">{new Date(user.createdAt).toLocaleDateString()}</span>
                            </div>
                            
                            {/* MODIFIED: Mobile Resume Count Button */}
                            <span className={`flex items-center gap-2 px-2 py-2 rounded-lg text-xs font-bold border shadow-sm transition-all
                                ${user.resumeCount > 0 
                                    ? 'bg-purple-50 text-purple-700 border-purple-200' 
                                    : 'bg-slate-50 text-slate-500 border-slate-200'}`}>
                                <FileText size={14} className={user.resumeCount > 0 ? "text-purple-600" : "text-slate-400"}/> 
                                <span>{user.resumeCount} Resumes</span>
                            </span>
                        </div>
                    </div>
                )) : (
                    <div className="p-8 text-center text-slate-500 text-sm bg-white rounded-xl border border-slate-200">
                        No users found.
                    </div>
                )}
            </div>
        </div>
    </div>
  )
}