import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { LeaveType, LeaveStatus, LeaveRequest } from '../types';
import { 
  CalendarCheck, 
  Plus, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Filter, 
  X, 
  MessageSquare,
  FileCheck2,
  Calendar
} from 'lucide-react';

export const LeavesView: React.FC = () => {
  const { leaves, employees, applyLeave, reviewLeave, currentUser } = useApp();

  const [statusFilter, setStatusFilter] = useState<'all' | LeaveStatus>('all');
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [reviewingLeave, setReviewingLeave] = useState<{ id: number; action: 'approved' | 'rejected' } | null>(null);
  const [reviewRemarks, setReviewRemarks] = useState('');

  // Form State for Leave Application
  const todayStr = new Date().toISOString().split('T')[0];
  const [formEmployeeId, setFormEmployeeId] = useState(currentUser.employee_id || employees[0]?.employee_id);
  const [formLeaveType, setFormLeaveType] = useState<LeaveType>('annual');
  const [formStartDate, setFormStartDate] = useState(todayStr);
  const [formEndDate, setFormEndDate] = useState(todayStr);
  const [formDays, setFormDays] = useState(3);
  const [formReason, setFormReason] = useState('');

  // Filtered leaves
  const filteredLeaves = useMemo(() => {
    return leaves.filter(l => statusFilter === 'all' || l.status === statusFilter);
  }, [leaves, statusFilter]);

  const canApprove = ['super_admin', 'hr_admin', 'department_head'].includes(currentUser.role);

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    const emp = employees.find(x => x.employee_id === formEmployeeId);
    if (!emp) return;

    applyLeave({
      employee_id: emp.employee_id,
      employee_name: emp.full_name,
      department_name: emp.department_name || 'General',
      leave_type: formLeaveType,
      start_date: formStartDate,
      end_date: formEndDate,
      days_requested: Number(formDays),
      reason: formReason
    });

    setShowApplyModal(false);
    setFormReason('');
  };

  const handleConfirmReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewingLeave) return;

    reviewLeave(reviewingLeave.id, reviewingLeave.action, reviewRemarks);
    setReviewingLeave(null);
    setReviewRemarks('');
  };

  return (
    <div className="space-y-6">
      {/* Title & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg md:text-xl font-bold text-slate-900">
            Leave Requests & Statutory Absence Approvals
          </h2>
          <p className="text-xs text-slate-500">
            Module 5: Annual, medical, maternity, and research sabbatical leave management
          </p>
        </div>

        <button
          onClick={() => {
            setFormEmployeeId(currentUser.employee_id || employees[0]?.employee_id);
            setShowApplyModal(true);
          }}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-[#0a2540] hover:bg-[#163e66] rounded-lg shadow-xs cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" /> Submit Leave Request
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1 p-1 bg-white rounded-xl border border-slate-200 shadow-xs max-w-fit">
        <button
          onClick={() => setStatusFilter('all')}
          className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
            statusFilter === 'all' ? 'bg-[#0a2540] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          All Requests ({leaves.length})
        </button>
        <button
          onClick={() => setStatusFilter('pending')}
          className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
            statusFilter === 'pending' ? 'bg-amber-500 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Clock className="w-3.5 h-3.5" /> Pending Review ({leaves.filter(l => l.status === 'pending').length})
        </button>
        <button
          onClick={() => setStatusFilter('approved')}
          className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
            statusFilter === 'approved' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5" /> Approved ({leaves.filter(l => l.status === 'approved').length})
        </button>
        <button
          onClick={() => setStatusFilter('rejected')}
          className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
            statusFilter === 'rejected' ? 'bg-rose-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <XCircle className="w-3.5 h-3.5" /> Rejected ({leaves.filter(l => l.status === 'rejected').length})
        </button>
      </div>

      {/* Leave Applications Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Ref #</th>
                <th className="py-3 px-4">Employee</th>
                <th className="py-3 px-4">Leave Type</th>
                <th className="py-3 px-4">Duration & Dates</th>
                <th className="py-3 px-4">Reason</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Review Notes</th>
                {canApprove && <th className="py-3 px-4 text-right">Approval Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLeaves.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    No leave requests match the selected status.
                  </td>
                </tr>
              ) : (
                filteredLeaves.map(lr => (
                  <tr key={lr.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-mono text-slate-400">
                      #LR-{String(lr.id).slice(-4)}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{lr.employee_name}</div>
                      <div className="font-mono text-[11px] text-[#0a2540]">{lr.employee_id}</div>
                      <div className="text-[11px] text-slate-400">{lr.department_name}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold capitalize text-slate-800 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded text-[11px]">
                        {lr.leave_type} Leave
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-mono font-bold text-slate-900">{lr.days_requested} Days</div>
                      <div className="text-[11px] text-slate-500 font-mono">
                        {lr.start_date} to {lr.end_date}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-600 max-w-xs">
                      <p className="line-clamp-2 leading-relaxed">{lr.reason}</p>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        lr.status === 'pending'
                          ? 'bg-amber-100 text-amber-800'
                          : lr.status === 'approved'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}>
                        {lr.status === 'pending' ? 'Pending Review' : lr.status === 'approved' ? 'Approved' : 'Rejected'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-500 text-[11px]">
                      {lr.reviewed_by ? (
                        <div>
                          <div className="font-medium text-slate-700">By: {lr.reviewed_by}</div>
                          <div className="italic text-slate-400">"{lr.review_remarks}"</div>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">Awaiting administrative decision</span>
                      )}
                    </td>
                    {canApprove && (
                      <td className="py-3 px-4 text-right">
                        {lr.status === 'pending' ? (
                          <div className="inline-flex items-center gap-1">
                            <button
                              onClick={() => {
                                setReviewingLeave({ id: lr.id, action: 'approved' });
                                setReviewRemarks('Approved per university administrative statutory leave entitlement.');
                              }}
                              className="px-2.5 py-1 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-md cursor-pointer"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => {
                                setReviewingLeave({ id: lr.id, action: 'rejected' });
                                setReviewRemarks('Declined due to academic scheduling conflicts.');
                              }}
                              className="px-2.5 py-1 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-md cursor-pointer"
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span className="text-slate-400 font-mono text-[11px]">Resolved</span>
                        )}
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Review Modal (Approve / Reject Dialog) */}
      {reviewingLeave && (
        <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden">
            <div className={`p-4 px-6 text-white flex items-center justify-between ${
              reviewingLeave.action === 'approved' ? 'bg-emerald-700' : 'bg-rose-700'
            }`}>
              <h3 className="font-bold text-sm">
                Confirm Leave {reviewingLeave.action === 'approved' ? 'Approval' : 'Rejection'}
              </h3>
              <button onClick={() => setReviewingLeave(null)} className="text-white/80 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleConfirmReview} className="p-5 space-y-4 text-xs">
              <p className="text-slate-700 leading-relaxed">
                You are about to mark Leave Application <strong>#{reviewingLeave.id}</strong> as{' '}
                <strong className={reviewingLeave.action === 'approved' ? 'text-emerald-700 uppercase' : 'text-rose-700 uppercase'}>
                  {reviewingLeave.action}
                </strong>.
              </p>

              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Administrative Review Remarks *
                </label>
                <textarea
                  required
                  rows={3}
                  value={reviewRemarks}
                  onChange={e => setReviewRemarks(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                  placeholder="Enter reason or endorsement details..."
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button type="button" onClick={() => setReviewingLeave(null)} className="px-4 py-2 text-slate-600 cursor-pointer">
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-5 py-2 font-bold text-white rounded-lg cursor-pointer ${
                    reviewingLeave.action === 'approved' ? 'bg-emerald-600 hover:bg-emerald-500' : 'bg-rose-600 hover:bg-rose-500'
                  }`}
                >
                  Confirm Decision
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Apply Leave Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden">
            <div className="bg-[#0a2540] text-white p-4 px-6 flex items-center justify-between">
              <h3 className="font-bold text-sm">Submit Institutional Leave Request</h3>
              <button onClick={() => setShowApplyModal(false)} className="text-slate-300 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleApply} className="p-5 space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Applicant Employee *</label>
                <select
                  value={formEmployeeId}
                  onChange={e => setFormEmployeeId(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-medium"
                >
                  {employees.map(e => (
                    <option key={e.id} value={e.employee_id}>
                      {e.employee_id} - {e.full_name} ({e.position})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Leave Category *</label>
                <select
                  value={formLeaveType}
                  onChange={e => setFormLeaveType(e.target.value as LeaveType)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-semibold"
                >
                  <option value="annual">Annual Leave (Recreational)</option>
                  <option value="sick">Sick Leave (Medical Certification)</option>
                  <option value="maternity">Maternity Leave (Statutory 90 Days)</option>
                  <option value="emergency">Emergency / Compassionate Leave</option>
                  <option value="study">Study / Academic Sabbatical Leave</option>
                  <option value="unpaid">Special Unpaid Leave</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Start Date *</label>
                  <input
                    type="date"
                    required
                    value={formStartDate}
                    onChange={e => setFormStartDate(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">End Date *</label>
                  <input
                    type="date"
                    required
                    value={formEndDate}
                    onChange={e => setFormEndDate(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Total Days Requested *</label>
                <input
                  type="number"
                  min={1}
                  max={120}
                  required
                  value={formDays}
                  onChange={e => setFormDays(Number(e.target.value))}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-mono font-bold"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Official Reason & Justification *</label>
                <textarea
                  required
                  rows={3}
                  placeholder="State academic coverage arrangements, hospital referral, or family emergency details..."
                  value={formReason}
                  onChange={e => setFormReason(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button type="button" onClick={() => setShowApplyModal(false)} className="px-4 py-2 text-slate-600 cursor-pointer">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 font-bold text-white bg-[#0a2540] rounded-lg cursor-pointer">
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
