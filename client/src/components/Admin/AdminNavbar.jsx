import React from 'react'
import { Link, useNavigate } from "react-router-dom"

export const AdminNavbar = () => {
    // Mock admin data
    const admin = { name: 'Anish' }
    
    const navigate = useNavigate()

    const logoutAdmin = () => {
        // Perform logout logic here (clear admin tokens, etc.)
        navigate('/') 
    }

    return (
        <div className='shadow bg-white sticky top-0 z-50'>
            <nav className='flex items-center justify-between max-w-7xl mx-auto px-4 text-slate-800 transition-all'>
                
                {/* Logo - Links to Admin Dashboard */}
                <Link to="/">
                    <img src="/navLogo.png" className='h-24 w-auto object-contain' alt="Logo" />
                </Link>

                {/* Right Side Actions */}
                <div className='flex items-center gap-4 text-sm'>
                    <div className='max-sm:hidden flex items-center gap-2'>
                        <p>Hi, {admin?.name}</p>
                        <span className="text-[10px] bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-medium border border-purple-200">
                            ADMIN
                        </span>
                    </div>

                    <button 
                        onClick={logoutAdmin} 
                        className='bg-white hover:bg-slate-50 border border-gray-300 px-7 py-1.5 rounded-full active:scale-95 transition-all shadow-sm text-slate-600 hover:text-red-600 hover:border-red-200'
                    >
                        Logout
                    </button>
                </div>
            </nav>
        </div>
    )
}

