import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux';
// 1. Make sure to import useLocation to detect if we are on the homepage
import { Link, useLocation, useNavigate } from 'react-router-dom'; 
import { Menu, X, ChevronRight, ArrowRight } from 'lucide-react';

export const Navbar = () => {
    const { user } = useSelector((state) => state.auth);
    const [menuOpen, setMenuOpen] = useState(false);
    const location = useLocation(); // Get current route
    const navigate = useNavigate();

    // Disable scrolling when menu is open
    useEffect(() => {
        if (menuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [menuOpen]);

    // --- SCROLL HANDLER FUNCTION ---
    const handleScrollToSection = (sectionId) => {
        // If we are NOT on the homepage, navigate there first
        if (location.pathname !== '/') {
            navigate('/');
            // Small delay to allow the home page to mount before scrolling
            setTimeout(() => {
                const element = document.getElementById(sectionId);
                if (element) element.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        } else {
            // We are already on home, just scroll
            const element = document.getElementById(sectionId);
            if (element) element.scrollIntoView({ behavior: 'smooth' });
        }
        setMenuOpen(false); // Close mobile menu if open
    };

    return (
        <>
            <nav className="z-50 flex items-center justify-between gap-6 w-full py-4 px-6 md:px-16 lg:px-24 xl:px-40 text-sm">
                <Link to="/">
                    <img src="/navLogo.png" alt="Logo" className='h-32 w-auto object-contain' />
                </Link>

                {/* Desktop Nav */}
                <div className="hidden min-[980px]:flex items-center gap-8 transition duration-500 text-slate-800 font-medium">
                    <Link to="/" className="hover:text-red-600 transition">Home</Link>
                    
                    {/* CHANGED: Use button with onClick handler instead of <a> tag */}
                    <button onClick={() => handleScrollToSection('features')} className="hover:text-red-600 transition bg-transparent border-none cursor-pointer">
                        Features
                    </button>
                    
                    <Link to="/resume-analyser" className="hover:text-red-600 transition">Resume Analyser</Link>
                    
                    {/* CHANGED: Use button with onClick handler */}
                    <button onClick={() => handleScrollToSection('testimonials')} className="hover:text-red-600 transition bg-transparent border-none cursor-pointer">
                        Testimonials
                    </button>
                    
                    <Link to="/contact" className="hover:text-red-600 transition">Contact</Link>
                </div>

                {/* Desktop Auth Buttons */}
                <div className="hidden min-[980px]:flex gap-4">
                    <Link to="/app?state=register" className="hidden md:flex px-6 py-2.5 bg-red-500 hover:bg-red-600 active:scale-95 transition-all rounded-full text-white font-medium shadow-md hover:shadow-lg shadow-red-200" hidden={user} >
                        Get started
                    </Link>
                    <Link to="/app?state=login" className="hidden md:flex px-6 py-2.5 border border-slate-200 active:scale-95 hover:bg-slate-50 transition-all rounded-full text-slate-700 font-medium"
                        hidden={user}  >
                        Login
                    </Link>

                    <Link to="/app" className='hidden md:flex px-8 py-2.5 bg-red-500 hover:bg-red-600 active:scale-95 transition-all rounded-full text-white font-medium shadow-md hover:shadow-lg shadow-red-200' hidden={!user}>
                        Dashboard
                    </Link>
                </div>

                {/* Mobile Menu Toggle */}
                <div className='flex items-center gap-4 min-[980px]:hidden'>
                    <button onClick={() => setMenuOpen(true)} className="active:scale-90 transition p-2 hover:bg-slate-100 rounded-full" >
                        <Menu className="size-7 text-slate-800" />
                    </button>
                </div>
            </nav>

            {/* --- MOBILE MENU --- */}
            <div 
                className={`fixed inset-0 z-[60] bg-slate-900/20 backdrop-blur-sm transition-opacity duration-300 min-[980px]:hidden
                ${menuOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"}`}
                onClick={() => setMenuOpen(false)}
            />

            <div className={`fixed inset-y-0 right-0 z-[70] w-full sm:w-[320px] bg-white/95 backdrop-blur-xl shadow-2xl flex flex-col transition-transform duration-300 ease-out min-[980px]:hidden
                ${menuOpen ? "translate-x-0" : "translate-x-full"}`} 
            >
                <div className="flex justify-end p-6 pb-2">
                        <button onClick={() => setMenuOpen(false)} className="p-2 bg-slate-100/50 hover:bg-red-50 text-slate-500 hover:text-red-500 rounded-full transition-colors">
                        <X className="size-6" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-2">
                    <Link to="/" onClick={() => setMenuOpen(false)} className="group flex items-center justify-between p-4 rounded-xl text-slate-700 hover:text-red-600 hover:bg-red-50/50 font-medium transition-all">
                        Home <ChevronRight className="size-5 text-slate-300 group-hover:text-red-400 transition-colors"/>
                    </Link>

                    {/* Mobile Features Button */}
                    <button onClick={() => handleScrollToSection('features')} className="group flex items-center justify-between p-4 rounded-xl text-slate-700 hover:text-red-600 hover:bg-red-50/50 font-medium transition-all w-full text-left">
                        Features <ChevronRight className="size-5 text-slate-300 group-hover:text-red-400 transition-colors"/>
                    </button>

                    <Link to="/resume-analyser" onClick={() => setMenuOpen(false)} className="group flex items-center justify-between p-4 rounded-xl text-slate-700 hover:text-red-600 hover:bg-red-50/50 font-medium transition-all">
                        Resume Analyser <ChevronRight className="size-5 text-slate-300 group-hover:text-red-400 transition-colors"/>
                    </Link>

                    {/* Mobile Testimonials Button */}
                    <button onClick={() => handleScrollToSection('testimonials')} className="group flex items-center justify-between p-4 rounded-xl text-slate-700 hover:text-red-600 hover:bg-red-50/50 font-medium transition-all w-full text-left">
                        Testimonials <ChevronRight className="size-5 text-slate-300 group-hover:text-red-400 transition-colors"/>
                    </button>

                    <Link to="/contact" onClick={() => setMenuOpen(false)} className="group flex items-center justify-between p-4 rounded-xl text-slate-700 hover:text-red-600 hover:bg-red-50/50 font-medium transition-all">
                        Contact <ChevronRight className="size-5 text-slate-300 group-hover:text-red-400 transition-colors"/>
                    </Link>
                </div>

                {/* Footer Auth Buttons (Kept same as before) */}
                <div className="p-6 border-t border-slate-100/50 bg-slate-50/30">
                    {!user ? (
                        <div className="flex flex-col gap-3">
                            <Link to="/app?state=register" className="w-full flex items-center justify-center gap-2 py-3.5 bg-red-600 text-white rounded-xl font-semibold shadow-lg shadow-red-200 active:scale-95 transition-all">
                                Get Started Free
                            </Link>
                            <Link to="/app?state=login" className="w-full flex items-center justify-center gap-2 py-3.5 bg-white/80 border border-slate-200 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 active:scale-95 transition-all">
                                Login
                            </Link>
                        </div>
                    ) : (
                        <Link to="/app" className="w-full flex items-center justify-center gap-2 py-3.5 bg-slate-900 text-white rounded-xl font-semibold shadow-lg shadow-slate-200 active:scale-95 transition-all">
                            Go to Dashboard <ArrowRight className="size-4"/>
                        </Link>
                    )}
                </div>
            </div>
        </>
    )
}