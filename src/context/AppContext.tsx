import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  User, College, Department, Employee, AttendanceRecord, LeaveRequest, ActivityLog, UserRole 
} from '../types';
import { 
  INITIAL_USERS, INITIAL_COLLEGES, INITIAL_DEPARTMENTS, INITIAL_EMPLOYEES, 
  INITIAL_ATTENDANCE, INITIAL_LEAVES, INITIAL_ACTIVITY_LOGS 
} from '../data/initialData';

interface AppContextType {
  currentUser: User;
  switchUser: (role: UserRole) => void;
  users: User[];
  addUser: (user: Omit<User, 'id' | 'created_at'>) => void;
  
  colleges: College[];
  addCollege: (college: Omit<College, 'id'>) => void;
  deleteCollege: (id: number) => boolean;
  
  departments: Department[];
  addDepartment: (dept: Omit<Department, 'id'>) => void;
  deleteDepartment: (id: number) => boolean;
  
  employees: Employee[];
  addEmployee: (emp: Omit<Employee, 'id'>) => void;
  updateEmployee: (id: number, emp: Partial<Employee>) => void;
  deleteEmployee: (id: number) => void;
  
  attendance: AttendanceRecord[];
  recordAttendance: (record: Omit<AttendanceRecord, 'id'>) => void;
  punchAttendance: (employeeId: string, type: 'in' | 'out') => void;
  
  leaves: LeaveRequest[];
  applyLeave: (leave: Omit<LeaveRequest, 'id' | 'applied_at' | 'status'>) => void;
  reviewLeave: (id: number, status: 'approved' | 'rejected', remarks?: string) => void;
  
  activityLogs: ActivityLog[];
  logActivity: (action: string, details: string) => void;
  
  resetToDefaults: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load from LocalStorage or initialize with defaults
  const [currentUser, setCurrentUser] = useState<User>(() => {
    const saved = localStorage.getItem('bu_current_user');
    return saved ? JSON.parse(saved) : INITIAL_USERS[0];
  });

  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('bu_users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [colleges, setColleges] = useState<College[]>(() => {
    const saved = localStorage.getItem('bu_colleges');
    return saved ? JSON.parse(saved) : INITIAL_COLLEGES;
  });

  const [departments, setDepartments] = useState<Department[]>(() => {
    const saved = localStorage.getItem('bu_departments');
    return saved ? JSON.parse(saved) : INITIAL_DEPARTMENTS;
  });

  const [employees, setEmployees] = useState<Employee[]>(() => {
    const saved = localStorage.getItem('bu_employees');
    return saved ? JSON.parse(saved) : INITIAL_EMPLOYEES;
  });

  const [attendance, setAttendance] = useState<AttendanceRecord[]>(() => {
    const saved = localStorage.getItem('bu_attendance');
    return saved ? JSON.parse(saved) : INITIAL_ATTENDANCE;
  });

  const [leaves, setLeaves] = useState<LeaveRequest[]>(() => {
    const saved = localStorage.getItem('bu_leaves');
    return saved ? JSON.parse(saved) : INITIAL_LEAVES;
  });

  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(() => {
    const saved = localStorage.getItem('bu_activity_logs');
    return saved ? JSON.parse(saved) : INITIAL_ACTIVITY_LOGS;
  });

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem('bu_current_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('bu_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('bu_colleges', JSON.stringify(colleges));
  }, [colleges]);

  useEffect(() => {
    localStorage.setItem('bu_departments', JSON.stringify(departments));
  }, [departments]);

  useEffect(() => {
    localStorage.setItem('bu_employees', JSON.stringify(employees));
  }, [employees]);

  useEffect(() => {
    localStorage.setItem('bu_attendance', JSON.stringify(attendance));
  }, [attendance]);

  useEffect(() => {
    localStorage.setItem('bu_leaves', JSON.stringify(leaves));
  }, [leaves]);

  useEffect(() => {
    localStorage.setItem('bu_activity_logs', JSON.stringify(activityLogs));
  }, [activityLogs]);

  // Log Activity Helper
  const logActivity = (action: string, details: string) => {
    const newLog: ActivityLog = {
      id: Date.now(),
      user_name: currentUser.full_name,
      user_role: currentUser.role.replace('_', ' ').toUpperCase(),
      action,
      details,
      ip_address: '192.168.1.' + Math.floor(Math.random() * 80 + 10),
      created_at: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };
    setActivityLogs(prev => [newLog, ...prev]);
  };

  // Switch Active User / Role
  const switchUser = (role: UserRole) => {
    const match = users.find(u => u.role === role) || users[0];
    setCurrentUser(match);
    logActivity('Role Switched', `Switched active session to ${match.full_name} (${role})`);
  };

  // Add User
  const addUser = (userData: Omit<User, 'id' | 'created_at'>) => {
    const newUser: User = {
      ...userData,
      id: users.length + 1,
      created_at: new Date().toISOString().split('T')[0]
    };
    setUsers(prev => [...prev, newUser]);
    logActivity('User Created', `Provisioned new account for ${newUser.username} (${newUser.role})`);
  };

  // Add College
  const addCollege = (collegeData: Omit<College, 'id'>) => {
    const newCollege: College = {
      ...collegeData,
      id: colleges.length + 1
    };
    setColleges(prev => [...prev, newCollege]);
    logActivity('College Created', `Created college ${newCollege.code} - ${newCollege.name}`);
  };

  // Delete College
  const deleteCollege = (id: number): boolean => {
    const isAssigned = departments.some(d => d.college_id === id) || employees.some(e => e.college_id === id);
    if (isAssigned) {
      return false;
    }
    const target = colleges.find(c => c.id === id);
    setColleges(prev => prev.filter(c => c.id !== id));
    logActivity('College Deleted', `Removed college ${target?.name}`);
    return true;
  };

  // Add Department
  const addDepartment = (deptData: Omit<Department, 'id'>) => {
    const newDept: Department = {
      ...deptData,
      id: departments.length + 1
    };
    setDepartments(prev => [...prev, newDept]);
    logActivity('Department Created', `Created department ${newDept.code} - ${newDept.name}`);
  };

  // Delete Department
  const deleteDepartment = (id: number): boolean => {
    const isAssigned = employees.some(e => e.department_id === id);
    if (isAssigned) {
      return false;
    }
    const target = departments.find(d => d.id === id);
    setDepartments(prev => prev.filter(d => d.id !== id));
    logActivity('Department Deleted', `Removed department ${target?.name}`);
    return true;
  };

  // Add Employee
  const addEmployee = (empData: Omit<Employee, 'id'>) => {
    const newId = employees.length + 1;
    const newEmp: Employee = {
      ...empData,
      id: newId
    };
    setEmployees(prev => [newEmp, ...prev]);
    logActivity('Employee Registered', `Enrolled employee ${newEmp.employee_id} (${newEmp.full_name})`);
  };

  // Update Employee
  const updateEmployee = (id: number, empData: Partial<Employee>) => {
    setEmployees(prev => prev.map(e => (e.id === id ? { ...e, ...empData } : e)));
    logActivity('Employee Updated', `Updated profile record for ID #${id}`);
  };

  // Delete Employee
  const deleteEmployee = (id: number) => {
    const target = employees.find(e => e.id === id);
    setEmployees(prev => prev.filter(e => e.id !== id));
    logActivity('Employee Deleted', `Deleted record for ${target?.employee_id} (${target?.full_name})`);
  };

  // Record Attendance
  const recordAttendance = (recordData: Omit<AttendanceRecord, 'id'>) => {
    const existingIndex = attendance.findIndex(
      a => a.employee_id === recordData.employee_id && a.date === recordData.date
    );

    if (existingIndex >= 0) {
      setAttendance(prev => {
        const next = [...prev];
        next[existingIndex] = { ...next[existingIndex], ...recordData };
        return next;
      });
    } else {
      const newRec: AttendanceRecord = {
        ...recordData,
        id: Date.now()
      };
      setAttendance(prev => [newRec, ...prev]);
    }
    logActivity('Attendance Recorded', `Logged attendance for ${recordData.employee_id} (${recordData.status})`);
  };

  // Punch In/Out (Live self-service)
  const punchAttendance = (employeeId: string, type: 'in' | 'out') => {
    const today = new Date().toISOString().split('T')[0];
    const timeNow = new Date().toTimeString().split(' ')[0];
    const emp = employees.find(e => e.employee_id === employeeId);
    if (!emp) return;

    const dept = departments.find(d => d.id === emp.department_id)?.name || 'General';

    setAttendance(prev => {
      const existing = prev.find(a => a.employee_id === employeeId && a.date === today);
      if (existing) {
        return prev.map(a => {
          if (a.employee_id === employeeId && a.date === today) {
            return {
              ...a,
              check_out: type === 'out' ? timeNow : a.check_out,
              check_in: type === 'in' ? timeNow : a.check_in
            };
          }
          return a;
        });
      } else {
        const newRecord: AttendanceRecord = {
          id: Date.now(),
          employee_id: employeeId,
          employee_name: emp.full_name,
          department_name: dept,
          date: today,
          check_in: type === 'in' ? timeNow : null,
          check_out: type === 'out' ? timeNow : null,
          status: 'present',
          remarks: 'Web Portal Self Punch'
        };
        return [newRecord, ...prev];
      }
    });

    logActivity('Biometric Punch', `Employee ${employeeId} checked ${type.toUpperCase()} at ${timeNow}`);
  };

  // Apply Leave
  const applyLeave = (leaveData: Omit<LeaveRequest, 'id' | 'applied_at' | 'status'>) => {
    const newLeave: LeaveRequest = {
      ...leaveData,
      id: Date.now(),
      applied_at: new Date().toISOString().replace('T', ' ').substring(0, 19),
      status: 'pending'
    };
    setLeaves(prev => [newLeave, ...prev]);
    logActivity('Leave Submitted', `Applied for ${newLeave.days_requested} days ${newLeave.leave_type} leave (${newLeave.employee_id})`);
  };

  // Review Leave (Approve/Reject)
  const reviewLeave = (id: number, status: 'approved' | 'rejected', remarks?: string) => {
    const leave = leaves.find(l => l.id === id);
    setLeaves(prev => prev.map(l => {
      if (l.id === id) {
        return {
          ...l,
          status,
          reviewed_by: currentUser.full_name,
          review_remarks: remarks || (status === 'approved' ? 'Approved by authority' : 'Rejected per regulations'),
          reviewed_at: new Date().toISOString().replace('T', ' ').substring(0, 19)
        };
      }
      return l;
    }));

    // If approved, update employee status to on_leave if applicable
    if (status === 'approved' && leave) {
      setEmployees(prev => prev.map(e => e.employee_id === leave.employee_id ? { ...e, status: 'on_leave' } : e));
    }

    logActivity('Leave Reviewed', `Leave request #${id} was marked as ${status.toUpperCase()} by ${currentUser.full_name}`);
  };

  // Reset to sample state
  const resetToDefaults = () => {
    localStorage.clear();
    setCurrentUser(INITIAL_USERS[0]);
    setUsers(INITIAL_USERS);
    setColleges(INITIAL_COLLEGES);
    setDepartments(INITIAL_DEPARTMENTS);
    setEmployees(INITIAL_EMPLOYEES);
    setAttendance(INITIAL_ATTENDANCE);
    setLeaves(INITIAL_LEAVES);
    setActivityLogs(INITIAL_ACTIVITY_LOGS);
    logActivity('Database Reset', 'Reset application state to Borana University baseline defaults');
  };

  return (
    <AppContext.Provider value={{
      currentUser, switchUser, users, addUser,
      colleges, addCollege, deleteCollege,
      departments, addDepartment, deleteDepartment,
      employees, addEmployee, updateEmployee, deleteEmployee,
      attendance, recordAttendance, punchAttendance,
      leaves, applyLeave, reviewLeave,
      activityLogs, logActivity, resetToDefaults
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
