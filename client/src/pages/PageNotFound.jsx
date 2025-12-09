import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, MoveLeft, FileQuestion } from 'lucide-react';

export const PageNotFound = () => {
  const navigate = useNavigate();

  return (
    // Main Container - centers everything and sets minimum height
    <div className="relative min-h-screen bg-gray-50 flex flex-col items-center justify-center overflow-hidden px-6 py-12">
      
      {/* Background decorative element - Giant faded 404 */}
      <div className="absolute inset-0 flex items-center justify-center select-none opacity-[0.03] pointer-events-none">
        <span className='text-[30rem] font-black text-gray-900'>404</span>
      </div>

      {/* Main Content Card */}
      <div className="relative z-10 max-w-2xl w-full text-center">
        
        {/* Icon & Main Heading */}
        <div className="mb-8 flex justify-center animate-bounce-slow">
            <div className="p-4 bg-red-100 rounded-full">
                <FileQuestion className="size-16 text-red-500" />
            </div>
        </div>
        
        <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 tracking-tight mb-4">
          Page not found
        </h1>
        
        <p className="text-lg text-gray-600 mb-10 max-w-md mx-auto leading-relaxed">
          Oops! The page you are looking for doesn't exist. It might have been moved or deleted.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          
          {/* Go Back Button using useNavigate */}
          <button 
            onClick={() => navigate(-1)} 
            className="group flex items-center gap-2 px-6 py-3 bg-white text-gray-700 border border-gray-300 rounded-xl font-medium hover:bg-gray-50 hover:border-gray-400 transition-all w-full sm:w-auto justify-center shadow-sm"
          >
            <MoveLeft className="size-5 group-hover:-translate-x-1 transition-transform" />
            Go Back
          </button>

          {/* Go Home Button using Link */}
          <Link 
            to="/app" // Assuming /app is your main dashboard/home
            className="group flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-medium hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg w-full sm:w-auto justify-center"
          >
            <Home className="size-5" />
            Back to Home
          </Link>
        </div>

      </div>
      
      {/* Optional Footer/Help Link */}
      <div className="absolute bottom-8 text-sm text-gray-500">
        Need help? <a href="/contact" className="text-blue-600 hover:underline">Contact Support</a>
      </div>

    </div>
  )
}