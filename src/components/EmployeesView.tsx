import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Employee, StaffCategory, EmploymentStatus } from '../types';
import { 
  Search, 
  UserPlus, 
  Filter, 
  GraduationCap, 
  Briefcase, 
  Eye, 
  Edit3, 
  Trash2, 
  Printer, 
  X, 
  Check, 
  Download,
  Building2,
  Mail,
  Phone,
  Calendar,
  CreditCard
} from 'lucide-react';

export const EmployeesView: React.FC = () => {
  const { employees, colleges, departments, addEmployee, updateEmployee, deleteEmployee, currentUser } = useApp();

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | StaffCategory>('all');
  const [collegeFilter, setCollegeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Modals state
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);

  // Form State for new registration
  const nextIdSeq = employees.length + 1;
  const initialForm: {
    employee_id: string;
    first_name: string;
    father_name: string;
    grandfather_name: string;
    full_name: string;
    gender: 'Male' | 'Female';
    date_of_birth: string;
    national_id: string;
    email: string;
    phone: string;
    emergency_contact: string;
    address: string;
    city: string;
    staff_category: StaffCategory;
    college_id: number;
    department_id: number;
    position: string;
    academic_rank: string;
    qualification: string;
    specialization: string;
    employment_type: 'Full-Time' | 'Contract' | 'Part-Time';
    hire_date: string;
    salary: number;
    status: EmploymentStatus;
    photo_url: string;
  } = {
    employee_id: `BU-EMP-${String(nextIdSeq).padStart(3, '0')}`,
    first_name: '',
    father_name: '',
    grandfather_name: '',
    full_name: '',
    gender: 'Male',
    date_of_birth: '1992-05-10',
    national_id: '',
    email: '',
    phone: '',
    emergency_contact: '',
    address: 'Campus Residential Quarters',
    city: 'Yabello',
    staff_category: 'academic',
    college_id: colleges[0]?.id || 1,
    department_id: departments[0]?.id || 1,
    position: 'Lecturer',
    academic_rank: 'Assistant Professor',
    qualification: 'MSc in Computer Science',
    specialization: '',
    employment_type: 'Full-Time',
    hire_date: new Date().toISOString().split('T')[0],
    salary: 22000,
    status: 'active',
    photo_url: '/src/assets/images/avatar_dean_academic_1794424750138.jpg'
  };

  const [formData, setFormData] = useState(initialForm);

  // Filtered Employees
  const filteredEmployees = useMemo(() => {
    return employees.filter(emp => {
      const matchesSearch = 
        emp.employee_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.position.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory = categoryFilter === 'all' || emp.staff_category === categoryFilter;
      const matchesCollege = collegeFilter === 'all' || String(emp.college_id) === collegeFilter;
      const matchesStatus = statusFilter === 'all' || emp.status === statusFilter;

      return matchesSearch && matchesCategory && matchesCollege && matchesStatus;
    });
  }, [employees, searchTerm, categoryFilter, collegeFilter, statusFilter]);

  // Handle Form Submission
  const handleSaveEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    const fullName = `${formData.first_name} ${formData.father_name} ${formData.grandfather_name}`.trim();
    const college = colleges.find(c => c.id === Number(formData.college_id));
    const dept = departments.find(d => d.id === Number(formData.department_id));

    if (editingEmployee) {
      updateEmployee(editingEmployee.id, {
        ...formData,
        full_name: fullName,
        college_id: Number(formData.college_id),
        department_id: Number(formData.department_id),
        college_name: college?.name,
        department_name: dept?.name
      });
      setEditingEmployee(null);
    } else {
      addEmployee({
        ...formData,
        full_name: fullName,
        college_id: Number(formData.college_id),
        department_id: Number(formData.department_id),
        college_name: college?.name,
        department_name: dept?.name
      });
      setShowRegisterModal(false);
      setFormData({
        ...initialForm,
        employee_id: `BU-EMP-${String(employees.length + 2).padStart(3, '0')}`
      });
    }
  };

  const canManage = ['super_admin', 'hr_admin'].includes(currentUser.role);

  return (
    <div className="space-y-6">
      {/* Header with Title and Registration Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg md:text-xl font-bold text-slate-900">
            Employee Directory & Profile Registry
          </h2>
          <p className="text-xs text-slate-500">
            Modules 1, 2 & 6: Academic and administrative staff management & search
          </p>
        </div>

        {canManage && (
          <button
            onClick={() => {
              setFormData({
                ...initialForm,
                employee_id: `BU-EMP-${String(employees.length + 1).padStart(3, '0')}`
              });
              setEditingEmployee(null);
              setShowRegisterModal(true);
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-[#0a2540] hover:bg-[#163e66] rounded-lg shadow-xs transition-colors cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            Register New Employee
          </button>
        )}
      </div>

      {/* Module 6: Search & Filtering Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by Employee ID, Name, Email or Job Title..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0a2540]"
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')} 
                className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Category Filter Tabs */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg shrink-0">
            <button
              onClick={() => setCategoryFilter('all')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                categoryFilter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Staff ({employees.length})
            </button>
            <button
              onClick={() => setCategoryFilter('academic')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer flex items-center gap-1 ${
                categoryFilter === 'academic' ? 'bg-white text-sky-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" /> Academic
            </button>
            <button
              onClick={() => setCategoryFilter('administrative')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer flex items-center gap-1 ${
                categoryFilter === 'administrative' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" /> Admin
            </button>
          </div>
        </div>

        {/* Secondary Filters */}
        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-1.5 text-slate-500">
            <Filter className="w-3.5 h-3.5" />
            <span className="font-semibold">Filter By:</span>
          </div>

          <select
            value={collegeFilter}
            onChange={e => setCollegeFilter(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-xs text-slate-700"
          >
            <option value="all">All Colleges / Divisions</option>
            {colleges.map(c => (
              <option key={c.id} value={c.id}>{c.code} - {c.name}</option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-xs text-slate-700"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="on_leave">On Leave</option>
            <option value="suspended">Suspended</option>
            <option value="retired">Retired</option>
          </select>

          <span className="ml-auto text-slate-400 font-mono">
            Showing {filteredEmployees.length} of {employees.length} records
          </span>
        </div>
      </div>

      {/* Employees Data Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Employee</th>
                <th className="py-3 px-4">Category & Rank</th>
                <th className="py-3 px-4">College & Department</th>
                <th className="py-3 px-4">Qualification</th>
                <th className="py-3 px-4">Hire Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredEmployees.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    No employee records match the given criteria.
                  </td>
                </tr>
              ) : (
                filteredEmployees.map(emp => {
                  const college = colleges.find(c => c.id === emp.college_id);
                  const dept = departments.find(d => d.id === emp.department_id);

                  return (
                    <tr key={emp.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={emp.photo_url || '/src/assets/images/avatar_dean_academic_1794424750138.jpg'}
                            alt={emp.full_name}
                            className="w-9 h-9 rounded-full object-cover border border-slate-200 shrink-0"
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <div className="font-bold text-slate-900">{emp.full_name}</div>
                            <div className="text-[11px] font-mono text-[#0a2540] font-semibold">{emp.employee_id}</div>
                            <div className="text-[11px] text-slate-400">{emp.email}</div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold ${
                          emp.staff_category === 'academic' 
                            ? 'bg-sky-50 text-sky-700 border border-sky-200' 
                            : 'bg-slate-100 text-slate-700 border border-slate-200'
                        }`}>
                          {emp.staff_category === 'academic' ? 'Academic Faculty' : 'Administrative'}
                        </span>
                        <div className="font-medium text-slate-800 mt-1">{emp.position}</div>
                        {emp.academic_rank && (
                          <div className="text-[10px] text-slate-400">{emp.academic_rank}</div>
                        )}
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-800">{dept?.name || 'Department'}</div>
                        <div className="text-[11px] text-slate-500">{college?.name || 'College'}</div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-medium text-slate-800">{emp.qualification}</div>
                        <div className="text-[11px] text-slate-400">{emp.specialization || 'General'}</div>
                      </td>

                      <td className="py-3 px-4 font-mono text-slate-600">
                        {emp.hire_date}
                      </td>

                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold ${
                          emp.status === 'active' 
                            ? 'bg-emerald-50 text-emerald-700' 
                            : emp.status === 'on_leave' 
                            ? 'bg-amber-50 text-amber-700' 
                            : 'bg-slate-100 text-slate-600'
                        }`}>
                          {emp.status === 'active' ? 'Active' : emp.status === 'on_leave' ? 'On Leave' : emp.status}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="inline-flex items-center gap-1">
                          <button
                            onClick={() => setSelectedEmployee(emp)}
                            className="p-1.5 text-slate-600 hover:text-[#0a2540] hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
                            title="View Full Profile & ID Card"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {canManage && (
                            <>
                              <button
                                onClick={() => {
                                  setEditingEmployee(emp);
                                  setFormData({
                                    employee_id: emp.employee_id,
                                    first_name: emp.first_name,
                                    father_name: emp.father_name,
                                    grandfather_name: emp.grandfather_name,
                                    full_name: emp.full_name,
                                    gender: emp.gender,
                                    date_of_birth: emp.date_of_birth,
                                    national_id: emp.national_id,
                                    email: emp.email,
                                    phone: emp.phone,
                                    emergency_contact: emp.emergency_contact,
                                    address: emp.address,
                                    city: emp.city,
                                    staff_category: emp.staff_category,
                                    college_id: emp.college_id,
                                    department_id: emp.department_id,
                                    position: emp.position,
                                    academic_rank: emp.academic_rank || '',
                                    qualification: emp.qualification,
                                    specialization: emp.specialization,
                                    employment_type: emp.employment_type,
                                    hire_date: emp.hire_date,
                                    salary: emp.salary,
                                    status: emp.status,
                                    photo_url: emp.photo_url
                                  });
                                  setShowRegisterModal(true);
                                }}
                                className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
                                title="Edit Employee Record"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => {
                                  if (window.confirm(`Permanently remove employee ${emp.employee_id} (${emp.full_name})?`)) {
                                    deleteEmployee(emp.id);
                                  }
                                }}
                                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors cursor-pointer"
                                title="Delete Record"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* VIEW PROFILE & OFFICIAL ID CARD MODAL */}
      {selectedEmployee && (
        <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
            {/* Modal Header */}
            <div className="bg-[#0a2540] text-white p-4 px-6 flex items-center justify-between sticky top-0 z-10">
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-[#c59b27]" />
                <h3 className="font-bold text-sm md:text-base">
                  Borana University Staff Profile: {selectedEmployee.employee_id}
                </h3>
              </div>
              <button
                onClick={() => setSelectedEmployee(null)}
                className="p-1 text-slate-300 hover:text-white rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Printable Official ID Card Preview */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-[#0a2540] via-[#0e355c] to-[#163e66] text-white shadow-lg relative overflow-hidden border border-amber-400/30">
                <div className="flex items-center justify-between pb-3 border-b border-white/20 mb-4">
                  <div className="flex items-center gap-2">
                    <img 
                      src="/src/assets/images/borana_university_crest_1794424747251.jpg" 
                      alt="Crest" 
                      className="w-10 h-10 rounded-full bg-white p-0.5" 
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <h4 className="font-extrabold text-sm tracking-tight">BORANA UNIVERSITY</h4>
                      <p className="text-[10px] text-[#c59b27] font-semibold uppercase">Official Staff Identity Card</p>
                    </div>
                  </div>
                  <span className="font-mono text-xs font-bold bg-white/20 px-2 py-0.5 rounded">
                    {selectedEmployee.employee_id}
                  </span>
                </div>

                <div className="flex gap-4 items-center">
                  <img
                    src={selectedEmployee.photo_url || '/src/assets/images/avatar_dean_academic_1794424750138.jpg'}
                    alt={selectedEmployee.full_name}
                    className="w-20 h-24 rounded-lg object-cover border-2 border-[#c59b27] shrink-0 shadow-md"
                    referrerPolicy="no-referrer"
                  />
                  <div className="space-y-1 text-xs">
                    <div className="text-base font-extrabold text-white">{selectedEmployee.full_name}</div>
                    <div className="text-[#c59b27] font-bold">{selectedEmployee.position}</div>
                    <div className="text-slate-300 text-[11px]">{selectedEmployee.department_name}</div>
                    <div className="text-slate-300 text-[11px]">{selectedEmployee.college_name}</div>
                    <div className="text-[10px] text-slate-400 font-mono pt-1">
                      Hire Date: {selectedEmployee.hire_date} &middot; Status: {selectedEmployee.status.toUpperCase()}
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-2 border-t border-white/10 flex justify-between items-center text-[9px] text-slate-400 font-mono">
                  <span>Yabello, Borana Zone, Oromia</span>
                  <span>Authorized HR Issuer</span>
                </div>
              </div>

              {/* Comprehensive Details Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <span className="text-slate-400">Gender:</span>
                  <div className="font-semibold text-slate-800">{selectedEmployee.gender}</div>
                </div>
                <div>
                  <span className="text-slate-400">Date of Birth:</span>
                  <div className="font-semibold text-slate-800 font-mono">{selectedEmployee.date_of_birth}</div>
                </div>
                <div>
                  <span className="text-slate-400">National ID:</span>
                  <div className="font-semibold text-slate-800 font-mono">{selectedEmployee.national_id}</div>
                </div>
                <div>
                  <span className="text-slate-400">Staff Category:</span>
                  <div className="font-semibold capitalize text-slate-800">{selectedEmployee.staff_category}</div>
                </div>
                <div>
                  <span className="text-slate-400">Academic Rank:</span>
                  <div className="font-semibold text-slate-800">{selectedEmployee.academic_rank || 'N/A'}</div>
                </div>
                <div>
                  <span className="text-slate-400">Qualification:</span>
                  <div className="font-semibold text-slate-800">{selectedEmployee.qualification}</div>
                </div>
                <div>
                  <span className="text-slate-400">Specialization:</span>
                  <div className="font-semibold text-slate-800">{selectedEmployee.specialization || 'General'}</div>
                </div>
                <div>
                  <span className="text-slate-400">Monthly Salary:</span>
                  <div className="font-bold text-emerald-700 font-mono">
                    {selectedEmployee.salary.toLocaleString()} ETB
                  </div>
                </div>
                <div>
                  <span className="text-slate-400">Employment Type:</span>
                  <div className="font-semibold text-slate-800">{selectedEmployee.employment_type}</div>
                </div>
                <div className="col-span-2">
                  <span className="text-slate-400">Email & Contact:</span>
                  <div className="font-semibold text-slate-800 font-mono">{selectedEmployee.email} &middot; {selectedEmployee.phone}</div>
                </div>
                <div className="col-span-2">
                  <span className="text-slate-400">Residential Address:</span>
                  <div className="font-semibold text-slate-800">{selectedEmployee.address}, {selectedEmployee.city}</div>
                </div>
                <div>
                  <span className="text-slate-400">Emergency Contact:</span>
                  <div className="font-semibold text-slate-800">{selectedEmployee.emergency_contact || 'None listed'}</div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center">
              <button
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-white border border-slate-300 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" /> Print Profile / ID Card
              </button>
              <button
                onClick={() => setSelectedEmployee(null)}
                className="px-4 py-1.5 text-xs font-bold text-slate-700 bg-slate-200 hover:bg-slate-300 rounded-lg cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* REGISTER / EDIT EMPLOYEE MODAL (Module 1 & 2) */}
      {showRegisterModal && (
        <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200">
            <div className="bg-[#0a2540] text-white p-4 px-6 flex items-center justify-between sticky top-0 z-10">
              <h3 className="font-bold text-sm md:text-base">
                {editingEmployee ? `Edit Employee ${editingEmployee.employee_id}` : 'Enroll New University Employee'}
              </h3>
              <button
                onClick={() => setShowRegisterModal(false)}
                className="p-1 text-slate-300 hover:text-white rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEmployee} className="p-6 space-y-6">
              {/* Section 1: Identification */}
              <div>
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                  1. Identification & Personal Information
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Employee ID *</label>
                    <input
                      type="text"
                      required
                      value={formData.employee_id}
                      onChange={e => setFormData({ ...formData, employee_id: e.target.value })}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">First Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Samuel"
                      value={formData.first_name}
                      onChange={e => setFormData({ ...formData, first_name: e.target.value })}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Father's Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Diro"
                      value={formData.father_name}
                      onChange={e => setFormData({ ...formData, father_name: e.target.value })}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Grandfather's Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Tolera"
                      value={formData.grandfather_name}
                      onChange={e => setFormData({ ...formData, grandfather_name: e.target.value })}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Gender *</label>
                    <select
                      value={formData.gender}
                      onChange={e => setFormData({ ...formData, gender: e.target.value as 'Male' | 'Female' })}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Date of Birth *</label>
                    <input
                      type="date"
                      required
                      value={formData.date_of_birth}
                      onChange={e => setFormData({ ...formData, date_of_birth: e.target.value })}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">National ID *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. ETH-BOR-99824"
                      value={formData.national_id}
                      onChange={e => setFormData({ ...formData, national_id: e.target.value })}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Institutional Email *</label>
                    <input
                      type="email"
                      required
                      placeholder="username@borana.edu.et"
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Phone Number *</label>
                    <input
                      type="text"
                      required
                      placeholder="+251 91 123 4460"
                      value={formData.phone}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: University Assignment */}
              <div className="pt-4 border-t border-slate-100">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                  2. Academic & Administrative Assignment
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Staff Category *</label>
                    <select
                      value={formData.staff_category}
                      onChange={e => setFormData({ ...formData, staff_category: e.target.value as StaffCategory })}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-semibold"
                    >
                      <option value="academic">Academic Faculty</option>
                      <option value="administrative">Administrative Staff</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">College / Faculty *</label>
                    <select
                      value={formData.college_id}
                      onChange={e => setFormData({ ...formData, college_id: Number(e.target.value) })}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg"
                    >
                      {colleges.map(c => (
                        <option key={c.id} value={c.id}>{c.code} - {c.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Department *</label>
                    <select
                      value={formData.department_id}
                      onChange={e => setFormData({ ...formData, department_id: Number(e.target.value) })}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg"
                    >
                      {departments.map(d => (
                        <option key={d.id} value={d.id}>{d.code} - {d.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Job Title / Position *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Lecturer, Assistant Prof, HR Specialist"
                      value={formData.position}
                      onChange={e => setFormData({ ...formData, position: e.target.value })}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg"
                    />
                  </div>
                  {formData.staff_category === 'academic' && (
                    <div>
                      <label className="block text-slate-600 font-semibold mb-1">Academic Rank</label>
                      <select
                        value={formData.academic_rank}
                        onChange={e => setFormData({ ...formData, academic_rank: e.target.value })}
                        className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg"
                      >
                        <option value="Professor">Professor</option>
                        <option value="Associate Professor">Associate Professor</option>
                        <option value="Assistant Professor">Assistant Professor</option>
                        <option value="Lecturer">Lecturer</option>
                        <option value="Assistant Lecturer">Assistant Lecturer</option>
                        <option value="Graduate Assistant">Graduate Assistant</option>
                      </select>
                    </div>
                  )}
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Highest Qualification *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. PhD, MSc, MA, BSc"
                      value={formData.qualification}
                      onChange={e => setFormData({ ...formData, qualification: e.target.value })}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Area of Specialization</label>
                    <input
                      type="text"
                      placeholder="e.g. Database Systems, Pastoralist Ecology"
                      value={formData.specialization}
                      onChange={e => setFormData({ ...formData, specialization: e.target.value })}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Monthly Basic Salary (ETB) *</label>
                    <input
                      type="number"
                      required
                      value={formData.salary}
                      onChange={e => setFormData({ ...formData, salary: Number(e.target.value) })}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Status</label>
                    <select
                      value={formData.status}
                      onChange={e => setFormData({ ...formData, status: e.target.value as EmploymentStatus })}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg"
                    >
                      <option value="active">Active</option>
                      <option value="on_leave">On Leave</option>
                      <option value="suspended">Suspended</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowRegisterModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-[#0a2540] hover:bg-[#163e66] rounded-lg shadow-xs cursor-pointer"
                >
                  {editingEmployee ? 'Update Profile' : 'Save & Register'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
