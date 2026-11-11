import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Users, 
  GraduationCap, 
  Briefcase, 
  Building, 
  CheckCircle2, 
  Clock, 
  CalendarClock, 
  Shield, 
  ArrowUpRight, 
  LogIn, 
  LogOut,
  FileText
} from 'lucide-react';

interface DashboardViewProps {
  onNavigate: (tab: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onNavigate }) => {
  const { 
    currentUser, 
    employees, 
    colleges, 
    departments, 
    attendance, 
    leaves, 
    activityLogs,
    punchAttendance 
  } = useApp();

  const today = new Date().toISOString().split('T')[0];

  // Aggregate Metrics
  const totalEmployees = employees.length;
  const academicStaff = employees.filter(e => e.staff_category === 'academic').length;
  const adminStaff = employees.filter(e => e.staff_category === 'administrative').length;
  const activeStaff = employees.filter(e => e.status === 'active').length;
  const onLeaveStaff = employees.filter(e => e.status === 'on_leave').length;

  // Attendance Metrics for Today
  const todayAttendance = attendance.filter(a => a.date === today);
  const presentCount = todayAttendance.filter(a => a.status === 'present').length;
  const lateCount = todayAttendance.filter(a => a.status === 'late').length;
  const halfDayCount = todayAttendance.filter(a => a.status === 'half_day').length;
  const absentCount = todayAttendance.filter(a => a.status === 'absent').length;

  // Leaves
  const pendingLeaves = leaves.filter(l => l.status === 'pending').length;
  const approvedLeaves = leaves.filter(l => l.status === 'approved').length;

  // Check if current user has punched in/out today
  const myTodayAtt = todayAttendance.find(a => a.employee_id === currentUser.employee_id);

  return (
    <div className="space-y-6">
      {/* University Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#07192c] via-[#0a2540] to-[#163e66] text-white p-6 shadow-md border border-slate-800">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 text-white/90 text-xs font-semibold mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              Borana University &middot; Institutional Portal Active
            </div>
            <h2 className="text-xl md:text-2xl font-extrabold tracking-tight">
              Welcome, {currentUser.full_name}
            </h2>
            <p className="text-xs md:text-sm text-slate-300 mt-1 leading-relaxed">
              Borana University Integrated Employee Management System &middot; Academic Year 2026/27. Central administrative dashboard managing human resources, attendance ledgers, and academic hierarchies.
            </p>
          </div>

          {/* Quick Self-Service Attendance Punch Card */}
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/15 shrink-0 flex flex-col gap-2 min-w-[220px]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-200">Terminal Punch</span>
              <span className="text-[11px] font-mono text-[#c59b27] font-semibold">{today}</span>
            </div>
            <div className="text-[11px] text-slate-300">
              {myTodayAtt?.check_in ? (
                <span>In: <strong>{myTodayAtt.check_in}</strong> {myTodayAtt.check_out && `· Out: ${myTodayAtt.check_out}`}</span>
              ) : (
                <span>No punch recorded today</span>
              )}
            </div>
            <div className="flex gap-2 mt-1">
              <button
                onClick={() => punchAttendance(currentUser.employee_id, 'in')}
                className="flex-1 inline-flex items-center justify-center gap-1 text-xs font-bold py-1.5 px-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5" /> Punch In
              </button>
              <button
                onClick={() => punchAttendance(currentUser.employee_id, 'out')}
                className="flex-1 inline-flex items-center justify-center gap-1 text-xs font-bold py-1.5 px-2.5 bg-amber-600 hover:bg-amber-500 text-white rounded-lg transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" /> Punch Out
              </button>
            </div>
          </div>
        </div>

        {/* Decorative Watermark Overlay */}
        <div className="absolute right-0 bottom-0 top-0 w-1/3 opacity-15 pointer-events-none hidden lg:block overflow-hidden">
          <img
            src="/src/assets/images/borana_university_campus_1794424748254.jpg"
            alt="Campus"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
      </div>

      {/* 8 Primary KPI Metric Cards (Module 8 Requirements) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Total Workforce */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Workforce</span>
            <Users className="w-4 h-4 text-[#0a2540]" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 font-mono tabular-nums">
            {totalEmployees}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            <span className="text-emerald-600 font-semibold">{activeStaff} Active</span> &middot; {onLeaveStaff} On Leave
          </div>
        </div>

        {/* Academic Faculty */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Academic Staff</span>
            <GraduationCap className="w-4 h-4 text-sky-600" />
          </div>
          <div className="text-2xl font-extrabold text-sky-700 font-mono tabular-nums">
            {academicStaff}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            Deans, Professors, Lecturers
          </div>
        </div>

        {/* Administrative Staff */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Admin Staff</span>
            <Briefcase className="w-4 h-4 text-slate-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-700 font-mono tabular-nums">
            {adminStaff}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            HR, Finance, Registrar, IT
          </div>
        </div>

        {/* Colleges & Departments */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Faculties / Units</span>
            <Building className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 font-mono tabular-nums">
            {colleges.length} <span className="text-xs font-normal text-slate-500">/ {departments.length} Depts</span>
          </div>
          <div className="text-xs text-slate-500 mt-1">
            Organizational hierarchy
          </div>
        </div>

        {/* Today's Present */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Present Today</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-600 font-mono tabular-nums">
            {presentCount}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            <span className="text-amber-600">{lateCount} Late</span> &middot; <span className="text-rose-600">{absentCount} Absent</span>
          </div>
        </div>

        {/* Pending Leaves */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Pending Leaves</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-extrabold text-amber-600 font-mono tabular-nums">
            {pendingLeaves}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            <button onClick={() => onNavigate('leaves')} className="text-blue-600 hover:underline cursor-pointer font-medium">
              Review requests &rarr;
            </button>
          </div>
        </div>

        {/* Approved Leaves */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Approved Leaves</span>
            <CalendarClock className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-extrabold text-indigo-600 font-mono tabular-nums">
            {approvedLeaves}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            Annual, sick & maternity
          </div>
        </div>

        {/* Active Session Role */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Session Privilege</span>
            <Shield className="w-4 h-4 text-[#0a2540]" />
          </div>
          <div className="text-sm font-bold text-slate-900 capitalize truncate">
            {currentUser.role.replace('_', ' ')}
          </div>
          <div className="text-xs text-slate-500 mt-1 font-mono">
            {currentUser.username} &middot; RBAC Active
          </div>
        </div>
      </div>

      {/* Two Column Layout: College Distribution & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Staff Registry Quick Table */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Recent Employee Registrations</h3>
              <p className="text-xs text-slate-500">Latest enrolled personnel across university colleges</p>
            </div>
            <button
              onClick={() => onNavigate('employees')}
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#0a2540] hover:text-[#163e66] cursor-pointer"
            >
              View Roster <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-4">Employee ID</th>
                  <th className="py-2.5 px-4">Full Name</th>
                  <th className="py-2.5 px-4">Category</th>
                  <th className="py-2.5 px-4">Position</th>
                  <th className="py-2.5 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {employees.slice(0, 6).map(emp => (
                  <tr key={emp.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-[#0a2540]">
                      {emp.employee_id}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-800">{emp.full_name}</div>
                      <div className="text-[11px] text-slate-400 font-mono">{emp.email}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium ${
                        emp.staff_category === 'academic' 
                          ? 'bg-sky-50 text-sky-700 border border-sky-200' 
                          : 'bg-slate-100 text-slate-700 border border-slate-200'
                      }`}>
                        {emp.staff_category === 'academic' ? 'Academic' : 'Administrative'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      <div>{emp.position}</div>
                      <div className="text-[11px] text-slate-400">{emp.qualification}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium ${
                        emp.status === 'active'
                          ? 'bg-emerald-50 text-emerald-700'
                          : emp.status === 'on_leave'
                          ? 'bg-amber-50 text-amber-700'
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        {emp.status === 'active' ? 'Active' : emp.status === 'on_leave' ? 'On Leave' : emp.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right 1 Col: Audit Trail Feed */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <h3 className="text-sm font-bold text-slate-900">Institutional Activity Audit</h3>
              <span className="text-[10px] font-mono bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">Real-time</span>
            </div>

            <div className="space-y-3">
              {activityLogs.slice(0, 5).map(log => (
                <div key={log.id} className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-xs">
                  <div className="flex items-center justify-between font-semibold text-slate-800 mb-0.5">
                    <span>{log.action}</span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {log.created_at.split(' ')[1]}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-snug">
                    {log.details}
                  </p>
                  <div className="mt-1 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                    <span>By: {log.user_name}</span>
                    <span>IP: {log.ip_address}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-center">
            <button
              onClick={() => onNavigate('reports')}
              className="text-xs font-semibold text-[#0a2540] hover:underline cursor-pointer inline-flex items-center gap-1"
            >
              <FileText className="w-3.5 h-3.5" /> View Full Audit & Reports
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
