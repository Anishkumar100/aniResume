import React from 'react'
import { Briefcase, Plus, Trash2, Sparkles, Loader2 } from 'lucide-react'
import { useSelector } from 'react-redux'
import { useState } from 'react'
import toast from 'react-hot-toast'
import api from '../../../config/api'

export const ExperienceForm = ({ data, onChange }) => {

    const { token } = useSelector((state) => state.auth)

    const [generatingJobDescIndex, setGeneratingJobDescIndex] = useState(false)

    const generatingDescription = async (index) => {
        try {
            setGeneratingJobDescIndex(index);
            const experience = data[index]; // Get the specific experience item

            // 1. SAFETY CHECK: Ensure fields are not empty
            if (!experience.description || !experience.company || !experience.position) {
                toast.error("Please fill in Company, Position, and Description first.");
                return; // Stop here, don't call API
            }

            const prompt = `enhance this job description ${experience.description} for the position of ${experience.position} at ${experience.company}`;


            // 2. Renamed destructured variable to avoid name conflict
            const { data: responseData } = await api.post('/api/ai/enhance-job-desc',
                { userContent: prompt },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            updateExperience(index, "description", responseData.enhancedContent);
            toast.success("Job description enhanced!");
        }
        catch (error) {
            console.error("AI Error:", error); // Check console for detailed error
            // Display the specific message sent by the backend (e.g. "API Key Invalid")
            toast.error(error.response?.data?.message || "Something went wrong");
        }
        finally {
            setGeneratingJobDescIndex(false);
        }
    }




    /*
    This data u got from props is actually experience:[] part of resumeData object.
    So here data is an array of experience objects.
    Each experience object has company, position, startDate, endDate, description, is_current
    */

    const addExperience = () => {
        const newExperience = {
            company: "",
            position: "",
            start_date: "",
            end_date: "",
            description: "",
            is_current: false
        }

        onChange([...data, newExperience])

    }


    const removeExperience = (index) => {
        const updatedExperience = data.filter((_, i) => i !== index);

        //this _ is used to ignore the first parameter (which is the element itself), we only need the index i to compare with the index to be removed.

        onChange(updatedExperience)
        /*This updatedExperience is the new data (from the props representing the experience array), that will be updated on the resumeBuilder.jsx page */

    }


    const updateExperience = (index, field, value) => {
        const updatedExperience = [...data];

        //in this 2nd line, we are overriding the specific field (there are a lot of fields) of the experience object at the given index with the new value
        updatedExperience[index] = { ...updatedExperience[index], [field]: value }

        onChange(updatedExperience)
        /*This updatedExperience is the new data (from the props representing the experience array), that will be updated on the resumeBuilder.jsx page */
    }



    return (

        <div className=' space-y-6'>
            <div className=' flex items-center gap-2 text-lg font-semibold text-gray-900 '>
                <div className=' flex items-center justify-between w-full'>

                    <div className=' flex flex-col md:items-start justify-center  gap-2  text-lg font-semibold text-gray-900 text-start'>
                        <h3>Professional Experience</h3>
                        <p className=' text-[12px] text-gray-500'>Add Your Job Experience</p>
                    </div>


                    <button onClick={() => addExperience()} className=' flex items-center gap-2 px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors '>
                        <Plus className=' size-4 text-red-600' />Add Experience
                    </button>

                </div>
            </div>




            {data.length === 0 ? (
                <div className=" text-center py-8 text-gray-500">
                    <Briefcase className=' w-12 h-12 mx-auto mb-3 text-gray-300' />
                    <p>No Work Experience Added Yet.</p>
                    <p className=' text-sm'> Tip:- Click the Red Button "Add Experience" to get Started </p>
                </div>

            ) : (

                <div className='space-y-4'>
                    {/*Map through each experience object in the data array and create a form for each */}

                    {data.map((experience, index) => {
                        return (
                            <div key={index} className=' p-4 border border-gray-300 rounded-lg space-y-3'>

                                <div className=' flex justify-between items-start'>
                                    <h4 className=' flex justify-between items-start'>Experience No.{index + 1}</h4>

                                    <button onClick={() => removeExperience(index)} className=' text-red-500 hover:text-red-700 transition-colors'>
                                        <Trash2 className="size-4" />
                                    </button>
                                </div>


                                <div className=' grid md:grid-cols-2 gap-3'>
                                    <input value={experience.company || ""} onChange={(e) => updateExperience(index, "company", e.target.value)} type="text" placeholder='Company Name' className=' border-gray-300 rounded-lg focus:ring focus:ring-red-500  focus:border-red-500 outline-none transition-colors px-3 py-2 text-sm ' />



                                    <input value={experience.position || ""} onChange={(e) => updateExperience(index, "position", e.target.value)} type="text" placeholder='Job Title' className=' px-3 border-gray-300 focus:ring focus:ring-red-500  focus:border-red-500 outline-none transition-colors py-2 text-sm rounded-lg' />


                                    <input value={experience.start_date || ""} onChange={(e) => updateExperience(index, "start_date", e.target.value)} type="text" placeholder='Joining Date' className='border-gray-300  focus:ring focus:ring-red-500  focus:border-red-500 outline-none transition-colors px-3 py-2 text-sm rounded-lg' />

                                    <input value={experience.end_date || ""} onChange={(e) => updateExperience(index, "end_date", e.target.value)} type="text" placeholder='End Date' disabled={experience.is_current} className='border-gray-300 rounded-lg focus:ring focus:ring-red-500  focus:border-red-500 outline-none transition-colors px-3 py-2 text-sm disabled:bg-gray-100' />
                                </div>



                                <label className=' flex items-center gap-2'>
                                    <input className=" rounded border-gray-300 text-red-600 focus:ring-red-500" type="checkbox" checked={experience.is_current || false} onChange={(e) => { updateExperience(index, "is_current", e.target.checked ? true : false) }} />

                                    <span className=' text-sm text-gray-700'>Currently Working Here?</span>

                                </label>


                                <div className=' space-y-2'>

                                    <div className=" mt-4 mb-4 flex items-center justify-between">
                                        <label className=' text-sm font-medium text-gray-700'>Job Description</label>

                                        <button disabled={generatingJobDescIndex === index || !experience.position || !experience.company || !experience.description}
                                            onClick={() => generatingDescription(index)} className=' flex items-center gap-1 px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition-colors disabled:opacity-50'>
                                            {generatingJobDescIndex === index ? (<Loader2 className=' w-3 h-3 animate-spin' />) : (<Sparkles className="w-3 h-3" />)}
                                            {generatingJobDescIndex === index ? "Doing Magic..." : "Enhance with AI"}

                                        </button>





                                    </div>
                                    <div>
                                        <textarea onChange={(e) => updateExperience(index, "description", e.target.value)} value={experience.description || ""} rows={4} className=' placeholder:text-gray-400 w-full text-sm px-3 py-2 rounded-lg resize-none' placeholder='Describe Your Key Responsibilities And Achievements' />
                                    </div>
                                </div>

                            </div>

                        )
                    })}


                </div>

            )}
        </div>
    )
}
