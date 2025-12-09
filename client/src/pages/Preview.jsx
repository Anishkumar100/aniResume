import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Loader } from '../components/commonComponents/Loader'
import { ResumePreview } from '../components/commonComponents/ResumePreview'
import { ArrowLeftIcon } from 'lucide-react'
import api from '../../config/api'
import toast from 'react-hot-toast'

export const Preview = () => {

  const { resumeId } = useParams()
  const [resumeData, setResumeData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  const loadResume = async () => {
    try {
      const adminToken = localStorage.getItem('adminToken');
      let res;

      // --- SMART LOGIC ---
      if (adminToken) {
        // 1. If Admin Token exists, try fetching via Admin Route (Access to Private & Public)
        try {
          res = await api.get(`/api/admin/resumes/${resumeId}`, {
            headers: { 'Authorization': `Bearer ${adminToken}` }
          });
        } catch (adminError) {
          console.log(`Get Out You Stupid Hacker: ${adminError.message}`);
          throw new Error("Admin access failed");
        }
      } else {
        // 2. No Admin Token? Use Standard Public Route (Strictly Public Only)
        res = await api.get(`/api/resumes/public/${resumeId}`);
      }

      setResumeData(res.data.resume);

    } catch (error) {
      console.error("Error fetching resume:", error);
      // Only show error toast if BOTH attempts failed (meaning resume is private or doesn't exist)
      toast.error("Resume not found or is private.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadResume()
  }, [])

  return resumeData ? (
    <div className=' bg-slate-100 min-h-screen'>
      <div className=' max-w-3xl mx-auto py-10'>
        {/* Props kept exactly as requested */}
        <ResumePreview classes="py-4 bg-white" data={resumeData} template={resumeData.template} accentColor={resumeData.accent_color}/>
      </div>
    </div>
  ) : (
    <div>
      {isLoading ? <Loader /> : (
        <div className=' flex flex-col items-center justify-center h-screen'>
          <p className='text-center text-6xl text-slate-400'>Resume Not Found</p>
          <a href='/' className=' mt-6 bg-red-500 hover:bg-red-600 text-white rounded-full px-6 h-9 m-1 ring-offset-1 ring-1 ring-red-400 flex items-center transtion-colors'>
            <ArrowLeftIcon className=' mr-2 size-4' />
            Go To Home Page
          </a>
        </div>)}
    </div>
  )
}