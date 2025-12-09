import mongoose from 'mongoose';

const ResumeSchema = new mongoose.Schema({

    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    title:
    {
        type: String,
        default:"Untitled Resume"
        //used when user doesnt name the resume
    },
    public:
    {
        type: Boolean,
        default: false
        // kept as false by default, so user's resume is private unless they choose to make it public
    },
    template:
    {
        type:String,
        default:"classic"
        // we are gonna keep a lot of templates for the resumes, classic is the default one
    },
    accent_color:
    {
        type:String,
        default:"#3B82F6"
        // default bg color for the resume
    },
    professional_summary:
    {
        type:String,
        default:""
        // we will use ai here to generate content. And giving the users a choice to edit it. or type from scratch
    },
    skills:
    [{
        type:String
    }],
    personal_info:
    {
        image:{
            type:String,
            default:""
        },
        full_name:
        {
            type:String,
            default:""
        },
        profession:
        {
            type:String,
            default:""
        },
        email:
        {
            type:String,
            default:""
        },
        phone:
        {
            type:String,
            default:""
        },
        location:
        {
            type:String,
            default:""
        },
        linkedin:
        {
            type:String,
            default:""
        },
        website:
        {
            type:String,
            default:""
        }
    },
    experience:[
    {
        company:{
            type:String,
        },
        position:
        {
            type:String,
        },
        start_date:
        {
            type:String,
        },
        end_date:
        {
            type:String,
        },
        description:
        {
            type:String,
        },
        is_current:{
            type:Boolean
        },
    }],

    projects:[
        {
            name:{
                type:String,
            },
            type:
            {
                type:String,
            },
            description:
            {
                type:String,
            },
            deployedURL:
            {
                type:String,
                required:false
            },
            repositoryURL:
            {
                type:String,
                required:false
            }
        
            }
    ],

    education:[
    {
        institution:{
            type:String,
        },
        degree:
        {
            type:String,
        },
        field:
        {
            type:String,
        },
        graduation_date:
        {
            type:String,
        },
        gpa:
        {
            type:String,
        }
    }
    ]


},{timestamps:true}); 


const Resume = mongoose.model('Resume',ResumeSchema);

export default Resume;