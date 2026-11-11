import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';
import { 
  ShieldCheck, 
  UserCheck, 
  ChevronDown, 
  Info, 
  RotateCcw,
  Sparkles,
  Code
} from 'lucide-react';

interface HeaderProps {
  onOpenProjectInfo: () => void;
  onOpenCodeExplorer: () => void;
  activeTab: string;
}

export const Header: React.FC<HeaderProps> = ({ 
  onOpenProjectInfo, 
  onOpenCodeExplorer,
  activeTab
}) => {
  const { currentUser, switchUser, resetToDefaults } = useApp();
  const [showRoleMenu, setShowRoleMenu] = useState(false);

  const rolesList: { role: UserRole; title: string; desc: string }[] = [
    { role: 'super_admin', title: 'Super Administrator', desc: 'Full system control, users & config' },
    { role: 'hr_admin', title: 'HR Administrator', desc: 'Employee records, attendance & leaves' },
    { role: 'department_head', title: 'Department Head', desc: 'Department roster & leave review' },
    { role: 'employee', title: 'Academic / Staff Employee', desc: 'Self-service profile, punch & leaves' }
  ];

  return (
    <header className="bg-white border-b border-slate-200 h-16 px-4 md:px-6 flex items-center justify-between no-print sticky top-0 z-30 shadow-xs">
      {/* Left: Breadcrumbs */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider hidden sm:inline">
          Borana University
        </span>
        <span className="text-slate-300 hidden sm:inline">/</span>
        <h1 className="text-sm md:text-base font-bold text-slate-900 capitalize">
          {activeTab.replace('_', ' ')}
        </h1>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* Project Group Info Badge */}
        <button
          onClick={onOpenProjectInfo}
          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-[#0a2540] bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg transition-colors cursor-pointer"
          title="Group 3 Project Details & System Architecture"
        >
          <Info className="w-3.5 h-3.5 text-amber-700" />
          <span className="hidden sm:inline">Group 3 Details</span>
        </button>

        {/* PHP & XAMPP Source Explorer Button */}
        <button
          onClick={onOpenCodeExplorer}
          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg transition-colors cursor-pointer"
          title="Inspect PHP Backend Code & MySQL DDL"
        >
          <Code className="w-3.5 h-3.5 text-slate-600" />
          <span className="hidden md:inline font-mono">PHP/XAMPP Code</span>
        </button>

        {/* Database Reset Button */}
        <button
          onClick={() => {
            if (window.confirm('Reset local database state to initial Borana University defaults?')) {
              resetToDefaults();
            }
          }}
          className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          title="Reset sample data"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        {/* Role Switcher Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowRoleMenu(!showRoleMenu)}
            className="flex items-center gap-2 px-2.5 py-1.5 text-xs font-medium bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="hidden md:inline text-slate-500">Role:</span>
            <span className="font-semibold text-slate-800 capitalize truncate max-w-[130px]">
              {currentUser.role.replace('_', ' ')}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {showRoleMenu && (
            <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-1">
              <div className="px-3 py-1.5 border-b border-slate-100 mb-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Switch Active Role (RBAC Testing)
                </span>
              </div>
              {rolesList.map(item => (
                <button
                  key={item.role}
                  onClick={() => {
                    switchUser(item.role);
                    setShowRoleMenu(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs flex items-start gap-2.5 hover:bg-slate-50 transition-colors ${
                    currentUser.role === item.role ? 'bg-blue-50/70 text-[#0a2540]' : 'text-slate-700'
                  }`}
                >
                  <ShieldCheck className={`w-4 h-4 mt-0.5 shrink-0 ${
                    currentUser.role === item.role ? 'text-[#0a2540]' : 'text-slate-400'
                  }`} />
                  <div>
                    <div className="font-semibold flex items-center gap-1.5">
                      {item.title}
                      {currentUser.role === item.role && (
                        <span className="text-[10px] bg-blue-100 text-[#0a2540] px-1.5 py-0.2 rounded font-mono">Active</span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-500">{item.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* User Profile Pill */}
        <div className="flex items-center gap-2 pl-1 border-l border-slate-200">
          <img
            src={currentUser.avatar_url || '/src/assets/images/avatar_dean_academic_1794424750138.jpg'}
            alt={currentUser.full_name}
            className="w-8 h-8 rounded-full object-cover border border-slate-200 shadow-xs"
            referrerPolicy="no-referrer"
          />
          <div className="hidden lg:block text-left">
            <div className="text-xs font-bold text-slate-800 leading-tight truncate max-w-[140px]">
              {currentUser.full_name}
            </div>
            <div className="text-[11px] text-slate-500 font-mono truncate max-w-[140px]">
              {currentUser.employee_id}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
