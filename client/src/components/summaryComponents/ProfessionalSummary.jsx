import { Loader2, Sparkles } from 'lucide-react'
import React from 'react'
import { useSelector } from 'react-redux'
import { useState } from 'react'
import api from '../../../config/api'
import toast from 'react-hot-toast'

export const ProfessionalSummary = ({data,onChange}) => {


    const {token} = useSelector((state)=>state.auth)

    const [isGenerating,setIsGenerating]=useState(false)


    const generateSummary=async()=>{
        try
        {
            setIsGenerating(true)
            // 1. Check if there is data to enhance
            if (!data) {
                toast.error("Please write something first for AI to enhance!");
                return;
            }
            const prompt =` enhance my professional summary ${data}`

            const res = await api.post("api/ai/enhance-pro-sum",{userContent:prompt},{
                headers:{
                    Authorization:`Bearer ${token}`
                }
            })

            // 2. FIX: Use the 'onChange' prop to update the parent state
            // Do NOT use setResumeData here because it is not defined in this file
            onChange(res.data.enhancedContent);
            toast.success("Summary enhanced successfully!");
        }
        catch(err){
            toast.error(err?.response?.res?.message||"Something Went Wrong")
        }
        finally{
            setIsGenerating(false)
        }
    }

  return (
    <div className=' space-y-4'>

        <div className=' flex items-center justify-between w-full'>
            
            <div className=' flex flex-col md:items-start justify-center  gap-2  text-lg font-semibold text-gray-900 text-start'>
                <h3>Professional Summary</h3>
                <p className=' text-[12px] text-gray-500'>Add Summary For Your Resume Here</p>
            </div>


            <button disabled={isGenerating} onClick={generateSummary} className=' flex items-center gap-2 px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors disabled:opacity-50'>
                {isGenerating ? (<Loader2 className=' size-4 animate-spin'/>): (<Sparkles className=' size-4 text-red-600'/>)}
                {isGenerating ? 'Doing Magic...':'Enhance with AI'}
            </button>



        </div>

        <div className=' mt-6'>

            <textarea rows={7} value={data} onChange={(e)=>onChange(e.target.value)} className=' w-full placeholder:text-gray-400  p-3 px-4 mt-2 border text-sm border-gray-300 rounded-lg focus:ring focus:ring-red-500  focus:border-red-500 outline-none transition-colors resize-none' placeholder={`Don't Write Some Stories Like "I Broke My Hand, A TukTuk Hit Me" or Something Irrelevant Like "I am Handsome". Write about yourself highlighting your key strengths and skills, respective to the job you are applying....`}/>

         <p className=' text-xs text-gray-500 max-w-4/5 mx-auto text-center'>One More Tip: Keep It Short And Sweet (3-4 sentences) and as said above don't brag about stories and irrelevant details</p>
        </div>

    </div>
  )
}




