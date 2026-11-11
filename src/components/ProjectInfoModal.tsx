import React from 'react';
import { 
  X, 
  GraduationCap, 
  CheckCircle2, 
  ShieldCheck, 
  Database, 
  Server, 
  Users, 
  FileText 
} from 'lucide-react';

interface ProjectInfoModalProps {
  onClose: () => void;
}

export const ProjectInfoModal: React.FC<ProjectInfoModalProps> = ({ onClose }) => {
  const groupMembers = [
    { no: 1, name: 'Samuel Diro', id: '446', role: 'Project Lead & System Architect', focus: 'Backend Architecture, RBAC & Core CRUD' },
    { no: 2, name: 'Yohanis Hailu', id: '231', role: 'Database Engineer & Full-Stack', focus: 'Normalized 3NF MySQL Database & SQL DDL' },
    { no: 3, name: 'Wayneshet Mekuria', id: '222', role: 'HR Domain Analyst & Security', focus: 'Civil Service Statutes, Leaves & Audit Logging' },
    { no: 4, name: 'Tsegaye Tadesse', id: '330', role: 'Frontend & UI/UX Developer', focus: 'Responsive Bootstrap 5 Dashboard & Reports' }
  ];

  const modules = [
    { id: 1, title: 'Employee Registration & Profile Management', desc: 'Auto-generated BU-EMP-xxx IDs, full profile fields, photo upload, and printable ID card' },
    { id: 2, title: 'Academic & Administrative Staff Management', desc: 'Category classification, academic ranks (Prof, Lecturer), and qualification management' },
    { id: 3, title: 'Department & College Management', desc: 'Organizational hierarchy, colleges with deans, departments with HOD assignments' },
    { id: 4, title: 'Employee Attendance Management', desc: 'Biometric punch tracking, present/late/half-day/absent, daily sheets, and date filters' },
    { id: 5, title: 'Leave Request & Approval Management', desc: 'Annual, sick, maternity, emergency, study leaves with administrative review and remarks' },
    { id: 6, title: 'Employee Record Search & Retrieval', desc: 'Multi-parameter search by ID, name, email, filtering by college, department, and status' },
    { id: 7, title: 'User Authentication & Role-Based Access Control', desc: '4 Role tiers (Super Admin, HR Admin, Dept Head, Employee), BCRYPT hashes, and CSRF' },
    { id: 8, title: 'Administrative Dashboard & Report Generation', desc: '8 KPI cards, workforce statistics, official letterhead print mode, and CSV export' }
  ];

  return (
    <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200">
        {/* Header with Crest */}
        <div className="bg-[#0a2540] text-white p-5 px-6 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white p-0.5 shrink-0 shadow-xs">
              <img 
                src="/src/assets/images/borana_university_crest_1794424747251.jpg" 
                alt="Crest" 
                className="w-full h-full object-cover rounded-full"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <h3 className="font-extrabold text-sm md:text-base tracking-tight">
                Web-Based Employee Management System
              </h3>
              <p className="text-[11px] text-[#c59b27] font-semibold">
                Borana University &middot; Project Group 3 &middot; November 2026
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-300 hover:text-white rounded-lg cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 text-xs">
          {/* Group 3 Members Card */}
          <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-4">
            <h4 className="font-bold text-amber-900 text-sm flex items-center gap-1.5 mb-3">
              <GraduationCap className="w-4 h-4 text-amber-800" />
              Project Group 3 Membership Roster
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {groupMembers.map(m => (
                <div key={m.no} className="bg-white p-3 rounded-lg border border-amber-100 shadow-2xs">
                  <div className="flex items-center justify-between font-bold text-slate-900">
                    <span>{m.no}. {m.name}</span>
                    <span className="font-mono text-[11px] bg-amber-100 text-amber-900 px-2 py-0.5 rounded">
                      ID: {m.id}
                    </span>
                  </div>
                  <div className="text-[11px] font-semibold text-[#0a2540] mt-1">{m.role}</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">{m.focus}</div>
                </div>
              ))}
            </div>
          </div>

          {/* All 8 Modules Verification */}
          <div>
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5 mb-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Required System Modules (100% Implemented)
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              {modules.map(mod => (
                <div key={mod.id} className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <div className="font-bold text-slate-900 flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-[#0a2540] text-white flex items-center justify-center text-[10px] shrink-0 font-mono">
                      {mod.id}
                    </span>
                    <span>{mod.title}</span>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-1 leading-snug">
                    {mod.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Architecture & Security Highlights */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5 mb-2">
              <ShieldCheck className="w-4 h-4 text-[#0a2540]" />
              Security & Institutional Standards
            </h4>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-700">
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Password hashing using PHP <code>password_hash(PASSWORD_BCRYPT)</code></span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>SQL Injection defense via PDO Prepared Statements</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Cross-Site Request Forgery (CSRF) token validation</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Role-Based Access Control (RBAC) across 4 permission tiers</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Session Fixation prevention via <code>session_regenerate_id()</code></span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>XSS prevention via strict HTML entity output escaping</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="p-4 bg-slate-100 border-t border-slate-200 flex justify-between items-center text-xs">
          <span className="text-slate-500 font-mono">
            Institution: Borana University &middot; Yabello, Ethiopia
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 font-bold text-white bg-[#0a2540] hover:bg-[#163e66] rounded-lg cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
