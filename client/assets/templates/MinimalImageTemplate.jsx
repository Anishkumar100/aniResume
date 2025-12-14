import { Mail,Globe,GitBranchIcon, Phone, MapPin } from "lucide-react";

const MinimalImageTemplate = ({ data, accentColor }) => {
   const formatDate = (dateStr) => {
        if (!dateStr) return "";
        
        const date = new Date(dateStr);
        
        // Check if the date is valid
        if (isNaN(date.getTime())) {
            return dateStr; // Return original text if it's not a valid date
        }

        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short"
        });
    };

    return (
      <div className="max-w-5xl mx-auto bg-white shadow-xl min-h-[1100px] text-zinc-800 font-sans overflow-hidden">
            <div className="grid grid-cols-12 min-h-full">

                {/* ================= LEFT SIDEBAR (4 cols) ================= */}
                <aside className="col-span-12 md:col-span-4 bg-slate-50 border-r border-zinc-200 p-8 flex flex-col gap-8">
                    
                    {/* Profile Image - Centered and Clean */}
                    <div className="flex justify-center">
                        {data.personal_info?.image ? (
                            <div className="relative">
                                <div 
                                    className="absolute inset-0 rounded-full opacity-20 transform translate-x-1 translate-y-1" 
                                    style={{ backgroundColor: accentColor }}
                                ></div>
                                <img 
                                    src={typeof data.personal_info.image === 'string' ? data.personal_info.image : URL.createObjectURL(data.personal_info.image)} 
                                    alt="Profile" 
                                    className="relative w-40 h-40 object-cover rounded-full border-4 border-white shadow-md z-10" 
                                />
                            </div>
                        ) : (
                            <div className="w-32 h-32 bg-zinc-200 rounded-full flex items-center justify-center text-zinc-400 font-bold border-4 border-white shadow-sm">
                                NO IMG
                            </div>
                        )}
                    </div>

                    {/* Contact Section - FIXED FOR LONG EMAILS */}
                    <section>
                        <h3 className="text-xs font-bold tracking-[0.2em] text-zinc-400 mb-4 border-b border-zinc-200 pb-2 uppercase">
                            Contact
                        </h3>
                        <div className="space-y-4 text-sm">
                            {data.personal_info?.email && (
                                <div className="flex items-start gap-3 group">
                                    {/* shrink-0 prevents icon from squishing */}
                                    <div className="mt-0.5 p-1.5 bg-white rounded-md shadow-sm shrink-0 text-zinc-600">
                                        <Mail size={14} style={{ color: accentColor }} />
                                    </div>
                                    {/* break-all/break-words handles long emails */}
                                    <span className="text-zinc-600 font-medium break-all group-hover:text-zinc-900 transition-colors">
                                        {data.personal_info.email}
                                    </span>
                                </div>
                            )}

                            {data.personal_info?.phone && (
                                <div className="flex items-center gap-3 group">
                                    <div className="p-1.5 bg-white rounded-md shadow-sm shrink-0 text-zinc-600">
                                        <Phone size={14} style={{ color: accentColor }} />
                                    </div>
                                    <span className="text-zinc-600 font-medium group-hover:text-zinc-900 transition-colors">
                                        {data.personal_info.phone}
                                    </span>
                                </div>
                            )}

                            {data.personal_info?.location && (
                                <div className="flex items-start gap-3 group">
                                    <div className="mt-0.5 p-1.5 bg-white rounded-md shadow-sm shrink-0 text-zinc-600">
                                        <MapPin size={14} style={{ color: accentColor }} />
                                    </div>
                                    <span className="text-zinc-600 font-medium group-hover:text-zinc-900 transition-colors">
                                        {data.personal_info.location}
                                    </span>
                                </div>
                            )}
                            
                            {/* Optional: Add LinkedIn/Website here if exists in your data */}
                        </div>
                    </section>

                    {/* Education Section */}
                    {data.education && data.education.length > 0 && (
                        <section>
                            <h3 className="text-xs font-bold tracking-[0.2em] text-zinc-400 mb-4 border-b border-zinc-200 pb-2 uppercase">
                                Education
                            </h3>
                            <div className="space-y-5">
                                {data.education.map((edu, index) => (
                                    <div key={index} className="relative pl-3 border-l-2" style={{ borderColor: accentColor + '40' }}>
                                        <h4 className="font-bold text-zinc-800 text-sm leading-tight mb-1">
                                            {edu.degree}
                                        </h4>
                                        <p className="text-xs text-zinc-500 font-medium mb-1 uppercase tracking-wide">
                                            {edu.institution}
                                        </p>
                                        <p className="text-xs text-zinc-400">
                                            {formatDate(edu.graduation_date)}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Skills Section - Styled as Pills */}
                    {data.skills && data.skills.length > 0 && (
                        <section>
                            <h3 className="text-xs font-bold tracking-[0.2em] text-zinc-400 mb-4 border-b border-zinc-200 pb-2 uppercase">
                                Skills
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {data.skills.map((skill, index) => (
                                    <span 
                                        key={index} 
                                        className="px-3 py-1 bg-white border border-zinc-200 rounded-md text-xs font-medium text-zinc-600 shadow-sm"
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </section>
                    )}
                </aside>

                {/* ================= RIGHT CONTENT (8 cols) ================= */}
                <main className="col-span-12 md:col-span-8 p-10 pt-12">
                    
                    {/* Header */}
                    <header className="mb-10">
                        <h1 className="text-5xl font-extrabold text-zinc-800 tracking-tight leading-none mb-2">
                            {data.personal_info?.full_name?.split(" ")[0]} 
                            <span style={{ color: accentColor }}>
                                {data.personal_info?.full_name?.split(" ").slice(1).join(" ")}
                            </span>
                        </h1>
                        <p className="text-lg font-medium tracking-widest uppercase text-zinc-500">
                            {data?.personal_info?.profession}
                        </p>
                    </header>

                    {/* Summary */}
                    {data.professional_summary && (
                        <section className="mb-10">
                            <h2 className="flex items-center gap-3 text-sm font-bold tracking-[0.2em] text-zinc-400 mb-4 uppercase">
                                <span className="w-8 h-0.5" style={{ backgroundColor: accentColor }}></span>
                                Professional Profile
                            </h2>
                            <p className="text-zinc-600 leading-relaxed text-sm text-justify">
                                {data.professional_summary}
                            </p>
                        </section>
                    )}

                    {/* Experience */}
                    {data.experience && data.experience.length > 0 && (
                        <section className="mb-10">
                            <h2 className="flex items-center gap-3 text-sm font-bold tracking-[0.2em] text-zinc-400 mb-6 uppercase">
                                <span className="w-8 h-0.5" style={{ backgroundColor: accentColor }}></span>
                                Experience
                            </h2>
                            <div className="space-y-8">
                                {data.experience.map((exp, index) => (
                                    <div key={index} className="group">
                                        <div className="flex justify-between items-baseline mb-2">
                                            <h3 className="text-lg font-bold text-zinc-800 group-hover:text-zinc-600 transition-colors">
                                                {exp.position}
                                            </h3>
                                            <span className="text-xs font-semibold px-2 py-1 bg-zinc-100 rounded text-zinc-500 whitespace-nowrap">
                                                {formatDate(exp.start_date)} — {exp.is_current ? "Present" : formatDate(exp.end_date)}
                                            </span>
                                        </div>
                                        
                                        <div className="text-sm font-medium mb-3 flex items-center gap-2" style={{ color: accentColor }}>
                                            {exp.company}
                                        </div>

                                        {exp.description && (
                                            <ul className="text-sm text-zinc-600 leading-relaxed space-y-1.5 list-disc list-outside ml-4 marker:text-zinc-300">
                                                {exp.description.split("\n").map((line, i) => (
                                                    <li key={i} className="pl-1">{line}</li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Projects */}
                    {data.projects && data.projects.length > 0 && (
                        <section>
                            <h2 className="flex items-center gap-3 text-sm font-bold tracking-[0.2em] text-zinc-400 mb-6 uppercase">
                                <span className="w-8 h-0.5" style={{ backgroundColor: accentColor }}></span>
                                Key Projects
                            </h2>
                            <div className="grid grid-cols-1 gap-6">
                                {data.projects.map((project, index) => (
                                    <div key={index} className="bg-zinc-50 p-5 rounded-lg border border-zinc-100 hover:shadow-md transition-shadow">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <h3 className="font-bold text-zinc-800">{project.name}</h3>
                                                <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                                                    {project.type}
                                                </span>
                                            </div>
                                            
                                            <div className="flex gap-2">
                                                {project.deployedURL && (
                                                    <a href={project.deployedURL} target="_blank" rel="noopener noreferrer" 
                                                       className="p-1.5 bg-white border border-zinc-200 rounded text-zinc-500 hover:text-blue-600 hover:border-blue-200 transition-all" title="Live Site">
                                                        <ExternalLink size={14} />
                                                    </a>
                                                )}
                                                {project.repositoryURL && (
                                                    <a href={project.repositoryURL} target="_blank" rel="noopener noreferrer" 
                                                       className="p-1.5 bg-white border border-zinc-200 rounded text-zinc-500 hover:text-black hover:border-zinc-400 transition-all" title="Source Code">
                                                        <GitBranchIcon size={14} />
                                                    </a>
                                                )}
                                            </div>
                                        </div>

                                        {project.description && (
                                            <ul className="text-sm text-zinc-600 space-y-1 list-none mt-3">
                                                {project.description.split("\n").map((line, i) => (
                                                    <li key={i} className="flex gap-2">
                                                        <span className="mt-1.5 w-1 h-1 rounded-full shrink-0 bg-zinc-300"></span>
                                                        <span>{line}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </main>
            </div>
        </div>
    );
    
}


export default MinimalImageTemplate;