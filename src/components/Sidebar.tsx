import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  LayoutDashboard, 
  Users, 
  Building2, 
  Clock, 
  CalendarCheck, 
  FileBarChart2, 
  ShieldCheck, 
  FileCode,
  GraduationCap
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  activeTab, 
  setActiveTab, 
  isOpen, 
  setIsOpen 
}) => {
  const { currentUser } = useApp();
  const role = currentUser.role;

  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      roles: ['super_admin', 'hr_admin', 'department_head', 'employee'],
      kicker: 'Module 8'
    },
    {
      id: 'employees',
      label: 'Employee Registry',
      icon: Users,
      roles: ['super_admin', 'hr_admin', 'department_head'],
      kicker: 'Modules 1, 2, 6'
    },
    {
      id: 'colleges',
      label: 'Colleges & Departments',
      icon: Building2,
      roles: ['super_admin', 'hr_admin', 'department_head', 'employee'],
      kicker: 'Module 3'
    },
    {
      id: 'attendance',
      label: 'Attendance Tracking',
      icon: Clock,
      roles: ['super_admin', 'hr_admin', 'department_head', 'employee'],
      kicker: 'Module 4'
    },
    {
      id: 'leaves',
      label: 'Leave Management',
      icon: CalendarCheck,
      roles: ['super_admin', 'hr_admin', 'department_head', 'employee'],
      kicker: 'Module 5'
    },
    {
      id: 'reports',
      label: 'Reports & Analytics',
      icon: FileBarChart2,
      roles: ['super_admin', 'hr_admin'],
      kicker: 'Module 8'
    },
    {
      id: 'users',
      label: 'User Accounts & RBAC',
      icon: ShieldCheck,
      roles: ['super_admin'],
      kicker: 'Module 7'
    },
    {
      id: 'php_source',
      label: 'PHP / XAMPP Source',
      icon: FileCode,
      roles: ['super_admin', 'hr_admin', 'department_head', 'employee'],
      kicker: 'Code & DB'
    }
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside className={`
        fixed lg:static top-0 bottom-0 left-0 z-50
        w-64 bg-[#0a2540] text-white flex flex-col justify-between
        transition-transform duration-300 ease-in-out no-print
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Brand Header */}
        <div>
          <div className="p-4 border-b border-white/10 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white p-0.5 shrink-0 overflow-hidden shadow-xs flex items-center justify-center">
              <img
                src="/src/assets/images/borana_university_crest_1794424747251.jpg"
                alt="Borana University Seal"
                className="w-full h-full object-cover rounded-full"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="overflow-hidden">
              <h2 className="text-sm font-extrabold tracking-tight text-white leading-tight truncate">
                BORANA UNIVERSITY
              </h2>
              <div className="text-[11px] text-[#c59b27] font-semibold flex items-center gap-1">
                <span>Employee Portal</span>
                <span className="text-white/40">&middot;</span>
                <span className="text-[10px] text-white/60">Nov 2026</span>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1">
            <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Management Modules
            </div>

            {navItems
              .filter(item => item.roles.includes(role))
              .map(item => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setIsOpen(false);
                    }}
                    className={`
                      w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold
                      transition-colors cursor-pointer text-left
                      ${isActive 
                        ? 'bg-white/15 text-white border-l-3 border-[#c59b27]' 
                        : 'text-slate-300 hover:bg-white/5 hover:text-white'
                      }
                    `}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#c59b27]' : 'text-slate-400'}`} />
                      <span className="truncate">{item.label}</span>
                    </div>
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-black/30 text-slate-400 shrink-0">
                      {item.kicker}
                    </span>
                  </button>
                );
              })}
          </nav>
        </div>

        {/* Project Group Credits Bottom Card */}
        <div className="p-3 border-t border-white/10 m-3 bg-white/5 rounded-xl">
          <div className="flex items-center gap-2 mb-1">
            <GraduationCap className="w-4 h-4 text-[#c59b27]" />
            <span className="text-xs font-bold text-white">Project Group 3</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-snug">
            Samuel Diro, Yohanis Hailu, Wayneshet Mekuria, Tsegaye Tadesse
          </p>
          <div className="mt-2 pt-2 border-t border-white/10 flex justify-between text-[10px] text-slate-500 font-mono">
            <span>Yabello, Ethiopia</span>
            <span>v1.0.0</span>
          </div>
        </div>
      </aside>
    </>
  );
};
