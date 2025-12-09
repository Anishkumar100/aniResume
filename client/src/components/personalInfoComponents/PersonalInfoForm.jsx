import { BriefcaseBusiness, Globe, LinkedinIcon, Mail, MapPin, Phone, User } from 'lucide-react'
import React from 'react'

export const PersonalInfoForm = ({ data, onChange, removeBackground, setRemoveBackground }) => {
  const handleChange = (field, value) => {

    onChange({ ...data, [field]: value })
  }

const fields =[
  { key:"full_name", label:"Full Name", icon: User, type:"text",required:true, ex:"Anish Kumar S"  },
  { key:"email", label:"Email Address", icon: Mail, type:"email",required:true, ex:"akcoder1102004@gmail.com"  },
  { key:"phone", label:"Phone Number", icon: Phone, type:"tel",required:false,ex:"+91 9038497392"  },
  { key:"location", label:"Location", icon: MapPin, type:"text",required:false, ex:"Bangalore, India"  },
  {key:"profession",label:"Profession",icon:BriefcaseBusiness,type:"text",required:false,ex:"Full Stack Developer"  },
  {key:"linkedin",label:"LinkedIn Profile",icon:LinkedinIcon,type:"url",required:false, ex:"https://www.linkedin.com/in/anishkumar-dev/"  },
  {key:"website",label:"Personal Website (If Any)",icon:Globe,type:"url",required:false, ex:"https://anishkumar-v2.vercel.app/"  },
]


  return (
    <div>
      <h3 className=' text-lg font-semibold text-gray-900'>Personal Info</h3>
      <p className=' text-sm text-gray-600'>Get Started With Your Personal Info (But Don't Get Too Personal 😉)</p>

      <div className=' flex items-center gap-2'>
        <label >
          {/*Here, when a user is uploading his resume, we have to make sure, the image is in string format (for protection, since we have kept the schema for image as string). That's why we are changing it */}

          {/* And when we upload a profile pic, it will initially be in a file format, but we are converting it into a ObjectUrl */}
          {data.image ? (
            <img src={typeof data.image === "string" ? data.image : URL.createObjectURL(data.image)} alt="Profile Pic" className=' w-16 h-16 rounded-full object-cover mt-5 ring ring-slate-300 hover:opacity-80' />
          ) : (

            <div className=' inline-flex items-center gap-2 mt-5 text-slate-600 hover:text-slate-700 cursor-pointer'>
              {/*If image is not provided then add a default user logo */}

              <User className=' size-10 p-2.5 border rounded-full' />
              Upload User Image (jpeg,png) accepted

            </div>
          )}

          <input type="file" className=' hidden'
            accept='image/jpeg,image/png'
            onChange={(e) => handleChange("image", e.target.files[0])} />
        </label>




        {typeof data.image === "object" && (

          <div className=' flex flex-col gap-1 pl-4 text-sm'>
            <p>Remove Background</p>
            <label className=' relative inline-flex items-center cursor-pointer text-gray-900 gap-3'>
              <input type="checkbox" className=' sr-only peer' checked={removeBackground} onChange={() => setRemoveBackground(prev => !prev)} /> {/*We have set that if the box is checked then we have to take removeBackground. And if we are checking again give opposite of the removeBackground. (true or false) */}


              <div className=' w-9 h-5 bg-slate-300 rounded-full peer peer-checked:bg-red-600 transition-colors duration-200'>
              </div>

              <span className=' dot absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition-transform duration-200 ease-in-out peer-checked:translate-x-4'>

              </span>
            </label>
          </div>
        )}
      </div>



      {/*Other Input Fields of section 1 */}

      {fields.map(({key,label,icon,type,required,ex})=>
      {
        const IconComponent = icon;
        return(
          <div key={key} className=' flex flex-col gap-1 mt-4'>
            <label className=' text-sm font-medium text-gray-700'>{label} {required && <span className=' text-red-500'>*</span>}</label>
            <div className=' relative'>
              <div className=' absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                <IconComponent className=' size-4 text-gray-400' />
              </div>
              {/* here, we are using the data[key], since, we are checking if we have input from uploaded or previously created resume */}
              <input type={type} value={data[key] || ""} placeholder={ex} required={required} onChange={(e) => handleChange(key, e.target.value)} className=' w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent' />
            </div>
          </div>
        )
      })}

      

    </div>
  )
}
