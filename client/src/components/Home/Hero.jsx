import React from 'react'
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Navbar } from '../Home/Navbar'; // Make sure path is correct
import { ArrowRight, Star, Video } from 'lucide-react';

export const Hero = () => {

    const { user } = useSelector((state) => state.auth);

    const logos = [
        'https://saasly.prebuiltui.com/assets/companies-logo/instagram.svg',
        'https://saasly.prebuiltui.com/assets/companies-logo/framer.svg',
        'https://saasly.prebuiltui.com/assets/companies-logo/microsoft.svg',
        'https://saasly.prebuiltui.com/assets/companies-logo/huawei.svg',
        'https://saasly.prebuiltui.com/assets/companies-logo/walmart.svg',
    ]

    return (
        <>
            <div className="min-h-screen pb-20">
                {/* Reusable Navbar */}
                <Navbar />

                {/* --- MAIN HERO CONTENT --- */}
                <div className="relative flex flex-col items-center justify-center text-sm px-4 md:px-16 lg:px-24 xl:px-40 text-black">
                    <div className="absolute top-28 xl:top-10 -z-10 left-1/4 size-72 sm:size-96 xl:size-120 2xl:size-132 bg-red-300 blur-[100px] opacity-30"></div>

                    {/* Social Proof */}
                    <div className="flex items-center mt-24 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                        <div className="flex -space-x-3 pr-3">
                            <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200" alt="u1" className="size-9 object-cover rounded-full border-[3px] border-white z-[1]" />
                            <img src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200" alt="u2" className="size-9 object-cover rounded-full border-[3px] border-white z-[2]" />
                            <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200" alt="u3" className="size-9 object-cover rounded-full border-[3px] border-white z-[3]" />
                            <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200" alt="u4" className="size-9 object-cover rounded-full border-[3px] border-white z-[4]" />
                            <img src="https://randomuser.me/api/portraits/men/75.jpg" alt="u5" className="size-9 rounded-full border-[3px] border-white z-[5]" />
                        </div>

                        <div className="pl-2">
                            <div className="flex">
                                {Array(5).fill(0).map((_, i) => (
                                    <Star key={i} className="size-3.5 text-yellow-400 fill-yellow-400" />
                                ))}
                            </div>
                            <p className="text-xs font-medium text-gray-600 mt-0.5">
                                Loved by 10,000+ users
                            </p>
                        </div>
                    </div>

                    {/* Headline */}
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold max-w-5xl text-center mt-8 leading-tight md:leading-[1.15] tracking-tight">
                        Land Your Dream Job With <br className="hidden md:block"/>
                        <span className="bg-gradient-to-r from-red-600 to-rose-500 bg-clip-text text-transparent">AI-Powered Resumes</span>
                    </h1>

                    <p className="max-w-xl text-center text-slate-600 text-base md:text-lg my-8 leading-relaxed">
                        Create, Edit and Download ATS-friendly professional resumes in minutes with our advanced AI assistance.
                    </p>

                    {/* Main CTA Buttons */}
                    <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                        <Link to='/app?state=register' className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white rounded-full px-8 py-3.5 flex items-center justify-center gap-2 shadow-lg shadow-red-200 transition-all active:scale-95 font-medium text-base" hidden={user} >
                            Build My Resume
                            <ArrowRight className="size-4" />
                        </Link>
                        
                        {/* Demo Button */}
                        <Link to="https://www.youtube.com/" className="w-full sm:w-auto">
                            <button className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all rounded-full px-8 py-3.5 text-slate-700 font-medium text-base active:scale-95">
                                <Video className="size-4 text-slate-500" />
                                <span>Watch Demo</span>
                            </button>
                        </Link>
                    </div>

                    <p className="py-8 text-slate-400 text-xs font-medium uppercase tracking-widest mt-12">Trusted by leading companies</p>

                    <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-500 w-full max-w-4xl" id="logo-container">
                        {logos.map((logo, index) => <img key={index} src={logo} alt="brand logo" className="h-6 md:h-8 w-auto hover:scale-110 transition-transform cursor-pointer" />)}
                    </div>
                </div>
            </div>
            
            <style>
                {`
                    @import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');

                    * {
                        font-family: 'Poppins', sans-serif;
                    }
                `}
            </style>
        </>
    );
}