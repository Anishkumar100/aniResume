import React from 'react'
import { Plus, Trash2, Workflow } from 'lucide-react'

export const ProjectForm = ({ data, onChange }) => {

    const addProject = () => {
        const newProject = {
            name: "",
            type: "",
            deployedURL: "",
            repositoryURL: "",
            description: "",
        }

        onChange([...data, newProject])

    }


    const removeProject = (index) => {
        const updatedProject = data.filter((_, i) => i !== index);

        //this _ is used to ignore the first parameter (which is the element itself), we only need the index i to compare with the index to be removed.

        onChange(updatedProject)
        /*This updatedProject is the new data (from the props representing the project array), that will be updated on the resumeBuilder.jsx page */

    }


    const updateProject = (index, field, value) => {
        const updatedProject = [...data];

        //in this 2nd line, we are overriding the specific field (there are a lot of fields) of the project object at the given index with the new value
        updatedProject[index] = { ...updatedProject[index], [field]: value }

        onChange(updatedProject)
        /*This updatedProject is the new data (from the props representing the project array), that will be updated on the resumeBuilder.jsx page */
    }





    return (
        <div className=' space-y-6'>
            <div className=' flex items-center gap-2 text-lg font-semibold text-gray-900 '>
                <div className=' flex items-center justify-between w-full'>

                    <div className=' flex flex-col md:items-start justify-center  gap-2  text-lg font-semibold text-gray-900 text-start'>
                        <h3>Your Projects</h3>
                        <p className=' text-[12px] text-gray-500'>Add All The Details Of Your Projects</p>
                    </div>


                    <button onClick={() => addProject()} className=' flex items-center gap-2 px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors '>
                        <Plus className=' size-4 text-red-600' />Add Project
                    </button>

                </div>
            </div>




            {data.length === 0 ? (
                <div className=" text-center py-8 text-gray-500">
                    <Workflow className=' w-12 h-12 mx-auto mb-3 text-gray-300' />
                    <p>No Project Details Added Yet.</p>
                    <p className=' text-sm'> Tip:- Click the Red Button "Add Project" to get Started </p>
                </div>

            ) : (

                <div className='space-y-4'>
                    {/*Map through each experience object in the data array and create a form for each */}

                    {data.map((Project, index) => {
                        return (
                            <div key={index} className=' p-4 border border-gray-300 rounded-lg space-y-3'>

                                <div className=' flex justify-between items-start'>
                                    <h4 className=' flex justify-between items-start'>Project No.{index + 1}</h4>

                                    <button onClick={() => removeProject(index)} className=' text-red-500 hover:text-red-700 transition-colors'>
                                        <Trash2 className="size-4" />
                                    </button>
                                </div>


                                <div className=' grid md:grid-cols gap-3'>
                                    <input value={Project.name || ""} onChange={(e) => updateProject(index, "name", e.target.value)} type="text" placeholder='Name Of Your Project' className='border-gray-300  focus:ring focus:ring-red-500  focus:border-red-500 outline-none transition-colors px-3 py-2 text-sm rounded-lg' />

                                    <input value={Project.type || ""} onChange={(e) => updateProject(index, "type", e.target.value)} type="text" placeholder="Project's Domain" className=' border-gray-300 focus:ring focus:ring-red-500  focus:border-red-500 outline-none transition-colors px-3 py-2 text-sm rounded-lg' />


                                    <input value={Project.deployedURL || ""} onChange={(e) => updateProject(index, "deployedURL", e.target.value)} type="url" placeholder='Deployed URL For The Project (Optional)' className='border-gray-300 focus:ring focus:ring-red-500  focus:border-red-500 outline-none transition-colors px-3 py-2 text-sm rounded-lg disabled:bg-gray-100' />



                                    <input value={Project.repositoryURL || ""} onChange={(e) => updateProject(index, "repositoryURL", e.target.value)} type="url" placeholder='Repository URL Of The Project (Optional)' className=' px-3 py-2 text-sm rounded-lg border-gray-300 focus:ring focus:ring-red-500  focus:border-red-500 outline-none transition-colors disabled:bg-gray-100' />




                                    <textarea rows={7} value={Project.description || ""} onChange={(e) => updateProject(index, "description", e.target.value)} className=' w-full placeholder:text-gray-400  p-3 px-4 mt-2 border text-sm border-gray-300 rounded-lg focus:ring focus:ring-red-500  focus:border-red-500 outline-none transition-colors resize-none' placeholder={`Write A Brief Description Of Your Project. Don't Brag About Unnecessary Things Like "I Did My Project Even After Been Hit By A TukTuk With My Broken Hand, Make It Short, And Concise.... `} />




                                </div>



                            </div>

                        )
                    })}


                </div>

            )}
        </div>
    )
}
