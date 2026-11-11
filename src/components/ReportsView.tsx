import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { 
  FileBarChart, 
  Printer, 
  Download, 
  FileSpreadsheet, 
  Users, 
  Clock, 
  CalendarCheck,
  Building2,
  Filter
} from 'lucide-react';

export const ReportsView: React.FC = () => {
  const { employees, attendance, leaves, colleges, departments } = useApp();

  const [reportType, setReportType] = useState<'employees' | 'attendance' | 'leaves'>('employees');
  const [selectedCollegeId, setSelectedCollegeId] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  // Filtered dataset
  const filteredEmployees = useMemo(() => {
    return employees.filter(emp => {
      const matchCol = selectedCollegeId === 'all' || String(emp.college_id) === selectedCollegeId;
      const matchStat = selectedStatus === 'all' || emp.status === selectedStatus;
      return matchCol && matchStat;
    });
  }, [employees, selectedCollegeId, selectedStatus]);

  // CSV Exporter
  const handleExportCSV = () => {
    let headers: string[] = [];
    let rows: (string | number)[][] = [];
    let filename = `borana_${reportType}_${new Date().toISOString().split('T')[0]}.csv`;

    if (reportType === 'employees') {
      headers = ['Employee ID', 'Full Name', 'Gender', 'Email', 'Phone', 'Staff Category', 'College', 'Department', 'Position', 'Salary (ETB)', 'Status'];
      rows = filteredEmployees.map(e => [
        e.employee_id,
        `"${e.full_name}"`,
        e.gender,
        e.email,
        e.phone,
        e.staff_category,
        `"${e.college_name || ''}"`,
        `"${e.department_name || ''}"`,
        `"${e.position}"`,
        e.salary,
        e.status
      ]);
    } else if (reportType === 'attendance') {
      headers = ['Date', 'Employee ID', 'Staff Name', 'Department', 'Check-In', 'Check-Out', 'Status', 'Remarks'];
      rows = attendance.map(a => [
        a.date,
        a.employee_id,
        `"${a.employee_name}"`,
        `"${a.department_name}"`,
        a.check_in || '',
        a.check_out || '',
        a.status,
        `"${a.remarks}"`
      ]);
    } else {
      headers = ['Ref #', 'Employee ID', 'Staff Name', 'Department', 'Leave Type', 'Start Date', 'End Date', 'Days', 'Status', 'Reviewer'];
      rows = leaves.map(l => [
        `LR-${l.id}`,
        l.employee_id,
        `"${l.employee_name}"`,
        `"${l.department_name}"`,
        l.leave_type,
        l.start_date,
        l.end_date,
        l.days_requested,
        l.status,
        `"${l.reviewed_by || 'Awaiting'}"`
      ]);
    }

    const csvContent = 'data:text/csv;charset=utf-8,' + 
      [headers.join(','), ...rows.map(r => r.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Printable Institutional Letterhead (Shows when printing) */}
      <div className="hidden print:block text-center border-b-2 border-[#0a2540] pb-4 mb-6">
        <div className="flex items-center justify-center gap-3 mb-2">
          <img 
            src="/src/assets/images/borana_university_crest_1794424747251.jpg" 
            alt="Borana University Seal" 
            className="w-16 h-16 rounded-full"
            referrerPolicy="no-referrer"
          />
          <div>
            <h1 className="text-xl font-extrabold text-[#0a2540] tracking-tight">BORANA UNIVERSITY</h1>
            <h2 className="text-sm font-semibold text-slate-700">OFFICE OF HUMAN RESOURCES & INSTITUTIONAL PLANNING</h2>
            <p className="text-xs text-slate-500 font-mono">P.O. Box 77, Yabello, Oromia, Ethiopia &middot; www.borana.edu.et</p>
          </div>
        </div>
        <div className="text-xs font-mono font-bold uppercase tracking-wider text-slate-800 pt-2 border-t border-slate-200">
          Official Administrative Report &middot; Generated {new Date().toLocaleString()} &middot; Academic Year 2026/27
        </div>
      </div>

      {/* Screen Header & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
        <div>
          <h2 className="text-lg md:text-xl font-bold text-slate-900">
            Administrative Reports & Official Exports
          </h2>
          <p className="text-xs text-slate-500">
            Module 8: Census ledgers, attendance audit books, and printable statutory documentation
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg cursor-pointer transition-colors shadow-xs"
          >
            <Download className="w-4 h-4 text-emerald-700" /> Export CSV / Excel
          </button>
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-[#0a2540] hover:bg-[#163e66] rounded-lg cursor-pointer transition-colors shadow-xs"
          >
            <Printer className="w-4 h-4" /> Print Official Report (PDF)
          </button>
        </div>
      </div>

      {/* Report Configuration Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3 no-print">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-700 mr-2">Report Document:</span>
          <button
            onClick={() => setReportType('employees')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
              reportType === 'employees' ? 'bg-[#0a2540] text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Users className="w-3.5 h-3.5" /> Comprehensive Employee Master Roll
          </button>
          <button
            onClick={() => setReportType('attendance')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
              reportType === 'attendance' ? 'bg-[#0a2540] text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Clock className="w-3.5 h-3.5" /> Biometric Attendance Audit
          </button>
          <button
            onClick={() => setReportType('leaves')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
              reportType === 'leaves' ? 'bg-[#0a2540] text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <CalendarCheck className="w-3.5 h-3.5" /> Statutory Leave Application Ledger
          </button>
        </div>

        {reportType === 'employees' && (
          <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-slate-100 text-xs">
            <div className="flex items-center gap-1 text-slate-500 font-semibold">
              <Filter className="w-3.5 h-3.5" /> Filter Criteria:
            </div>
            <select
              value={selectedCollegeId}
              onChange={e => setSelectedCollegeId(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-xs text-slate-700"
            >
              <option value="all">All Colleges</option>
              {colleges.map(c => (
                <option key={c.id} value={c.id}>{c.code} - {c.name}</option>
              ))}
            </select>
            <select
              value={selectedStatus}
              onChange={e => setSelectedStatus(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-xs text-slate-700"
            >
              <option value="all">All Employment Statuses</option>
              <option value="active">Active</option>
              <option value="on_leave">On Leave</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
        )}
      </div>

      {/* Render Table Data */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              {reportType === 'employees' && 'Borana University Comprehensive Employee Master Roll'}
              {reportType === 'attendance' && 'Biometric Staff Attendance Audit Ledger'}
              {reportType === 'leaves' && 'University Statutory Leave Application Ledger'}
            </h3>
            <span className="text-xs text-slate-500">
              Generated for official institutional evaluation &middot; Group 3
            </span>
          </div>
          <span className="text-xs font-mono font-bold text-slate-600">
            Total Records: {reportType === 'employees' ? filteredEmployees.length : reportType === 'attendance' ? attendance.length : leaves.length}
          </span>
        </div>

        <div className="overflow-x-auto">
          {reportType === 'employees' && (
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100/70 text-slate-600 uppercase tracking-wider font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">#</th>
                  <th className="py-2.5 px-3">Employee ID</th>
                  <th className="py-2.5 px-3">Full Legal Name</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3">College & Department</th>
                  <th className="py-2.5 px-3">Qualification</th>
                  <th className="py-2.5 px-3">Hire Date</th>
                  <th className="py-2.5 px-3 text-right">Salary (ETB)</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredEmployees.map((emp, idx) => (
                  <tr key={emp.id} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 text-slate-400 font-mono">{idx + 1}</td>
                    <td className="py-2.5 px-3 font-mono font-bold text-[#0a2540]">{emp.employee_id}</td>
                    <td className="py-2.5 px-3 font-bold text-slate-800">{emp.full_name}</td>
                    <td className="py-2.5 px-3 capitalize">{emp.staff_category}</td>
                    <td className="py-2.5 px-3 text-slate-600">{emp.college_name} - {emp.department_name}</td>
                    <td className="py-2.5 px-3">{emp.qualification}</td>
                    <td className="py-2.5 px-3 font-mono text-slate-500">{emp.hire_date}</td>
                    <td className="py-2.5 px-3 font-mono text-right font-semibold text-emerald-700">
                      {emp.salary.toLocaleString()}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="capitalize font-semibold text-slate-700">{emp.status.replace('_', ' ')}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {reportType === 'attendance' && (
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100/70 text-slate-600 uppercase tracking-wider font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Employee ID</th>
                  <th className="py-2.5 px-3">Staff Name</th>
                  <th className="py-2.5 px-3">Department</th>
                  <th className="py-2.5 px-3">Check-In</th>
                  <th className="py-2.5 px-3">Check-Out</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Terminal Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {attendance.map(a => (
                  <tr key={a.id} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 font-mono">{a.date}</td>
                    <td className="py-2.5 px-3 font-mono font-bold text-[#0a2540]">{a.employee_id}</td>
                    <td className="py-2.5 px-3 font-semibold text-slate-800">{a.employee_name}</td>
                    <td className="py-2.5 px-3 text-slate-600">{a.department_name}</td>
                    <td className="py-2.5 px-3 font-mono">{a.check_in || '--:--:--'}</td>
                    <td className="py-2.5 px-3 font-mono">{a.check_out || '--:--:--'}</td>
                    <td className="py-2.5 px-3 capitalize font-bold">{a.status}</td>
                    <td className="py-2.5 px-3 text-slate-500 font-mono text-[11px]">{a.remarks}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {reportType === 'leaves' && (
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100/70 text-slate-600 uppercase tracking-wider font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Ref #</th>
                  <th className="py-2.5 px-3">Employee</th>
                  <th className="py-2.5 px-3">Leave Type</th>
                  <th className="py-2.5 px-3">Start Date</th>
                  <th className="py-2.5 px-3">End Date</th>
                  <th className="py-2.5 px-3">Days</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Review Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {leaves.map(l => (
                  <tr key={l.id} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 font-mono text-slate-400">#LR-{String(l.id).slice(-4)}</td>
                    <td className="py-2.5 px-3">
                      <span className="font-bold text-slate-800">{l.employee_name}</span> ({l.employee_id})
                    </td>
                    <td className="py-2.5 px-3 capitalize font-semibold">{l.leave_type} Leave</td>
                    <td className="py-2.5 px-3 font-mono">{l.start_date}</td>
                    <td className="py-2.5 px-3 font-mono">{l.end_date}</td>
                    <td className="py-2.5 px-3 font-mono font-bold">{l.days_requested}</td>
                    <td className="py-2.5 px-3 capitalize font-bold">{l.status}</td>
                    <td className="py-2.5 px-3 text-slate-500 italic text-[11px]">{l.review_remarks || 'Pending'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Official Institutional Certification Footer (Printed only) */}
      <div className="hidden print:block pt-12 text-xs">
        <div className="grid grid-cols-3 gap-8 text-center pt-8 border-t border-slate-300">
          <div>
            <div className="border-b border-slate-400 pb-8 mb-2"></div>
            <div className="font-bold text-slate-900">Wayneshet Mekuria</div>
            <div className="text-slate-500">Director of Human Resources</div>
          </div>
          <div>
            <div className="border-b border-slate-400 pb-8 mb-2"></div>
            <div className="font-bold text-slate-900">Dr. Tadesse Gemeda</div>
            <div className="text-slate-500">Academic Vice President</div>
          </div>
          <div>
            <div className="border-b border-slate-400 pb-8 mb-2"></div>
            <div className="font-bold text-slate-900">Samuel Diro</div>
            <div className="text-slate-500">System Administrator (Group 3)</div>
          </div>
        </div>
      </div>
    </div>
  );
};
