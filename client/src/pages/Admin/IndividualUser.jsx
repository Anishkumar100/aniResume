import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { 
  ArrowLeft, 
  Mail, 
  Calendar, 
  FileText, 
  Trash2, 
  ExternalLink,
  Clock,
  Globe,
  Lock
} from 'lucide-react'
import api from '../../../config/api'
import { Loader } from '../../components/commonComponents/Loader'
import toast from 'react-hot-toast'
import { Link } from 'react-router-dom'

export const IndividualUser = () => {
  const { userId } = useParams()
  const navigate = useNavigate()
  
  const [user, setUser] = useState(null)
  const [resumes, setResumes] = useState([])
  const [loading, setLoading] = useState(true)

  // --- FETCH DATA ---
  useEffect(() => {
    const fetchData = async () => {
      // Safety Check
      if (!userId || userId === 'undefined') {
         navigate('/admin/users'); 
         return;
      }

      try {
        const token = localStorage.getItem('adminToken')
        const config = { headers: { 'Authorization': `Bearer ${token}` } }

        const [usersRes, resumesRes] = await Promise.all([
            api.get(`/api/admin/users/${userId}`, config),
            api.get(`/api/admin/users/${userId}/resumes`, config)
        ])

        const foundUser = usersRes.data.user; 
        
        if (!foundUser) throw new Error("User not found");

        setUser({
            ...foundUser,
            initial: foundUser.name ? foundUser.name.charAt(0).toUpperCase() : 'U'
        })
        setResumes(resumesRes.data.resumes || [])

      } catch (error) {
        console.error("Error:", error)
        toast.error("Failed to load user details")
        navigate('/admin/users')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [userId, navigate])

  // --- DELETE USER ---
  const handleDeleteUser = async () => {
    if(!window.confirm("CRITICAL WARNING:\n\nAre you sure you want to delete this user?\nThis will permanently erase their account and ALL their resumes.")) return;

    try {
        const token = localStorage.getItem('adminToken')
        await api.delete(`/api/admin/users/${userId}`, { 
            headers: { 'Authorization': `Bearer ${token}` } 
        })
        toast.success("User deleted successfully")
        navigate('/admin/users')
    } catch (error) {
        toast.error("Failed to delete user")
    }
  }

  // --- DELETE RESUME ---
  const handleDeleteResume = async (resumeId) => {
    if(!window.confirm("Delete this resume permanently?")) return;

    try {
        const token = localStorage.getItem('adminToken')
        await api.delete(`/api/admin/resumes/${resumeId}`, { 
            headers: { 'Authorization': `Bearer ${token}` } 
        })
        setResumes(prev => prev.filter(r => r._id !== resumeId))
        toast.success("Resume deleted")
    } catch (error) {
        toast.error("Failed to delete resume")
    }
  }

  if (loading) return <Loader />

  return (
    <div className='w-full max-w-[1600px] mx-auto p-4 sm:p-6 space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500'>
        
        {/* --- BACK NAVIGATION --- */}
        <button 
            onClick={() => navigate('/admin/users')} 
            className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors font-medium text-sm group"
        >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform"/> Back to Users List
        </button>

        {/* --- USER PROFILE HEADER (RESPONSIVE) --- */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm flex flex-col md:flex-row gap-6 md:gap-8 items-center md:items-center justify-between relative overflow-hidden text-center md:text-left">
            
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-full -mr-20 -mt-20 z-0 opacity-70 pointer-events-none"></div>

            <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6 relative z-10 w-full md:w-auto">
                {/* Large Avatar */}
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-xl flex items-center justify-center text-white text-3xl sm:text-4xl font-bold shrink-0">
                    {user?.initial}
                </div>
                
                <div className="flex flex-col items-center md:items-start">
                    <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 mb-2">
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">{user?.name}</h1>
                        <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-500 text-xs font-bold border border-slate-200 uppercase tracking-wide">
                            User
                        </span>
                    </div>
                    
                    <div className="space-y-1.5 w-full">
                        <div className="flex items-center justify-center md:justify-start gap-2 text-slate-500 text-sm break-all">
                            <Mail size={16} className="text-slate-400 shrink-0"/> {user?.email}
                        </div>
                        <div className="flex items-center justify-center md:justify-start gap-2 text-slate-500 text-sm">
                            <Calendar size={16} className="text-slate-400 shrink-0"/> Joined {new Date(user?.createdAt).toLocaleDateString()}
                        </div>
                    </div>
                </div>
            </div>

            {/* Delete User Button (Full width on mobile) */}
            <button 
                onClick={handleDeleteUser}
                className="relative z-10 flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-all font-bold text-sm shadow-sm hover:shadow-md border border-red-100 w-full md:w-auto mt-4 md:mt-0"
            >
                <Trash2 size={16} /> Delete Account
            </button>
        </div>

        {/* --- RESUMES SECTION --- */}
        <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-gray-200 pb-4">
                <h2 className="text-lg sm:text-xl font-bold text-slate-800 flex items-center gap-2">
                    <FileText className="text-purple-600" />
                    User Resumes 
                    <span className="bg-slate-100 text-slate-600 text-xs px-2 py-1 rounded-full ml-2">
                        {resumes.length}
                    </span>
                </h2>
            </div>

            {resumes.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                    {resumes.map(resume => (
                        <div key={resume._id} className="group bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-lg hover:border-purple-200 transition-all duration-300 flex flex-col justify-between h-auto sm:h-[200px]">
                            
                            <div>
                                <div className="flex justify-between items-start mb-3">
                                    <div className="p-2.5 bg-purple-50 rounded-xl text-purple-600 group-hover:scale-110 transition-transform">
                                        <FileText size={22} />
                                    </div>
                                    <button 
                                        onClick={() => handleDeleteResume(resume._id)}
                                        className="text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg p-1.5 transition-colors"
                                        title="Delete Resume"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                                
                                <h3 className="font-bold text-slate-800 text-lg line-clamp-1 group-hover:text-purple-600 transition-colors">
                                    {resume.title || "Untitled Resume"}
                                </h3>
                                <p className="text-xs text-slate-400 mt-2 flex items-center gap-1.5">
                                    <Clock size={12}/> Updated {new Date(resume.updatedAt).toLocaleDateString()}
                                </p>
                            </div>

                            <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
                                {resume.public ? (
                                    <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md bg-green-50 text-green-600">
                                        <Globe size={10}/> Public
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md bg-slate-100 text-slate-500">
                                        <Lock size={10}/> Private
                                    </span>
                                )}

                                <Link 
                                    to={`/view/${resume._id}`} 
                                    target="_blank"
                                    className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline"
                                >
                                    Preview <ExternalLink size={12} />
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 p-8 sm:p-12 text-center flex flex-col items-center justify-center">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                        <FileText size={32} className="text-slate-300" />
                    </div>
                    <h3 className="text-slate-600 font-bold text-lg">No Resumes Found</h3>
                    <p className="text-slate-400 text-sm mt-1">This user hasn't created any resumes yet.</p>
                </div>
            )}
        </div>
    </div>
  )
}