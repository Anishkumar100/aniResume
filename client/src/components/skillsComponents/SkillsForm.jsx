import { Plus, Sparkles, X } from 'lucide-react'
import React from 'react'
import { useState } from 'react'

export const SkillsForm = ({data,onChange}) => {

    const [newSkill, setNewSkill] = useState("")


    const addSkill = () => 
    {
        //if the newSkill trimmed is not already present in the data (skills) array, then only add it.

        if (newSkill.trim() && !data.includes(newSkill.trim()))
        {
            onChange([...data, newSkill.trim()])
            setNewSkill("")
        }

        else
        {
            alert(`Skill Already Added`)
        }


    }


    const enterBtnLogic = (e)=>
    {
        if(e.key==="Enter")
        {
            e.preventDefault();
            addSkill()
        }
    }


    const removeSkill = (index) => {
        const updatedSkills = data.filter((_, i) => i !== index);
        onChange(updatedSkills)
    }

   return (
    <div className=' space-y-4'>
        <div className='flex flex-col md:items-start justify-center  gap-2  text-lg font-semibold text-gray-900 text-start'>
            <h3 className='flex items-center gap-2 text-lg font-semibold text-gray-900'> Your Skills</h3>

            <p className='text-[12px] text-gray-500'>Add Your Technical And Soft Skills</p>
        </div>    


        <div className=' flex gap-2'>

            <input onKeyDown={enterBtnLogic} value={newSkill} onChange={(e)=>setNewSkill(e.target.value)} type="text" placeholder=' Enter A Skill (ex:- Javascript)' className=' border-gray-300  focus:ring focus:ring-red-500  focus:border-red-500 flex-1 px-3 py-2 text-sm'/>

            <button onClick={addSkill} disabled={!newSkill.trim()} className=' flex items-center gap-2 px-4 py-2 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed '>
                <Plus className='size-4'/>Add Skill
            </button>
        </div>  

         {data.length > 0 ? (
            <div className=' flex flex-wrap gap-2'>
                {data.map((skill, index) => (
                    
                    <span key={index} className=' flex items-center gap-1 px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm'>
                        {skill}
                        <button onClick={()=> removeSkill(index)} className=' ml-1 hover:bg-red-200 rounded-full p-0.5 transition-colors'>
                            <X className=' w-3 h-3'/>
                        </button>
                    </span>
                        
                    
                ))}
            </div>
         ):
         (
            <div className=' text-center py-6 text-[12px] text-gray-500'>
                <Sparkles className=' w-10 h-10 mx-auto mb-2 text-gray-300' />
                <p>No Skills Added Yet.</p>
                <p>Add Your Technical And Soft Skills Above</p>
            </div>
         )}

         <div className=' bg-red-50 p-3 rounded-lg'>
            <p className='text-sm text-red-800 text-justify'><strong>Tip:</strong> Add 8-12 Relevant Skills. Include Both Technical And Soft Skills (Leadership and Communication). But Prioritize Technical Skills And Add Them First Followed By Non-Technical Skills.</p>
         </div>
    </div>
  )
}
