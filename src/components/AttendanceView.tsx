import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { AttendanceStatus } from '../types';
import { 
  Clock, 
  Calendar, 
  Search, 
  Plus, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  MinusCircle, 
  Printer, 
  X,
  LogIn,
  LogOut
} from 'lucide-react';

export const AttendanceView: React.FC = () => {
  const { attendance, employees, recordAttendance, punchAttendance, currentUser } = useApp();

  const todayStr = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(todayStr);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | AttendanceStatus>('all');

  // Modal State
  const [showEntryModal, setShowEntryModal] = useState(false);
  const [formEmployeeId, setFormEmployeeId] = useState(employees[0]?.employee_id || '');
  const [formCheckIn, setFormCheckIn] = useState('08:00:00');
  const [formCheckOut, setFormCheckOut] = useState('17:00:00');
  const [formStatus, setFormStatus] = useState<AttendanceStatus>('present');
  const [formRemarks, setFormRemarks] = useState('');

  // Daily records for selected date
  const recordsForDate = useMemo(() => {
    return attendance.filter(a => a.date === selectedDate);
  }, [attendance, selectedDate]);

  // Filtered by search & status
  const filteredRecords = useMemo(() => {
    return recordsForDate.filter(rec => {
      const matchesSearch = 
        rec.employee_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rec.employee_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rec.department_name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || rec.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [recordsForDate, searchTerm, statusFilter]);

  // Summary Metrics for the date
  const presentCount = recordsForDate.filter(r => r.status === 'present').length;
  const lateCount = recordsForDate.filter(r => r.status === 'late').length;
  const halfDayCount = recordsForDate.filter(r => r.status === 'half_day').length;
  const absentCount = recordsForDate.filter(r => r.status === 'absent').length;

  const handleSaveAttendance = (e: React.FormEvent) => {
    e.preventDefault();
    const emp = employees.find(x => x.employee_id === formEmployeeId);
    if (!emp) return;

    recordAttendance({
      employee_id: emp.employee_id,
      employee_name: emp.full_name,
      department_name: emp.department_name || 'General Department',
      date: selectedDate,
      check_in: formStatus !== 'absent' ? formCheckIn : null,
      check_out: formStatus !== 'absent' ? formCheckOut : null,
      status: formStatus,
      remarks: formRemarks || 'Manual verification'
    });

    setShowEntryModal(false);
    setFormRemarks('');
  };

  const canManage = ['super_admin', 'hr_admin', 'department_head'].includes(currentUser.role);

  return (
    <div className="space-y-6">
      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg md:text-xl font-bold text-slate-900">
            Staff Attendance & Biometric Audit
          </h2>
          <p className="text-xs text-slate-500">
            Module 4: Daily presence tracking, punctuality, and attendance log management
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Quick Punch for Self */}
          <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-slate-200">
            <button
              onClick={() => punchAttendance(currentUser.employee_id, 'in')}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-md cursor-pointer"
              title="Punch In Current Time"
            >
              <LogIn className="w-3.5 h-3.5" /> Punch In
            </button>
            <button
              onClick={() => punchAttendance(currentUser.employee_id, 'out')}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 rounded-md cursor-pointer"
              title="Punch Out Current Time"
            >
              <LogOut className="w-3.5 h-3.5" /> Punch Out
            </button>
          </div>

          {canManage && (
            <button
              onClick={() => setShowEntryModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-white bg-[#0a2540] hover:bg-[#163e66] rounded-lg shadow-xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> Log Attendance Entry
            </button>
          )}
        </div>
      </div>

      {/* Date & Filter Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Date Picker */}
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-slate-400" />
            <input
              type="date"
              value={selectedDate}
              onChange={e => setSelectedDate(e.target.value)}
              className="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg font-mono font-bold text-slate-800"
            />
          </div>

          <button
            onClick={() => setSelectedDate(todayStr)}
            className="px-2.5 py-1.5 text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-md cursor-pointer"
          >
            Today
          </button>
        </div>

        {/* Search & Status Filter */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-56">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="Filter employee or dept..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
            />
          </div>

          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value as any)}
            className="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700"
          >
            <option value="all">All Statuses</option>
            <option value="present">Present</option>
            <option value="late">Late</option>
            <option value="half_day">Half Day</option>
            <option value="absent">Absent</option>
          </select>

          <button
            onClick={() => window.print()}
            className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg border border-slate-200 cursor-pointer"
            title="Print Attendance Sheet"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Daily Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Present (On-Time)</div>
            <div className="text-2xl font-extrabold text-emerald-600 font-mono mt-0.5">{presentCount}</div>
          </div>
          <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Late Arrival</div>
            <div className="text-2xl font-extrabold text-amber-600 font-mono mt-0.5">{lateCount}</div>
          </div>
          <div className="p-2 rounded-lg bg-amber-50 text-amber-600">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Half-Day Shift</div>
            <div className="text-2xl font-extrabold text-sky-600 font-mono mt-0.5">{halfDayCount}</div>
          </div>
          <div className="p-2 rounded-lg bg-sky-50 text-sky-600">
            <MinusCircle className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Absent</div>
            <div className="text-2xl font-extrabold text-rose-600 font-mono mt-0.5">{absentCount}</div>
          </div>
          <div className="p-2 rounded-lg bg-rose-50 text-rose-600">
            <XCircle className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Attendance Roster Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Employee ID</th>
                <th className="py-3 px-4">Staff Name</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Check-In</th>
                <th className="py-3 px-4">Check-Out</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Remarks / Station</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    No attendance logs recorded for {selectedDate}.
                  </td>
                </tr>
              ) : (
                filteredRecords.map(rec => (
                  <tr key={rec.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-[#0a2540]">
                      {rec.employee_id}
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-900">
                      {rec.employee_name}
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      {rec.department_name}
                    </td>
                    <td className="py-3 px-4 font-mono font-medium text-slate-800">
                      {rec.check_in || '--:--:--'}
                    </td>
                    <td className="py-3 px-4 font-mono font-medium text-slate-800">
                      {rec.check_out || '--:--:--'}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold ${
                        rec.status === 'present'
                          ? 'bg-emerald-50 text-emerald-700'
                          : rec.status === 'late'
                          ? 'bg-amber-50 text-amber-700'
                          : rec.status === 'half_day'
                          ? 'bg-sky-50 text-sky-700'
                          : 'bg-rose-50 text-rose-700'
                      }`}>
                        {rec.status === 'present' ? 'Present' : rec.status === 'late' ? 'Late Arrival' : rec.status === 'half_day' ? 'Half-Day' : 'Absent'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">
                      {rec.remarks || 'Terminal Verified'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Log Attendance Entry Modal */}
      {showEntryModal && (
        <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden">
            <div className="bg-[#0a2540] text-white p-4 px-6 flex items-center justify-between">
              <h3 className="font-bold text-sm">Manual Attendance Verification</h3>
              <button onClick={() => setShowEntryModal(false)} className="text-slate-300 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveAttendance} className="p-5 space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Select Employee *</label>
                <select
                  value={formEmployeeId}
                  onChange={e => setFormEmployeeId(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-medium"
                >
                  {employees.map(e => (
                    <option key={e.id} value={e.employee_id}>
                      {e.employee_id} - {e.full_name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Attendance Status *</label>
                <select
                  value={formStatus}
                  onChange={e => setFormStatus(e.target.value as AttendanceStatus)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-semibold"
                >
                  <option value="present">Present (On-Time)</option>
                  <option value="late">Late Arrival</option>
                  <option value="half_day">Half-Day Shift</option>
                  <option value="absent">Absent</option>
                </select>
              </div>

              {formStatus !== 'absent' && (
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Check-In Time</label>
                    <input
                      type="time"
                      value={formCheckIn}
                      onChange={e => setFormCheckIn(e.target.value)}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Check-Out Time</label>
                    <input
                      type="time"
                      value={formCheckOut}
                      onChange={e => setFormCheckOut(e.target.value)}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-mono"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Remarks / Note</label>
                <input
                  type="text"
                  placeholder="e.g. Field inspection, lab duty, senate meeting"
                  value={formRemarks}
                  onChange={e => setFormRemarks(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button type="button" onClick={() => setShowEntryModal(false)} className="px-4 py-2 text-slate-600 cursor-pointer">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 font-bold text-white bg-[#0a2540] rounded-lg cursor-pointer">
                  Save Attendance
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
