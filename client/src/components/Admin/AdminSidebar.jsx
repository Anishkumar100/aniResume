import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, Users, FileText } from 'lucide-react'

export const AdminSidebar = () => {
  const location = useLocation();

  const sidebarLinks = [
    { name: 'Overview', path: '/admin', icon: LayoutDashboard },
    { name: 'Users', path: '/admin/users', icon: Users },
    { name: 'Resumes', path: '/admin/resumes', icon: FileText },
  ];

  return (
    <aside 
      className={`
          sticky top-[65px] h-[calc(100vh-65px)]
          w-20 md:w-64 pt-10 
          bg-white border-r border-gray-200 
          flex flex-col py-6 z-40 
          transition-all duration-300 ease-in-out
          shrink-0
      `}
    >
      <nav className="flex-1 space-y-2 px-2 md:px-4">
        {sidebarLinks.map((item) => {
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.name}
              to={item.path}
              title={item.name} // Tooltip shows on hover (desktop) or long-press (mobile)
              className={`
                group flex items-center justify-center md:justify-start 
                px-0 md:px-3 py-3 md:py-2.5 
                text-sm font-medium rounded-xl transition-all duration-200 
                ${isActive
                  ? 'bg-purple-50 text-purple-700 shadow-sm'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }
              `}
            >
              {/* Icon: Centered on mobile (w-20), Left aligned on desktop (w-64) */}
              <item.icon
                className={`
                   h-6 w-6 md:h-5 md:w-5 flex-shrink-0 transition-colors
                   ${isActive ? 'text-purple-600' : 'text-slate-400 group-hover:text-slate-500'}
                   md:mr-3
                `}
              />
              
              {/* Text: Hidden on mobile, Visible on desktop */}
              <span className="hidden md:block whitespace-nowrap">
                  {item.name}
              </span>
            </Link>
          );
        })}
      </nav>

    </aside>
  );
};

export default AdminSidebar;