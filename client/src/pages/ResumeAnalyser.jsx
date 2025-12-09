import React from 'react'
import { Sparkles, Bot, FileSearch, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

export const ResumeAnalyser = () => {
  return (
    <div className="relative min-h-screen w-full bg-slate-950 overflow-hidden flex flex-col items-center justify-center font-sans selection:bg-purple-500/30">
      
      {/* --- Background Effects --- */}
      {/* Animated Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
      
      {/* Floating Blobs */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500/30 rounded-full blur-[100px] animate-pulse delay-1000"></div>
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/20 rounded-full blur-[100px] animate-pulse"></div>

      {/* --- Main Content Card --- */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        
        {/* Animated Icon Badge */}
        <div className="inline-flex items-center justify-center p-2 mb-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-2xl animate-bounce-slow">
          <div className="p-3 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl">
            <Bot className="w-8 h-8 text-white" />
          </div>
        </div>

        {/* Hero Text with Gradient & Animation */}
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40 mb-6 animate-fade-in-up">
          Resume <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 animate-gradient-x">AI Analyser</span>
        </h1>

        <div className="relative inline-block group">
          <h2 className="text-2xl md:text-3xl font-bold text-white/80 mb-2 tracking-widest uppercase">
            Coming Soon
          </h2>
          {/* Underline Animation */}
          <div className="h-1 w-0 group-hover:w-full transition-all duration-700 bg-gradient-to-r from-purple-500 to-blue-500 mx-auto rounded-full"></div>
        </div>

        <p className="text-slate-400 mt-6 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed animate-fade-in-up delay-200">
          We are training our AI models to scan, score, and optimize your resume. 
          <br className="hidden md:block"/> 
          Get ready for <span className="text-purple-300 font-semibold">intelligent insights</span> that land interviews.
        </p>

        {/* Feature Pills */}
        <div className="flex flex-wrap justify-center gap-4 mt-10 animate-fade-in-up delay-300">
          {['ATS Scoring', 'Keyword Matcher', 'Grammar AI', 'Job Fit Analysis'].map((feature, i) => (
            <span key={i} className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-slate-300 flex items-center gap-2 hover:bg-white/10 transition-colors cursor-default">
              <Sparkles className="w-3 h-3 text-purple-400" /> {feature}
            </span>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-12 animate-fade-in-up delay-500">
          <Link to="/" className="group relative inline-flex items-center gap-3 px-8 py-4 bg-white text-slate-950 rounded-full font-bold text-lg hover:scale-105 transition-transform duration-300 overflow-hidden">
            <span className="relative z-10">Back to Dashboard</span>
            <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
            
            {/* Hover Shine Effect */}
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-500 bg-gradient-to-r from-transparent via-white/50 to-transparent skew-x-12"></div>
          </Link>
        </div>

      </div>

      {/* --- Footer Decoration --- */}
      <div className="absolute bottom-0 w-full h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent"></div>
    </div>
  )
}