import React from 'react'

import { Plus, Trash2, Sparkles, GraduationCap } from 'lucide-react'

export const EducationForm = ({ data, onChange }) => {

  const addEducation = () => {
    const newEducation = {
      institution: "",
      degree: "",
      field: "",
      graduation_date: "",
      gpa: ""
    }

    onChange([...data, newEducation])

  }


  const removeEducation = (index) => {
    const updatedEducation = data.filter((_, i) => i !== index);

    //this _ is used to ignore the first parameter (which is the element itself), we only need the index i to compare with the index to be removed.

    onChange(updatedEducation)
    /*This updatedEducation is the new data (from the props representing the education array), that will be updated on the resumeBuilder.jsx page */

  }


  const updateEducation = (index, field, value) => {
    const updatedEducation = [...data];

    //in this 2nd line, we are overriding the specific field (there are a lot of fields) of the education object at the given index with the new value
    updatedEducation[index] = { ...updatedEducation[index], [field]: value }

    onChange(updatedEducation)
    /*This updatedEducation is the new data (from the props representing the education array), that will be updated on the resumeBuilder.jsx page */
  }



  return (
    <div className=' space-y-6'>
      <div className=' flex items-center gap-2 text-lg font-semibold text-gray-900 '>
        <div className=' flex items-center justify-between w-full'>

          <div className=' flex flex-col md:items-start justify-center  gap-2  text-lg font-semibold text-gray-900 text-start'>
            <h3>Education</h3>
            <p className=' text-[12px] text-gray-500'>Add Your Education Details</p>
          </div>


          <button onClick={() => addEducation()} className=' flex items-center gap-2 px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors '>
            <Plus className=' size-4 text-red-600' />Add Education
          </button>

        </div>
      </div>




      {data.length === 0 ? (
        <div className=" text-center py-8 text-gray-500">
          <GraduationCap className=' w-12 h-12 mx-auto mb-3 text-gray-300' />
          <p>No Education Details Added Yet.</p>
          <p className=' text-sm'> Tip:- Click the Red Button "Add Education" to get Started </p>
        </div>

      ) : (

        <div className='space-y-4'>
          {/*Map through each experience object in the data array and create a form for each */}

          {data.map((education, index) => {
            return (
              <div key={index} className=' p-4 border border-gray-300 rounded-lg space-y-3'>

                <div className=' flex justify-between items-start'>
                  <h4 className=' flex justify-between items-start'>Education No.{index + 1}</h4>

                  <button onClick={() => removeEducation(index)} className=' text-red-500 hover:text-red-700 transition-colors'>
                    <Trash2 className="size-4" />
                  </button>
                </div>


                <div className=' grid md:grid-cols-2 gap-3'>
                  <input value={education.institution || ""} onChange={(e) => updateEducation(index, "institution", e.target.value)} type="text" placeholder='Institution Name' className=' border-gray-300 focus:ring focus:ring-red-500  focus:border-red-500 outline-none transition-colors px-3 py-2 text-sm rounded-lg' />

                  <input value={education.degree || ""} onChange={(e) => updateEducation(index, "degree", e.target.value)} type="text" placeholder='Degree Completed' className=' border-gray-300  focus:ring focus:ring-red-500  focus:border-red-500 outline-none transition-colors px-3 py-2 text-sm rounded-lg' />

                  <input value={education.field || ""} onChange={(e) => updateEducation(index, "field", e.target.value)} type="text" placeholder='Field Of Study' className=' border-gray-300  focus:ring focus:ring-red-500  focus:border-red-500 outline-none transition-colors px-3 py-2 text-sm rounded-lg disabled:bg-gray-100' />



                  <input value={education.graduation_date || ""} onChange={(e) => updateEducation(index, "graduation_date", e.target.value)} type="text" placeholder='Graduation Date' className=' border-gray-300 focus:ring focus:ring-red-500  focus:border-red-500 outline-none transition-colors px-3 py-2 text-sm rounded-lg disabled:bg-gray-100' />



                  <input value={education.gpa || ""} onChange={(e) => updateEducation(index, "gpa", e.target.value)} type="text" placeholder='Overall Percentage or GPA' className=' px-3 py-2 text-sm rounded-lg border-gray-300 focus:ring focus:ring-red-500  focus:border-red-500 outline-none transition-colors disabled:bg-gray-100' />
                </div>


               
              </div>

            )
          })}


        </div>

      )}
    </div>
  )
}
