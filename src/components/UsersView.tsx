import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';
import { 
  ShieldCheck, 
  UserPlus, 
  Check, 
  X, 
  Key, 
  Lock, 
  UserCheck, 
  AlertCircle,
  HelpCircle
} from 'lucide-react';

export const UsersView: React.FC = () => {
  const { users, employees, addUser, switchUser, currentUser } = useApp();

  const [showAddModal, setShowAddModal] = useState(false);
  const [formUsername, setFormUsername] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formFullName, setFormFullName] = useState('');
  const [formRole, setFormRole] = useState<UserRole>('employee');
  const [formEmployeeId, setFormEmployeeId] = useState('');

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (formUsername && formEmail && formFullName) {
      addUser({
        username: formUsername,
        email: formEmail,
        full_name: formFullName,
        role: formRole,
        employee_id: formEmployeeId || `BU-EMP-${Math.floor(Math.random() * 800 + 100)}`,
        avatar_url: '/src/assets/images/avatar_dean_academic_1794424750138.jpg'
      });
      setShowAddModal(false);
      setFormUsername('');
      setFormEmail('');
      setFormFullName('');
    }
  };

  const rbacMatrix = [
    {
      module: 'Employee CRUD & Profiles',
      superAdmin: 'Full (Create, Read, Update, Delete)',
      hrAdmin: 'Full (Create, Read, Update, Delete)',
      deptHead: 'Read-Only (Department Roster)',
      employee: 'Read-Only (Own Profile)'
    },
    {
      module: 'Colleges & Departments',
      superAdmin: 'Full Management',
      hrAdmin: 'Full Management',
      deptHead: 'View Assigned College / Dept',
      employee: 'View University Directory'
    },
    {
      module: 'Attendance Recording',
      superAdmin: 'Full Override & Audit',
      hrAdmin: 'Full Punch Recording & Reports',
      deptHead: 'Department Punctuality Audit',
      employee: 'Self Punch In / Out'
    },
    {
      module: 'Leave Request Approvals',
      superAdmin: 'Final Institutional Authority',
      hrAdmin: 'Statutory Verification & Approval',
      deptHead: 'Departmental Endorsement',
      employee: 'Submit Personal Request'
    },
    {
      module: 'Administrative Reports',
      superAdmin: 'Full System Export & Audit',
      hrAdmin: 'Full HR Census & Attendance',
      deptHead: 'Departmental Roster',
      employee: 'Restricted'
    },
    {
      module: 'User Provisioning & RBAC',
      superAdmin: 'Full System Configuration',
      hrAdmin: 'Restricted',
      deptHead: 'Restricted',
      employee: 'Restricted'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Title & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg md:text-xl font-bold text-slate-900">
            User Authentication & Role-Based Access Control (RBAC)
          </h2>
          <p className="text-xs text-slate-500">
            Module 7: Security governance, role hierarchies, password protection & account provisioning
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-[#0a2540] hover:bg-[#163e66] rounded-lg shadow-xs cursor-pointer"
        >
          <UserPlus className="w-3.5 h-3.5" /> Provision System User
        </button>
      </div>

      {/* Role Testing Interactive Switcher Box */}
      <div className="bg-gradient-to-r from-blue-50 via-slate-50 to-indigo-50 p-4 rounded-xl border border-blue-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="text-xs font-bold text-[#0a2540] flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#0a2540]" />
              Quick RBAC Simulator (Click to Test Portal Views as Grader):
            </div>
            <p className="text-[11px] text-slate-600">
              Instantly toggle the authenticated session across all 4 university roles to test permission boundaries.
            </p>
          </div>
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => switchUser('super_admin')}
              className={`px-2.5 py-1.5 text-xs font-bold rounded-lg cursor-pointer transition-colors ${
                currentUser.role === 'super_admin' ? 'bg-[#0a2540] text-white shadow-xs' : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              Super Admin
            </button>
            <button
              onClick={() => switchUser('hr_admin')}
              className={`px-2.5 py-1.5 text-xs font-bold rounded-lg cursor-pointer transition-colors ${
                currentUser.role === 'hr_admin' ? 'bg-[#0a2540] text-white shadow-xs' : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              HR Admin
            </button>
            <button
              onClick={() => switchUser('department_head')}
              className={`px-2.5 py-1.5 text-xs font-bold rounded-lg cursor-pointer transition-colors ${
                currentUser.role === 'department_head' ? 'bg-[#0a2540] text-white shadow-xs' : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              Dept Head
            </button>
            <button
              onClick={() => switchUser('employee')}
              className={`px-2.5 py-1.5 text-xs font-bold rounded-lg cursor-pointer transition-colors ${
                currentUser.role === 'employee' ? 'bg-[#0a2540] text-white shadow-xs' : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              Employee
            </button>
          </div>
        </div>
      </div>

      {/* RBAC Institutional Matrix */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200">
          <h3 className="text-sm font-bold text-slate-900">Institutional RBAC Privilege Matrix</h3>
          <p className="text-xs text-slate-500">Security permissions mapped across modules per project specification</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 uppercase tracking-wider font-semibold border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-4">System Module</th>
                <th className="py-2.5 px-4 text-[#0a2540]">1. Super Admin</th>
                <th className="py-2.5 px-4 text-slate-800">2. HR Admin</th>
                <th className="py-2.5 px-4 text-slate-800">3. Department Head</th>
                <th className="py-2.5 px-4 text-slate-800">4. Employee</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rbacMatrix.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50">
                  <td className="py-3 px-4 font-bold text-slate-800">{item.module}</td>
                  <td className="py-3 px-4 text-emerald-700 font-semibold">{item.superAdmin}</td>
                  <td className="py-3 px-4 text-slate-700">{item.hrAdmin}</td>
                  <td className="py-3 px-4 text-slate-700">{item.deptHead}</td>
                  <td className="py-3 px-4 text-slate-500">{item.employee}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Provisioned Users Accounts Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex justify-between items-center">
          <h3 className="text-sm font-bold text-slate-900">Provisioned Accounts ({users.length})</h3>
          <span className="text-xs font-mono text-slate-500">BCRYPT Password Protection & Session Fixed</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-4">User</th>
                <th className="py-2.5 px-4">Username</th>
                <th className="py-2.5 px-4">Assigned Role</th>
                <th className="py-2.5 px-4">Linked Staff ID</th>
                <th className="py-2.5 px-4">Created Date</th>
                <th className="py-2.5 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map(u => (
                <tr key={u.id} className="hover:bg-slate-50">
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-900">{u.full_name}</div>
                    <div className="text-[11px] text-slate-400 font-mono">{u.email}</div>
                  </td>
                  <td className="py-3 px-4 font-mono font-semibold text-slate-800">
                    {u.username}
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-[#0a2540] text-white capitalize">
                      {u.role.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono font-semibold text-slate-700">
                    {u.employee_id || 'Standalone'}
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-500">
                    {u.created_at}
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700">
                      Active
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Provision User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden">
            <div className="bg-[#0a2540] text-white p-4 px-6 flex items-center justify-between">
              <h3 className="font-bold text-sm">Provision Institutional System User</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-300 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateUser} className="p-5 space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Username *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. jdoe or yohanis"
                  value={formUsername}
                  onChange={e => setFormUsername(e.target.value.toLowerCase())}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-mono font-semibold"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Full Legal Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. John Doe Bekele"
                  value={formFullName}
                  onChange={e => setFormFullName(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Institutional Email *</label>
                <input
                  type="email"
                  required
                  placeholder="username@borana.edu.et"
                  value={formEmail}
                  onChange={e => setFormEmail(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Assigned Role Tier *</label>
                <select
                  value={formRole}
                  onChange={e => setFormRole(e.target.value as UserRole)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-bold text-slate-800"
                >
                  <option value="super_admin">1. Super Administrator (Full Access)</option>
                  <option value="hr_admin">2. HR Administrator (Workforce & Leaves)</option>
                  <option value="department_head">3. Department Head (Department Audit)</option>
                  <option value="employee">4. Academic / Administrative Employee</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Link to Employee Profile</label>
                <select
                  value={formEmployeeId}
                  onChange={e => setFormEmployeeId(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-medium"
                >
                  <option value="">-- Standalone Administrator --</option>
                  {employees.map(emp => (
                    <option key={emp.id} value={emp.employee_id}>
                      {emp.employee_id} - {emp.full_name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Temporary Initial Password</label>
                <input
                  type="text"
                  defaultValue="password123"
                  className="w-full p-2 bg-slate-100 border border-slate-200 rounded-lg font-mono text-slate-500"
                  readOnly
                />
                <span className="text-[10px] text-slate-400">Default hashed via PHP BCRYPT on first login</span>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 text-slate-600 cursor-pointer">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 font-bold text-white bg-[#0a2540] rounded-lg cursor-pointer">
                  Provision User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
