import { Check, Layout, Search, X } from 'lucide-react'
import React, { useState } from 'react'

export const TemplateSelector = ({ selectedTemplate, onChange }) => {

    const [isOpen, setIsOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")

    const templates = [
        { id: "classic", name: "Classic", preview: "A clean, traditional resume format with clear sections and professional typography." },
        { id: "modern", name: "Modern", preview: "Sleek design with strategic use of color and modern font choices." },
        { id: "minimal-image", name: "Minimal Image", preview: "Minimal design with a single image and clean typography" },
        { id: "minimal", name: "Minimal", preview: "Ultra-clean design that puts your content front and center" },
    ]

    // Filter Logic: Searches both the Name and the Preview description
    const filteredTemplates = templates.filter(template => 
        template.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        template.preview.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <div className='relative'>
            <button 
                onClick={() => {
                    setIsOpen(!isOpen);
                    setSearchQuery(""); // Reset search when toggling
                }} 
                className='flex items-center gap-1 text-sm text-red-700 bg-gradient-to-br from-red-50 to-red-100 ring-red-300 hover:ring transition-all px-3 py-2 rounded-lg'
            >
                <Layout size={14} /> 
                <span className='max-sm:hidden capitalize'>{selectedTemplate} Template</span>
            </button>


            {/* Dropdown Container */}
            {isOpen && (
                <div className='absolute top-full left-0 w-80 p-3 mt-2 z-20 bg-white rounded-md border border-gray-200 shadow-xl'>
                    
                    {/* Search Bar */}
                    <div className='mb-3 relative'>
                        <div className='flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-md bg-gray-50 focus-within:ring-1 focus-within:ring-red-300 transition-all'>
                            <Search size={14} className='text-gray-400' />
                            <input 
                                type="text" 
                                placeholder='Search styles...' 
                                className='bg-transparent border-none outline-none w-full text-sm rounded-md text-gray-700 p-1 placeholder:text-gray-400'
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                autoFocus
                            />
                            {searchQuery && (
                                <button onClick={() => setSearchQuery("")} className='text-gray-400 hover:text-gray-600'>
                                    <X size={14} />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Scrollable List area */}
                    <div className='space-y-3 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar'>
                        {filteredTemplates.length > 0 ? (
                            filteredTemplates.map((template) => {
                                return (
                                    <div 
                                        key={template.id} 
                                        onClick={() => { onChange(template.id); setIsOpen(false) }}
                                        className={`relative p-3 border rounded-md cursor-pointer transition-all group
                                            ${selectedTemplate === template.id 
                                                ? "border-red-400 bg-red-50" 
                                                : "border-gray-200 hover:border-red-300 hover:bg-red-50/50"
                                            } `} 
                                    >

                                        {/* Selection Checkmark */}
                                        {selectedTemplate === template.id && (
                                            <div className='absolute top-2 right-2 bg-red-100 rounded-full p-0.5'>
                                                <Check className='w-3 h-3 text-red-600' />
                                            </div>
                                        )}

                                        <div className='space-y-1'>
                                            <h4 className={`font-medium text-sm ${selectedTemplate === template.id ? 'text-red-700' : 'text-gray-800'}`}>
                                                {template.name}
                                            </h4>
                                            <div className='text-xs text-gray-500 leading-relaxed'>
                                                {template.preview}
                                            </div>
                                        </div>

                                    </div>
                                )
                            })
                        ) : (
                            // Empty State
                            <div className='text-center py-6 text-gray-400'>
                                <p className='text-xs'>No templates found.</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}