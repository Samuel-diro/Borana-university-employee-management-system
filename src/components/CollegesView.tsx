import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Building2, Plus, Users, GraduationCap, MapPin, Mail, Phone, Trash2, X } from 'lucide-react';

export const CollegesView: React.FC = () => {
  const { colleges, departments, employees, addCollege, deleteCollege, addDepartment, deleteDepartment, currentUser } = useApp();

  const [activeTab, setActiveTab] = useState<'colleges' | 'departments'>('colleges');
  const [selectedCollegeId, setSelectedCollegeId] = useState<number | 'all'>('all');

  const [showAddCollegeModal, setShowAddCollegeModal] = useState(false);
  const [showAddDeptModal, setShowAddDeptModal] = useState(false);

  // Form states
  const [collegeForm, setCollegeForm] = useState({
    code: '',
    name: '',
    dean_name: '',
    description: '',
    established_year: 2020
  });

  const [deptForm, setDeptForm] = useState({
    college_id: colleges[0]?.id || 1,
    code: '',
    name: '',
    head_name: '',
    office_location: '',
    email: '',
    phone: ''
  });

  const canManage = ['super_admin', 'hr_admin'].includes(currentUser.role);

  const handleAddCollege = (e: React.FormEvent) => {
    e.preventDefault();
    if (collegeForm.code && collegeForm.name) {
      addCollege(collegeForm);
      setCollegeForm({ code: '', name: '', dean_name: '', description: '', established_year: 2020 });
      setShowAddCollegeModal(false);
    }
  };

  const handleAddDept = (e: React.FormEvent) => {
    e.preventDefault();
    if (deptForm.code && deptForm.name) {
      addDepartment({
        ...deptForm,
        college_id: Number(deptForm.college_id)
      });
      setDeptForm({
        college_id: colleges[0]?.id || 1,
        code: '',
        name: '',
        head_name: '',
        office_location: '',
        email: '',
        phone: ''
      });
      setShowAddDeptModal(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg md:text-xl font-bold text-slate-900">
            University Organizational Structure
          </h2>
          <p className="text-xs text-slate-500">
            Module 3: Colleges, academic faculties, and departmental administration
          </p>
        </div>

        {canManage && (
          <div className="flex gap-2">
            <button
              onClick={() => setShowAddCollegeModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-white bg-[#0a2540] hover:bg-[#163e66] rounded-lg shadow-xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> Add College
            </button>
            <button
              onClick={() => setShowAddDeptModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> Add Department
            </button>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('colleges')}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
            activeTab === 'colleges'
              ? 'bg-[#0a2540] text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Colleges & Faculties ({colleges.length})
        </button>
        <button
          onClick={() => setActiveTab('departments')}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
            activeTab === 'departments'
              ? 'bg-[#0a2540] text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Academic Departments ({departments.length})
        </button>
      </div>

      {/* COLLEGES TAB CONTENT */}
      {activeTab === 'colleges' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {colleges.map(c => {
            const collegeDepts = departments.filter(d => d.college_id === c.id);
            const collegeStaff = employees.filter(e => e.college_id === c.id);

            return (
              <div key={c.id} className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 flex flex-col justify-between hover:border-slate-300 transition-colors">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-mono text-xs font-bold text-white bg-[#0a2540] px-2 py-0.5 rounded">
                      {c.code}
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">
                      Est. {c.established_year}
                    </span>
                  </div>

                  <h3 className="font-bold text-sm text-slate-900 leading-snug mb-1.5">
                    {c.name}
                  </h3>

                  <p className="text-xs text-slate-500 mb-4 line-clamp-2">
                    {c.description || 'Center for academic advancement and community research.'}
                  </p>

                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-xs mb-4">
                    <div className="text-[11px] text-slate-400">Dean of Faculty:</div>
                    <div className="font-bold text-slate-800">{c.dean_name || 'Vacant / To be Appointed'}</div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3 text-slate-600 font-medium">
                    <span><strong>{collegeDepts.length}</strong> Depts</span>
                    <span>&middot;</span>
                    <span><strong>{collegeStaff.length}</strong> Staff</span>
                  </div>

                  {canManage && (
                    <button
                      onClick={() => {
                        const success = deleteCollege(c.id);
                        if (!success) {
                          alert(`Cannot delete ${c.name} because active departments or employees are assigned to it.`);
                        }
                      }}
                      className="p-1 text-slate-400 hover:text-rose-600 rounded cursor-pointer"
                      title="Delete College"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* DEPARTMENTS TAB CONTENT */}
      {activeTab === 'departments' && (
        <div className="space-y-4">
          {/* College Filter Pill Bar */}
          <div className="flex flex-wrap items-center gap-2 p-1.5 bg-white rounded-xl border border-slate-200 text-xs">
            <span className="font-semibold text-slate-500 px-2">Filter College:</span>
            <button
              onClick={() => setSelectedCollegeId('all')}
              className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                selectedCollegeId === 'all' ? 'bg-[#0a2540] text-white font-bold' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              All Colleges
            </button>
            {colleges.map(c => (
              <button
                key={c.id}
                onClick={() => setSelectedCollegeId(c.id)}
                className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                  selectedCollegeId === c.id ? 'bg-[#0a2540] text-white font-bold' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {c.code}
              </button>
            ))}
          </div>

          {/* Departments Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Code</th>
                    <th className="py-3 px-4">Department Name</th>
                    <th className="py-3 px-4">College</th>
                    <th className="py-3 px-4">Head of Department</th>
                    <th className="py-3 px-4">Office & Contact</th>
                    <th className="py-3 px-4">Staff Count</th>
                    {canManage && <th className="py-3 px-4 text-right">Action</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {departments
                    .filter(d => selectedCollegeId === 'all' || d.college_id === selectedCollegeId)
                    .map(d => {
                      const college = colleges.find(c => c.id === d.college_id);
                      const deptStaff = employees.filter(e => e.department_id === d.id);

                      return (
                        <tr key={d.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3 px-4 font-mono font-bold text-[#0a2540]">
                            {d.code}
                          </td>
                          <td className="py-3 px-4">
                            <div className="font-bold text-slate-900">{d.name}</div>
                            <div className="text-[11px] text-slate-400 font-mono">{d.email}</div>
                          </td>
                          <td className="py-3 px-4">
                            <span className="font-semibold text-slate-800">{college?.name}</span>
                            <div className="text-[10px] text-slate-400">{college?.code}</div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="font-semibold text-slate-800">{d.head_name || 'Vacant'}</div>
                            <div className="text-[11px] text-slate-400">{d.phone}</div>
                          </td>
                          <td className="py-3 px-4 text-slate-600">
                            <div>{d.office_location}</div>
                          </td>
                          <td className="py-3 px-4">
                            <span className="font-mono font-bold bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-[11px]">
                              {deptStaff.length} Employees
                            </span>
                          </td>
                          {canManage && (
                            <td className="py-3 px-4 text-right">
                              <button
                                onClick={() => {
                                  const success = deleteDepartment(d.id);
                                  if (!success) {
                                    alert(`Cannot delete ${d.name} because staff members are actively enrolled in it.`);
                                  }
                                }}
                                className="p-1 text-slate-400 hover:text-rose-600 rounded cursor-pointer"
                                title="Delete Department"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          )}
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Add College Modal */}
      {showAddCollegeModal && (
        <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden">
            <div className="bg-[#0a2540] text-white p-4 px-6 flex items-center justify-between">
              <h3 className="font-bold text-sm">Add New University College</h3>
              <button onClick={() => setShowAddCollegeModal(false)} className="text-slate-300 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddCollege} className="p-5 space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">College Code *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. CIC, CBE, CANR"
                  value={collegeForm.code}
                  onChange={e => setCollegeForm({ ...collegeForm, code: e.target.value.toUpperCase() })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-mono font-bold"
                />
              </div>
              <div>
                <label className="block text-slate-600 font-semibold mb-1">College Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. College of Health Sciences"
                  value={collegeForm.name}
                  onChange={e => setCollegeForm({ ...collegeForm, name: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Dean's Name</label>
                <input
                  type="text"
                  placeholder="e.g. Dr. Bontu Dida (MD, MPH)"
                  value={collegeForm.dean_name}
                  onChange={e => setCollegeForm({ ...collegeForm, dean_name: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Established Year</label>
                <input
                  type="number"
                  value={collegeForm.established_year}
                  onChange={e => setCollegeForm({ ...collegeForm, established_year: Number(e.target.value) })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-mono"
                />
              </div>
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Academic overview..."
                  value={collegeForm.description}
                  onChange={e => setCollegeForm({ ...collegeForm, description: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>
              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button type="button" onClick={() => setShowAddCollegeModal(false)} className="px-4 py-2 text-slate-600 cursor-pointer">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 font-bold text-white bg-[#0a2540] rounded-lg cursor-pointer">
                  Save College
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Department Modal */}
      {showAddDeptModal && (
        <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden">
            <div className="bg-[#0a2540] text-white p-4 px-6 flex items-center justify-between">
              <h3 className="font-bold text-sm">Add New Academic Department</h3>
              <button onClick={() => setShowAddDeptModal(false)} className="text-slate-300 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddDept} className="p-5 space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Parent College *</label>
                <select
                  value={deptForm.college_id}
                  onChange={e => setDeptForm({ ...deptForm, college_id: Number(e.target.value) })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-medium"
                >
                  {colleges.map(c => (
                    <option key={c.id} value={c.id}>{c.code} - {c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Department Code *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. CS, IT, ACCF"
                  value={deptForm.code}
                  onChange={e => setDeptForm({ ...deptForm, code: e.target.value.toUpperCase() })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-mono font-bold"
                />
              </div>
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Department Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Department of Computer Science"
                  value={deptForm.name}
                  onChange={e => setDeptForm({ ...deptForm, name: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Department Head</label>
                <input
                  type="text"
                  placeholder="e.g. Samuel Diro (MSc)"
                  value={deptForm.head_name}
                  onChange={e => setDeptForm({ ...deptForm, head_name: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Office Location</label>
                <input
                  type="text"
                  placeholder="e.g. Block B2, Room 304"
                  value={deptForm.office_location}
                  onChange={e => setDeptForm({ ...deptForm, office_location: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Email</label>
                  <input
                    type="email"
                    placeholder="cs@borana.edu.et"
                    value={deptForm.email}
                    onChange={e => setDeptForm({ ...deptForm, email: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Phone</label>
                  <input
                    type="text"
                    placeholder="+251 46 443 0122"
                    value={deptForm.phone}
                    onChange={e => setDeptForm({ ...deptForm, phone: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-mono"
                  />
                </div>
              </div>
              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button type="button" onClick={() => setShowAddDeptModal(false)} className="px-4 py-2 text-slate-600 cursor-pointer">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 font-bold text-white bg-[#0a2540] rounded-lg cursor-pointer">
                  Save Department
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
