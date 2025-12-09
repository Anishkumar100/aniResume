import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { dummyResumeData } from '../../assets/assets'
import { Link } from 'react-router-dom'
import { ArrowLeftIcon, Briefcase, ChevronLeft, ChevronRight, DownloadIcon, EyeIcon, EyeOffIcon, FileText, FolderIcon, GraduationCap, Share2Icon, Sparkles, User } from "lucide-react"
import { ResumePreview } from '../components/commonComponents/ResumePreview.jsx'

import { PersonalInfoForm } from '../components/personalInfoComponents/PersonalInfoForm.jsx'
import { TemplateSelector } from '../components/commonComponents/TemplateSelector.jsx'
import { ColorPicker } from '../components/commonComponents/ColorPicker.jsx'
import { ProfessionalSummary } from '../components/summaryComponents/ProfessionalSummary.jsx'
import { ExperienceForm } from '../components/experienceComponents/ExperienceForm.jsx'
import { EducationForm } from '../components/educationComponents/EducationForm.jsx'
import { ProjectForm } from '../components/projectComponents/ProjectForm.jsx'
import { SkillsForm } from '../components/skillsComponents/SkillsForm.jsx'
import { useSelector } from 'react-redux'
import api from '../../config/api.js'
import toast from 'react-hot-toast'


export const ResumeBuilder = () => {

  const { resumeId } = useParams()

  //destructuring token from the auth slice of redux store
  const { token } = useSelector((state) => state.auth)


  const [resumeData, setResumeData] = useState(
    {
      _id: "",
      title: "",
      personal_info: {},
      professional_summary: "",
      experience: [],
      education: [],
      projects: [],
      skills: [],
      template: "classic",
      accent_color: "#3B82F6",
      public: false,
    })


  /*This function is for getting the data from the uploaded resume. */
  const loadExistingResume = async () => {

    try {
      const { data } = await api.get(`/api/resumes/get/${resumeId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      if (data?.resume) {
        setResumeData(data.resume)
        document.title = data.resume.title
      }
    }
    catch (error) {
      console.error("Error loading existing resume:", error);
      toast.error(error.response?.data?.message || "Failed to load resume")
    }


  }

  const [activeSectionIndex, setActiveSectionIndex] = useState(0)  //represents index of the sections array for progress bar

  const [removeBackground, setRemoveBackground] = useState(false)

  const sections = [
    { id: "personal", name: "Personal Info", icon: User },

    { id: "summary", name: "summary", icon: FileText },

    { id: "experience", name: "Experience", icon: Briefcase },

    { id: "education", name: "Education", icon: GraduationCap },

    { id: "projects", name: "Projects", icon: FolderIcon },

    { id: "skills", name: "Skills", icon: Sparkles },

  ]


  //current section the user will be in
  const activeSection = sections[activeSectionIndex]

  useEffect(() => {
    loadExistingResume()
  }, [])


  //function to update the resume everytime user clicks on save changes button
  const saveResume = async () => {
    try {
      // 1. Clone the data so we don't mutate the state directly
      let updatedResumeData = structuredClone(resumeData);

      const formData = new FormData();

      // 2. Handle Image Logic
      if (typeof resumeData.personal_info.image === "object" && resumeData.personal_info.image !== null) {
        // If it's a File object, append it to FormData separately
        formData.append("image", resumeData.personal_info.image);

        // Remove it from the JSON object so it doesn't crash JSON.stringify
        delete updatedResumeData.personal_info.image;
      }

      // 3. Append the rest of the data
      formData.append("resumeId", resumeId);
      formData.append("resumeData", JSON.stringify(updatedResumeData));

      if (removeBackground) {
        formData.append("removeBackground", true);
      }

      // 4. API Call (This must run EVERY time)
      const { data } = await api.put(`/api/resumes/update`, formData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      // 5. Update state with the saved data (which includes the new image URL from backend)
      setResumeData(data.resume);
      toast.success(data.message);

    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to save resume");
    }

/*
Thereason we delete the image from the updatedResumeData:
The Serialization Problem: React stores uploaded images as binary "File Objects," but JSON.stringify() cannot process binary data. If you try to convert the resume object to JSON with the file inside, it turns the file into an empty object {}, destroying your image data.

Separating the Data Lanes: We solve this by using FormData to create two separate compartments. The raw File Object is moved to a dedicated "binary lane" using formData.append('image', file), ensuring it travels as a proper file upload that the backend can read.

Why Deletion is Necessary: Since the file is now safely in its own compartment, we must delete it from the original JSON object. If we didn't, the JSON version would still carry that broken empty object {}, which would overwrite and corrupt your image path in the database.

The Backend Reassembly: The server receives the file separately, uploads it to the cloud (like ImageKit), and gets a permanent URL. It then "injects" this new URL back into the JSON data, filling the empty spot with a valid link before saving everything to the database.

*/
}


  const changeResumeVisibility = async () => {
    try {
      const formData = new FormData();
      formData.append("resumeId", resumeId)
      formData.append("resumeData", JSON.stringify({ ...resumeData, public: !resumeData.public }))

      const { data } = await api.put(`/api/resumes/update`, formData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      setResumeData({ ...resumeData, public: !resumeData.public })

      toast.success(data.message)
    }
    catch (error) {
      toast.error(error.response?.data?.message || "Failed to change resume visibility")
    }
  }



const shareResumeFunction = async () => {
    try {
      // 1. Get the base domain safely (e.g., http://localhost:5173)
      const frontendUrl = window.location.origin;
      const resumeUrl = `${frontendUrl}/view/${resumeId}`;

      // 2. Try the Native Web Share API (Works mostly on Mobile)
      if (navigator.share) {
        await navigator.share({
          title: "My Resume",
          text: "Check out my resume created with AI Builder!",
          url: resumeUrl,
        });
      } else {
        // 3. Fallback: Copy to Clipboard (Desktop / Unsupported Browsers)
        throw new Error("Web Share not supported"); 
      }
    } catch (error) {
      // 4. Handle Errors & Fallback
      // If user cancelled share, do nothing. If share isn't supported, copy link.
      if (error.name !== "AbortError") {
        const frontendUrl = window.location.origin;
        const resumeUrl = `${frontendUrl}/view/${resumeId}`;
        
        await navigator.clipboard.writeText(resumeUrl);
        toast.success("Resume link copied to clipboard!");
      }
    }
  };

  const downloadResume = () => {
    window.print();
  }


  return (
    <div>

      <div className=' max-w-7xl mx-auto px-4 py-6 '>
        <Link to={`/app`} className='inline-flex gap-2 items-center text-slate-500 hover:text-slate-700 transition-all'>
          <ArrowLeftIcon className="size-4" />
          Back to Dashboard
        </Link>
      </div>

      <div className=' max-w-7xl mx-auto px-4 pb-8'>
        <div className=' grid lg:grid-cols-12 gap-8'>

          {/*Left Side - Form*/}
          <div className=' relative lg:col-span-5 rounded-lg overflow-hidden'>

            <div className=' bg-white rounded-lg shadow-sm border border-gray-200 p-6 pt-1'>
              {/*Progress Bar using activeSectionIndex */}
              <hr className=' absolute top-0 left-0 right-0 border-2 border-gray-200' />

              <hr className=' absolute top-0 left-0 h-1 bg-gradient-to-r from-red-500 to-red-600 border-none transition-all duration-2000' style={{ width: `${activeSectionIndex * 100 / (sections.length - 1)}%` }} />


              {/*Section Navigation */}
              <div className=' flex justify-between items-center mb-6 border-b border-gray-300 py-1'>

                {/*div to change the resume template and to pick colors */}
                <div className=' flex  items-center gap-2'>
                  <TemplateSelector selectedTemplate={resumeData.template} onChange={(template) => setResumeData(prev => ({ ...prev, template }))} />

                  <ColorPicker selectedColor={resumeData.accent_color} onChange={(accent_color) => setResumeData(prev => ({ ...prev, accent_color }))} />
                </div>

                <div className=' flex items-center'>
                  {activeSectionIndex !== 0 && (
                    <button onClick={() => setActiveSectionIndex(activeSectionIndex - 1)} className=' flex items-center gap-1 p-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all' disabled={activeSectionIndex === 0}>

                      <ChevronLeft className='size-4' /> Previous
                    </button>
                  )
                  }

                  {/*Kept sections.length-1 coz, we started activeSectionIndex = 0  */}

                  {activeSectionIndex < sections.length - 1 && (
                    <button onClick={() => setActiveSectionIndex(activeSectionIndex + 1)} className={` flex items-center gap-1 p-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all ${activeSection === sections.length - 1 && `opacity-50`}`} disabled={activeSectionIndex === sections.length - 1}>

                      Next <ChevronRight className='size-4' />
                    </button>)}

                </div>
              </div>



              {/*Creation of forms */}

              {/*Section 1: Personal Info */}
              <div className=' space-y-6 '>
                {/*resumeData.personalInfo is from the object we created. Used when we upload a resume */}
                {activeSection.id === "personal" && (
                  <div>
                    <PersonalInfoForm data={resumeData.personal_info} onChange={(data) => setResumeData(prev => ({ ...prev, personal_info: data }))} removeBackground={removeBackground} setRemoveBackground={setRemoveBackground} />

                    {/* the onChange property is used for updation of the resumeData. That too only the personalInfoForm with the data that is going to be obtained from the PersonalInfoForm Component */}
                  </div>

                )}
              </div>



              {/*Section 2: Professional Summary */}
              <div className=' space-y-6 '>
                {/*resumeData.professional_summary is from the object we created. Used when we upload a resume */}
                {activeSection.id === "summary" && (
                  <div>
                    <ProfessionalSummary data={resumeData.professional_summary} onChange={(data) => setResumeData(prev => ({ ...prev, professional_summary: data }))} />

                    {/* the onChange property is used for updation of the resumeData. That too only the professional_summary with the data that is going to be obtained from the Professional_summary Component */}
                  </div>
                )}
              </div>


              {/*Section 3: Experience Of the User*/}
              <div className=' space-y-6 '>
                {/*resumeData.experience is from the object we created. Used when we upload a resume */}
                {activeSection.id === "experience" && (
                  <div>
                    <ExperienceForm data={resumeData.experience} onChange={(data) => setResumeData(prev => ({ ...prev, experience: data }))} />

                    {/* the onChange property is used for updation of the resumeData. That too only the experience with the data that is going to be obtained from the ExperienceForm Component */}
                  </div>

                )}
              </div>




              {/*Section 4: Education Of the User*/}
              <div className=' space-y-6 '>
                {/*resumeData.education is from the object we created. Used when we upload a resume */}
                {activeSection.id === "education" && (
                  <div>
                    <EducationForm data={resumeData.education} onChange={(data) => setResumeData(prev => ({ ...prev, education: data }))} />

                    {/* the onChange property is used for updation of the resumeData. That too only the education with the data that is going to be obtained from the EducationForm Component */}
                  </div>

                )}
              </div>



              {/*Section 5: Projects Of the User*/}
              <div className=' space-y-6 '>
                {/*resumeData.project is from the object we created. Used when we upload a resume */}
                {activeSection.id === "projects" && (
                  <div>
                    <ProjectForm data={resumeData.projects} onChange={(data) => setResumeData(prev => ({ ...prev, projects: data }))} />

                    {/* the onChange property is used for updation of the resumeData. That too only the project with the data that is going to be obtained from the ProjectForm Component */}
                  </div>

                )}
              </div>



              {/*Section 6: Skills Of the User*/}
              <div className=' space-y-6 '>
                {/*resumeData.skills is from the object we created. Used when we upload a resume */}
                {activeSection.id === "skills" && (
                  <div>
                    <SkillsForm data={resumeData.skills} onChange={(data) => setResumeData(prev => ({ ...prev, skills: data }))} />

                    {/* the onChange property is used for updation of the resumeData. That too only the skills with the data that is going to be obtained from the SkillsForm Component */}
                  </div>

                )}
              </div>



              <button onClick={() => { toast.promise(saveResume, { loading: `Saving...` }) }} className=' bg-gradient-to-br from-rose-100 to-rose-200 ring-rose-300 text-rose-600 ring hover:ring-rose-400 transition-all rounded-md px-6 py-2 mt-6 text-sm'>
                Save Changes
              </button>

            </div>

          </div>





          {/*Right Side - Preview */}
          <div className=' lg:col-span-7 max-lg:mt-6'>
            <div className=' relative w-full '>
              <div className='absolute bottom-3 left-0 right-0 flex items-center justify-end gap-2'>

                {resumeData.public && (
                  <button onClick={shareResumeFunction} className=' flex items-center p-2 px-4 gap-2 text-xs bg-gradient-to-br from-blue-200 text-blue-600 rounded-lg ring-blue-300 hover:ring transition-colors'>
                    <Share2Icon className='size-4' /> Share Resume
                  </button>
                )}

                <button onClick={changeResumeVisibility} className=' flex items-center p-2 px-4 gap-2 text-xs bg-gradient-to-br from-purple-100 to-purple-200 text-purple-600 ring-purple-300 rounded-lg hover:ring transition-colors'>
                  {resumeData.public ? <EyeIcon className="size-4" /> : <EyeOffIcon className=' size-4' />}
                  {resumeData.public ? "Public" : "Private"}
                </button>



                <button onClick={downloadResume} className=' flex items-center gap-2 px-6 py-2 text-xs bg-gradient-to-br from-green-100 to-green-200 text-green-600 rounded-lg ring-green-300 hover:ring transition-colors'>

                  <DownloadIcon className='size-4' /> Download Resume

                </button>
              </div>
            </div>

            <div>
              {/*-----Resume Preview-----*/}
              <ResumePreview data={resumeData} template={resumeData.template}
                accentColor={resumeData.accent_color}
              />
            </div>
          </div>

        </div>
      </div>


    </div>
  )
}
