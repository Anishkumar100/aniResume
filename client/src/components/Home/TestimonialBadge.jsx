import React from 'react'
import {BookUserIcon} from "lucide-react"
export const TestimonialBadge = () => {
    return (
        <div className='flex justify-center items-center gap-2'>
            <div className="flex justify-center items-center gap-2.5 text-sm text-red-600 bg-red-400/10   rounded-full px-6 py-1.5">
            <BookUserIcon className='size-4.5 stroke-red-600'/>
                <span>Testimonials</span>
            </div>
            
        </div>
    )
}
