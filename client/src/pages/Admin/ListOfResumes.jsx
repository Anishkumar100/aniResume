import React, { useEffect, useState } from 'react'
import { 
  Search, 
  Trash2, 
  Eye, 
  FileText, 
  User,
  ExternalLink,
  Lock,
  Globe
} from 'lucide-react'
import { Link } from 'react-router-dom'
import adminApi from "../../../config/adminApi" 
import { Loader } from '../../components/commonComponents/Loader'
import toast from 'react-hot-toast'

export const ListOfResumes = () => {
  const [resumes, setResumes] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  // --- FETCH RESUMES ---
  useEffect(() => {
    const loadResumes = async () => {
      try {
        const token = localStorage.getItem('adminToken')
        const { data } = await adminApi.get('/api/admin/resumes', {
            headers: { 'Authorization': `Bearer ${token}` }
        })
        setResumes(data.resumes || [])
      } catch (error) {
        console.error("Fetch Error:", error)
        toast.error("Failed to load resumes")
      } finally {
        setLoading(false)
      }
    }
    loadResumes()
  }, [])

  // --- DELETE HANDLER ---
  const handleDeleteResume = async (resumeId) => {
    if (!window.confirm("Are you sure you want to permanently delete this resume?")) return;

    try {
        const token = localStorage.getItem('adminToken')
        await adminApi.delete(`/api/admin/resumes/${resumeId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        })

        setResumes(prev => prev.filter(r => r._id !== resumeId))
        toast.success("Resume deleted successfully")

    } catch (error) {
        toast.error("Failed to delete resume")
    }
  }

  // --- SEARCH FILTER ---
  const filteredResumes = resumes.filter(resume => {
    const titleMatch = resume.title?.toLowerCase().includes(searchTerm.toLowerCase())
    const emailMatch = resume.userId?.email?.toLowerCase().includes(searchTerm.toLowerCase())
    const nameMatch = resume.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    return titleMatch || emailMatch || nameMatch
  })

  if (loading) return <Loader />

  return (
    <div className='w-full max-w-[1600px] mx-auto p-4 sm:p-6 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700'>
      
      {/* --- Header & Search --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
            <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                <FileText className="text-purple-600" />
                Resume Management
            </h1>
            <p className="text-slate-500 text-sm mt-1">
                Monitor and moderate all resumes created on the platform.
            </p>
        </div>

        <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-3 text-slate-400 size-4" />
            <input 
                type="text" 
                placeholder="Search by title, user, or email..." 
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
      </div>

      {/* --- DATA TABLE (DESKTOP) --- */}
      <div className="hidden md:block bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200 text-xs text-slate-500 font-bold uppercase tracking-wider">
                <tr>
                    <th className="px-6 py-4">Resume Title</th>
                    <th className="px-6 py-4">Owner</th>
                    <th className="px-6 py-4">Visibility</th>
                    <th className="px-6 py-4">Created Date</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
                {filteredResumes.length > 0 ? filteredResumes.map((resume) => (
                    <tr key={resume._id} className="hover:bg-slate-50/80 transition-colors group">
                        
                        <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                                    <FileText size={18} />
                                </div>
                                <span className="font-bold text-slate-800 text-sm">{resume.title || "Untitled"}</span>
                            </div>
                        </td>

                        <td className="px-6 py-4">
                            <div className="flex flex-col">
                                <span className="text-sm font-bold text-slate-700">{resume.userId?.name || "Unknown User"}</span>
                                <span className="text-xs text-slate-400">{resume.userId?.email}</span>
                            </div>
                        </td>

                        <td className="px-6 py-4">
                            {resume.public ? (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-green-50 text-green-700 border border-green-200">
                                    <Globe size={12} /> Public
                                </span>
                            ) : (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-500 border border-slate-200">
                                    <Lock size={12} /> Private
                                </span>
                            )}
                        </td>

                        <td className="px-6 py-4 text-sm text-slate-500 font-medium">
                            {new Date(resume.createdAt).toLocaleDateString()}
                        </td>

                        <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                                <Link 
                                    to={`/view/${resume._id}`} 
                                    target="_blank"
                                    className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                    title="Open Preview"
                                >
                                    <ExternalLink size={18} />
                                </Link>
                                <button 
                                    onClick={() => handleDeleteResume(resume._id)}
                                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    title="Delete Resume"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </td>
                    </tr>
                )) : (
                    <tr>
                        <td colSpan="5" className="px-6 py-12 text-center text-slate-400 text-sm">
                            No resumes found matching "{searchTerm}"
                        </td>
                    </tr>
                )}
            </tbody>
        </table>
      </div>

      {/* --- CARDS (MOBILE) --- */}
      <div className="md:hidden flex flex-col gap-4">
        {filteredResumes.length > 0 ? filteredResumes.map((resume) => (
            <div key={resume._id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-4 relative overflow-hidden">
                
                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-slate-50 to-purple-50 rounded-bl-full -mr-4 -mt-4 z-0"></div>

                <div className="flex items-start justify-between relative z-10">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                            <FileText size={20} />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-900 text-sm line-clamp-1">{resume.title || "Untitled"}</h3>
                            <div className="flex items-center gap-1 text-xs text-slate-500 mt-0.5">
                                <User size={10} />
                                {resume.userId?.name || "Unknown"}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="h-px bg-slate-100 w-full"></div>

                <div className="flex items-center justify-between relative z-10">
                    <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Created On</p>
                        <p className="text-xs font-semibold text-slate-700 mt-0.5">
                            {new Date(resume.createdAt).toLocaleDateString()}
                        </p>
                    </div>
                    <div>
                        {resume.public ? (
                            <span className="flex items-center gap-1 text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-md">
                                <Globe size={12}/> Public
                            </span>
                        ) : (
                            <span className="flex items-center gap-1 text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-md">
                                <Lock size={12}/> Private
                            </span>
                        )}
                    </div>
                </div>

                <div className="flex gap-2 pt-2">
                    <Link 
                        to={`/view/${resume._id}`}
                        target="_blank"
                        className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-blue-50 text-blue-600 text-xs font-bold hover:bg-blue-100 transition-colors"
                    >
                        <Eye size={14}/> Preview
                    </Link>
                    <button 
                        onClick={() => handleDeleteResume(resume._id)}
                        className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-red-50 text-red-600 text-xs font-bold hover:bg-red-100 transition-colors"
                    >
                        <Trash2 size={14}/> Delete
                    </button>
                </div>
            </div>
        )) : (
            <div className="p-10 text-center text-slate-400 text-sm bg-white rounded-2xl border border-slate-200">
                No resumes found.
            </div>
        )}
      </div>

    </div>
  )
}