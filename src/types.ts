export type UserRole = 'super_admin' | 'hr_admin' | 'department_head' | 'employee';

export type StaffCategory = 'academic' | 'administrative';

export type EmploymentStatus = 'active' | 'on_leave' | 'suspended' | 'retired' | 'terminated';

export type AttendanceStatus = 'present' | 'late' | 'absent' | 'half_day';

export type LeaveStatus = 'pending' | 'approved' | 'rejected';

export type LeaveType = 'annual' | 'sick' | 'maternity' | 'emergency' | 'study' | 'unpaid';

export interface User {
  id: number;
  username: string;
  email: string;
  role: UserRole;
  employee_id: string;
  full_name: string;
  avatar_url?: string;
  created_at: string;
  department_id?: number;
}

export interface College {
  id: number;
  code: string;
  name: string;
  dean_name: string;
  description: string;
  established_year: number;
  total_departments?: number;
  total_staff?: number;
}

export interface Department {
  id: number;
  college_id: number;
  college_name?: string;
  code: string;
  name: string;
  head_name: string;
  office_location: string;
  email: string;
  phone: string;
  total_staff?: number;
}

export interface Employee {
  id: number;
  employee_id: string; // e.g. BU-EMP-001
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
  
  // Employment
  staff_category: StaffCategory;
  college_id: number;
  college_name?: string;
  department_id: number;
  department_name?: string;
  position: string;
  academic_rank?: string; // Professor, Associate Prof, Assistant Prof, Lecturer, Graduate Assistant
  qualification: string; // PhD, MSc, MA, BSc, BA, Diploma
  specialization: string;
  employment_type: 'Full-Time' | 'Contract' | 'Part-Time';
  hire_date: string;
  salary: number;
  status: EmploymentStatus;
  photo_url: string;
}

export interface AttendanceRecord {
  id: number;
  employee_id: string;
  employee_name: string;
  department_name: string;
  date: string; // YYYY-MM-DD
  check_in: string | null; // HH:mm:ss
  check_out: string | null; // HH:mm:ss
  status: AttendanceStatus;
  remarks: string;
}

export interface LeaveRequest {
  id: number;
  employee_id: string;
  employee_name: string;
  department_name: string;
  leave_type: LeaveType;
  start_date: string;
  end_date: string;
  days_requested: number;
  reason: string;
  status: LeaveStatus;
  applied_at: string;
  reviewed_by?: string;
  review_remarks?: string;
  reviewed_at?: string;
}

export interface ActivityLog {
  id: number;
  user_name: string;
  user_role: string;
  action: string;
  details: string;
  ip_address: string;
  created_at: string;
}
