import React, { useEffect, useState } from 'react'
import {
  Search,
  Trash2,
  Eye,
  MoreHorizontal,
  FileText,
  Calendar,
  User,
  ShieldAlert
} from 'lucide-react'
import { Link } from 'react-router-dom'
import api from '../../../config/api'
import { Loader } from '../../components/commonComponents/Loader'
import toast from 'react-hot-toast'

export const ListOfUsers = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  // --- FETCH DATA ---
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const token = localStorage.getItem('adminToken')
        const config = { headers: { 'Authorization': `Bearer ${token}` } }

        // Fetch Users AND Resumes (to calculate counts)
        const [usersRes, resumesRes] = await Promise.all([
          api.get('/api/admin/users', config),
          api.get('/api/admin/resumes', config)
        ])

        const rawUsers = usersRes.data.users || []
        const resumes = resumesRes.data.resumes || []

        // 1. Create an empty object to act as our counter
        const resumeCountMap = {}

        // 2. Loop through every single resume in the database
        resumes.forEach(r => {
          // Get the User ID who owns this resume
          const uId = typeof r.userId === 'object' ? r.userId?._id : r.userId

          // 3. If a User ID exists, add 1 to their count in the object (Since we dont want 0-based index)
          if (uId) {
            // If map[uId] exists, add 1. If it doesn't exist yet (undefined), start at 0 then add 1.
            resumeCountMap[uId] = (resumeCountMap[uId] || 0) + 1
          }
        })
        const formattedUsers = rawUsers.map(user => ({
          ...user, // Keep existing name, email, etc.
          // Look up this user's ID in our map. If not found, default to 0.
          resumeCount: resumeCountMap[user._id] || 0,
          initial: user.name.charAt(0).toUpperCase()
        }))

        setUsers(formattedUsers); // Saving this final list to state


      } catch (error) {
        console.error("Fetch Error:", error)
        toast.error("Failed to load users list")
      } finally {
        setLoading(false)
      }
    }
    loadUsers()
  }, [])

  // --- DELETE HANDLER ---
  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure? This will delete the user and ALL their resumes permanently.")) return;

    try {
      const token = localStorage.getItem('adminToken')
      await api.delete(`/api/admin/users/${userId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })

      // Remove from UI immediately
      setUsers(prev => prev.filter(user => user._id !== userId))
      toast.success("User deleted successfully")

    } catch (error) {
      console.error("Delete Error:", error)
      toast.error(error.response?.data?.message || "Failed to delete user")
    }
  }

  // --- SEARCH FILTER ---
  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) return <Loader />

  return (
    <div className='w-full max-w-[1600px] mx-auto p-4 sm:p-6 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700'>

      {/* --- Header & Search --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <User className="text-purple-600" />
            User Management
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            View, manage, and monitor all registered users.
          </p>
        </div>

        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-3 text-slate-400 size-4" />
          <input
            type="text"
            placeholder="Search users..."
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
              <th className="px-6 py-4">User Profile</th>
              <th className="px-6 py-4">Role</th>
              <th className="px-6 py-4 text-center">Resumes</th>
              <th className="px-6 py-4">Joined Date</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredUsers.length > 0 ? filteredUsers.map((user) => (
              <tr key={user._id} className="hover:bg-slate-50/80 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 shadow-sm flex items-center justify-center text-white font-bold text-sm">
                      {user.initial}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">{user.name}</p>
                      <p className="text-xs text-slate-500 font-medium">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
                    User
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className={`inline-flex items-center justify-center min-w-[2rem] px-2 py-1 rounded-md text-xs font-bold border 
                                ${user.resumeCount > 0 ? 'bg-purple-50 text-purple-700 border-purple-100' : 'bg-slate-50 text-slate-400 border-slate-200'}`}>
                    {user.resumeCount}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-slate-500 font-medium">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    {/* View Details Button */}
                    <Link
                      to={`/admin/users/${user._id}`}
                      className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="View Details"
                    >
                      <Eye size={18} />
                    </Link>
                    {/* Delete Button */}
                    <button
                      onClick={() => handleDeleteUser(user._id)}
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete User"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="5" className="px-6 py-12 text-center text-slate-400 text-sm">
                  No users found matching "{searchTerm}"
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* --- CARDS (MOBILE) --- */}
      <div className="md:hidden flex flex-col gap-4">
        {filteredUsers.length > 0 ? filteredUsers.map((user) => (
          <div key={user._id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-4 relative overflow-hidden">
            {/* Decorative BG */}
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-slate-50 to-slate-100 rounded-bl-full -mr-4 -mt-4 z-0"></div>

            {/* Top Section */}
            <div className="flex items-start justify-between relative z-10">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-sm flex items-center justify-center text-white font-bold text-lg">
                  {user.initial}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">{user.name}</h3>
                  <p className="text-xs text-slate-500">{user.email}</p>
                </div>
              </div>
              {/* Status Badge */}
              <span className="px-2 py-1 rounded text-[10px] font-bold bg-slate-100 text-slate-500 uppercase tracking-wide">
                User
              </span>
            </div>

            <div className="h-px bg-slate-100 w-full"></div>

            {/* Info Grid */}
            <div className="grid grid-cols-2 gap-4 relative z-10">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Joined</p>
                <p className="text-xs font-semibold text-slate-700 mt-0.5 flex items-center gap-1">
                  <Calendar size={12} /> {new Date(user.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Resumes</p>
                <p className="text-xs font-semibold text-slate-700 mt-0.5 flex items-center gap-1">
                  <FileText size={12} /> {user.resumeCount} Created
                </p>
              </div>
            </div>

            {/* Actions Footer */}
            <div className="flex gap-2 pt-2">
              <Link
                to={`/admin/users/${user._id}`}
                className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-slate-50 text-slate-600 text-xs font-bold hover:bg-slate-100 transition-colors"
              >
                <Eye size={14} /> View Profile
              </Link>
              <button
                onClick={() => handleDeleteUser(user._id)}
                className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-red-50 text-red-600 text-xs font-bold hover:bg-red-100 transition-colors"
              >
                <Trash2 size={14} /> Delete
              </button>
            </div>
          </div>
        )) : (
          <div className="p-10 text-center text-slate-400 text-sm bg-white rounded-2xl border border-slate-200">
            No users found.
          </div>
        )}
      </div>

    </div>
  )
}