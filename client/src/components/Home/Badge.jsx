import React from 'react'
import {Zap} from "lucide-react"
export const Badge = () => {
    return (
        <div className='flex justify-center items-center gap-2'>
            <div className="flex justify-center items-center gap-2.5 text-sm text-red-600 bg-red-400/10   rounded-full px-6 py-1.5">
            <Zap width={14}/>
                <span>Simple Process</span>
            </div>
            
        </div>
    )
}
