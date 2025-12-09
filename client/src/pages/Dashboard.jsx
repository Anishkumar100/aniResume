import { FilePenLineIcon, LoaderCircleIcon, PencilIcon, PlusIcon, TrashIcon, UploadCloud, UploadCloudIcon, XIcon } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { dummyResumeData } from "../../assets/assets"
import { useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import api from '../../config/api'
import toast from 'react-hot-toast'
import pdfToText from "react-pdftotext"

export const Dashboard = () => {

    const [loading, setLoading] = useState(false)

    const { user, token } = useSelector((state) => state.auth)

    const colors = ["#9333ea", "#d97706", "#dc2626", "#0284c7", "#16a34a"]

    const navigate = useNavigate()

    const [allResumes, setAllResumes] = useState([])

    //for displaying popup when we click on create resume button
    const [showCreateResume, setShowCreateResume] = useState(false)

    //for displaying popup when we click on upload resume button
    const [showUploadResume, setShowUploadResume] = useState(false)

    {/*Used to get the input title of the resume, that we are trying to create */ }
    const [title, setTitle] = useState('')

    {/*Used to get the resume that we try to upload */ }
    const [resume, setResume] = useState(null)

    {/*Used to get the id of the resume that we are trying to edit*/ }
    const [editResumeId, setEditResumeId] = useState('')

    //function to fetch all resumes
    const loadAllResumes = async () => {
        try {
            const { data } = await api.get('api/resumes/user/all', { headers: { Authorization: `Bearer ${token}` } })
            setAllResumes(data.resumes)

        }
        catch (error) {
            toast.error(error?.response?.data?.message || error.message)
        }
    }

    useEffect(() => {
        loadAllResumes()
    }, [])


    const createResume = async (event) => {

        try {
            /*For creating the resume only title is needed */
            event.preventDefault()
            const { data } = await api.post('/api/resumes/create', { title }, { headers: { Authorization: `Bearer ${token}` } })
            //updating the resumes array with the newly created resume
            setAllResumes([...allResumes, data.resume])
            setShowCreateResume(false) //hiding the popup
            navigate(`/app/builder/${data.resume._id}`)
            toast.success("1st Step Done! Now Build Your Resume")
        }
        catch (error) {
            toast.error(error?.response?.data?.message || error.message)
        }

    }



    const uploadResume = async (event) => {

        /*Do Know that we aint sending the whole file as the body for request. We are converting the file to text and then we are sending the text as request for refining it to required json as response*/

        // 1. SAFETY CHECK: Check if a file is actually selected
        if (!resume) {
            toast.error("Please select a PDF file first!");
            return;
        }

        // 3. SAFETY CHECK: Ensure it is a PDF
        if (resume.type !== 'application/pdf') {
            toast.error("Please upload a valid PDF file.");
            return;
        }

        try {
            event.preventDefault()
            setLoading(true)
            /*in the input="file" setResume is used to get the uploaded resume file, so resume is overrided with the resume file */
            const resumeText = await pdfToText(resume)

            // 5. Check if text was actually extracted
            if (!resumeText) {
                toast.error("Could not read text from this PDF. It might be an image scan.");
                setLoading(false);
                return;
            }

            const { data } = await api.post("api/ai/upload-resume", { title, resumeText }, { headers: { Authorization: `Bearer ${token}` } })

            console.log("API RESPONSE:", data); // <--- ADD THIS CHECK

            setTitle('')
            setResume(null)//Clearing the title and resume after upload 
            setShowUploadResume(false) //Hiding the popup
            navigate(`/app/builder/${data.newResume._id}`)
            setAllResumes([...allResumes, data.newResume])
            toast.success("Resume Uploaded! Now You Can Edit It")

        }
        catch (error) {
            toast.error(error?.response?.data?.message || error.message)

        }
        setLoading(false)
    }


    const editTitle = async (event) => {
        try {
            event.preventDefault()
            const { data } = await api.put(`api/resumes/update`, { resumeId: editResumeId, resumeData: title }, { headers: { Authorization: `Bearer ${token}` } })
            //The resumeData currently is title, which not replace any other fields. SInce mongoose doesnt replace fields if not mentioned. The removeBackground field is not needed here as we are just updating the title, it is default false in backend

            setAllResumes(allResumes.map((resume) =>
                resume._id === editResumeId ? { ...resume, title }//just changing the title of the resume which is being edited
                    : resume
            ))

            setTitle("")
            setEditResumeId("")
            toast.success(data.message)
        }
        catch (error) {
            toast.error(error?.response?.data?.message || error.message)
        }

    }


    const deleteResume = async (resumeId) => {
        {/*Function to delete the resume */ }
        const confirm = window.confirm("Are you sure you want to delete this resume?")
        try {
            if (confirm) {
                const { data } = await api.delete(`api/resumes/delete/${resumeId}`, { headers: { Authorization: `Bearer ${token}` } })

                setAllResumes((prevResumes) => prevResumes.filter(resume => resume._id !== resumeId))
                toast.success(data.message)
            }
            else {
                {/*Do nothing */ }
                return
            }

        }
        catch (error) {
            toast.error(error?.response?.data?.message || error.message)
        }

    }


    return (
        <div>
            <div className=' max-w-7xl mx-auto px-4 py-8'>
                <p className=' text-2xl font-medium mb-6 bg-gradient-to-r from-slate-600 to-slate-700 bg-clip-text text-transparent sm:hidden'>Welcome, {user.name}</p>

                {/*Create Resume Div */}
                <div className=' flex gap-4'>
                    <button onClick={() => setShowCreateResume(true)} className=' w-full bg-white sm:max-w-36 h-48 flex flex-col items-center justify-center rounded-lg gap-2 text-slate-600 border border-dashed border-slate-300 group hover:border-green-500 hover:shadow-lg transition-all duration-300 cursor-pointer'>
                        <PlusIcon className=' size-11 transition-all duration-300 p-2.5 bg-gradient-to-br from-green-300 to-green-500 text-white rounded-full' />
                        <p className=' text-sm group-hover:text-green-600 transition-600 transtion-all duration-300'>Create Resume</p>
                    </button>


                    <button onClick={() => setShowUploadResume(true)} className=' w-full bg-white sm:max-w-36 h-48 flex flex-col items-center justify-center rounded-lg gap-2 text-slate-600 border border-dashed border-slate-300 group hover:border-red-500 hover:shadow-lg transition-all duration-300 cursor-pointer'>
                        <UploadCloudIcon className=' size-11 transition-all duration-300 p-2.5 bg-gradient-to-br from-red-300 to-red-500 text-white rounded-full' />
                        <p className=' text-sm group-hover:text-red-600 transition-600 transtion-all duration-300'>Upload Existing Resume</p>
                    </button>
                </div>

                <hr className=' border-slate-300 my-6 sm:w-[305px]'></hr>


                {/*Displaying all resumes */}

                <div className=' grid grid-cols-2 sm:flex flex-wrap gap-4'>
                    {allResumes.map((resume, index) => {
                        const baseColor = colors[index % colors.length]
                        {/*Here you are getting a color from the colors array based of the index value of the resumes array. */ }

                        return (
                            <button onClick={() => navigate(`/app/builder/${resume._id}`)} key={index} className=' relative w-full sm:max-w-36 h-48 flex flex-col items-center justify-center rounded-lg gap-2 border group hover:shadow-lg transition-all duration-300 cursor-pointer ' style={{ background: `linear-gradient(135deg, ${baseColor}10,${baseColor}40)`, borderColor: baseColor + '40' }}>

                                <FilePenLineIcon className=' size-7 group-hover:scale-105 transition-all' style={{ color: baseColor }} />
                                <p className=' text-sm group-hover:scale-105 transition-all px-2 text-center' style={{ color: baseColor }}>{resume.title}</p>

                                <p className=' absolute bottom-1 text-[11px] text-slate-400 group-hover:text-slate-500 transition-all duration-300 px-2 text-center' style={{ color: baseColor + '90' }}>Updated on {new Date(resume.updatedAt).toLocaleDateString()}</p>

                                <div onClick={(e) => e.stopPropagation()} className='absolute top-1 right-1 group-hover:flex items-center hidden'>

                                    <TrashIcon onClick={() => deleteResume(resume._id)}
                                        className=' size-7 p-1.5 hover:bg-red-900/10 rounded text-red-700 transition-colors' />
                                    <PencilIcon onClick={() => { setEditResumeId(resume._id) }}
                                        className=' size-7 p-1.5 rounded hover:bg-green-900/10 text-green-700 transition-colors' />
                                </div>
                            </button>
                        )
                    })}

                </div>









                {/*POPUPS */}
                {/*The popup when we click on the createResume Box */}

                {showCreateResume && (
                    <form onSubmit={createResume} onClick={() => setShowCreateResume(false)} className=' fixed inset-0 bg-black/70 backdrop-blur bg-opacity-50 z-10 flex items-center justify-center'>

                        <div onClick={e => e.stopPropagation()} className=' relative  bg-slate-50 border shadow-md rounded-lg w-full max-w-sm p-6'>
                            <h2 className=' text-xl font-bold mb-4'>Create An Awesome Resume</h2>
                            <input onChange={(e) => setTitle(e.target.value)} value={title} className=' w-full px-4 py-2 mb-4  border border-red-600
                         focus:border-red-600 ring-red-600' type="text" placeholder='Enter Resume Title' required />

                            <button className=' w-full py-2 bg-red-500 text-white rounded hover:bg-red-700 transition-colors'>
                                Get Placed🔥
                            </button>

                            {/*Close Icon at the top of the box from lucide-react */}
                            <XIcon className=' absolute top-4 right-4 text-red-400 hover:text-red-800 cursor-pointer transition-colors' onClick={(() => { setShowCreateResume(false); setTitle('') })} />
                            {/*While popup closes we are making the title from the input to be empty */}
                        </div>

                    </form>
                )}



                {/*Popup to upload the existing resume */}
                {
                    showUploadResume && (

                        <form onSubmit={uploadResume} onClick={() => setShowUploadResume(false)} className=' fixed inset-0 bg-black/70 backdrop-blur bg-opacity-50 z-10 flex items-center justify-center'>

                            <div onClick={e => e.stopPropagation()} className=' relative  bg-slate-50 border shadow-md rounded-lg w-full max-w-sm p-6'>
                                <h2 className=' text-xl font-bold mb-4'>Upload A Resume And Make It More Awesome</h2>
                                <input onChange={(e) => setTitle(e.target.value)} className=' w-full px-4 py-2 mb-4  border border-red-600
                         focus:border-red-600 ring-red-600' type="text" placeholder='Enter Resume Title' required />

                                {/*For the upload ICON */}
                                <div>
                                    <label htmlFor='resume-input' className=' block text-sm text-slate-700'>
                                        Select Resume File (.PDF format)

                                        <div className=' flex flex-col items-center justify-center gap-2 border group text-slate-400 border-slate-400 border-dashed rounded-md p-4 py-10 my-4 hover:border-red-500 hover:text-red-700 cursor-pointer transition-colors'>
                                            {resume ? (
                                                <p className=' text-red-700'>{resume.name}</p>
                                            ) :
                                                <>
                                                    <UploadCloud className=' size-14 stroke-1' />
                                                    <p>Miracles Happen When You Upload!!!</p>
                                                </>}
                                        </div>
                                    </label>
                                    {/* For choosing a File in pdf */}
                                    <input type="file" id="resume-input" accept=".pdf" hidden onChange={(e) => setResume(e.target.files[0])} />
                                </div>

                                <button disabled={loading} className=' w-full py-2 bg-red-500 text-white rounded hover:bg-red-700 transition-colors flex items-center justify-center gap-2'>
                                    {loading && <LoaderCircleIcon className=' animate-spin size-4 text-white' />}  {loading ? "Uploading" : "Get Placed🔥"}
                                </button>

                                {/*Close Icon at the top of the box from lucide-react */}
                                <XIcon className=' absolute top-4 right-4 text-red-400 hover:text-red-800 cursor-pointer transition-colors' onClick={(() => { setShowUploadResume(false); setTitle('') })} />
                                {/*While popup closes we are making the title from the input to be empty */}
                            </div>

                        </form>
                    )
                }



                {editResumeId && (
                    <form onSubmit={editTitle} onClick={() => setEditResumeId(false)} className=' fixed inset-0 bg-black/70 backdrop-blur bg-opacity-50 z-10 flex items-center justify-center'>

                        <div onClick={e => e.stopPropagation()} className=' relative  bg-slate-50 border shadow-md rounded-lg w-full max-w-sm p-6'>
                            <h2 className=' text-xl font-bold mb-4'>Edit Your Resume Title</h2>
                            <input onChange={(e) => setTitle(e.target.value)} value={title} className=' w-full px-4 py-2 mb-4  border border-red-600
                         focus:border-red-600 ring-red-600' type="text" placeholder='Enter Resume Title' required />

                            <button className=' w-full py-2 bg-red-500 text-white rounded hover:bg-red-700 transition-colors'>
                                Update
                            </button>

                            {/*Close Icon at the top of the box from lucide-react */}
                            <XIcon className=' absolute top-4 right-4 text-red-400 hover:text-red-800 cursor-pointer transition-colors' onClick={(() => { setEditResumeId(false) })} />
                            {/*While popup closes we are making the title from the input to be empty */}
                        </div>

                    </form>
                )}


            </div>
        </div>
    )
}
