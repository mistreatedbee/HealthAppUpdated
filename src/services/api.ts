import { User, Patient, Doctor, Appointment, Prescription, DoctorStatus, AppointmentStatus } from '../types';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

async function request(endpoint: string, method = "GET", body?: any) {
  const options: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  };

  if (body) options.body = JSON.stringify(body);

  const res = await fetch(`${API_URL}${endpoint}`, options);

  if (!res.ok) {
    const error = await res.text();
    throw new Error(error || `Request failed: ${res.status}`);
  }

  return await res.json();
}

/* ---------------------- AUTH API ---------------------- */
export const authAPI = {
  login: (email: string, password: string): Promise<{ success: boolean; user?: User }> =>
    request(`/auth/login`, "POST", { email, password }),

  register: (data: Partial<Patient>): Promise<{ success: boolean; user?: User }> =>
    request(`/auth/register`, "POST", data),

  registerDoctor: (data: Partial<Doctor>): Promise<{ success: boolean; user?: User }> =>
    request(`/auth/register-doctor`, "POST", data),

  getCurrentUser: async (): Promise<{ success: boolean; user?: User } | null> => {
    const stored = localStorage.getItem("health_app_current_user");
    if (!stored) return null;

    const user = JSON.parse(stored) as User;
    return request(`/auth/me/${user._id}`, "GET");
  },

  logout: (): void => {
    localStorage.removeItem("health_app_current_user");
  },
};

/* ---------------------- PATIENT API ---------------------- */
export const patientAPI = {
  getById: (id: string): Promise<Patient> =>
    request(`/patients/${id}`, "GET"),

  getByDoctor: (doctorId: string): Promise<Patient[]> =>
    request(`/patients/doctor/${doctorId}`, "GET"),

  updateProfile: (id: string, updates: Partial<Patient>): Promise<Patient> =>
    request(`/patients/${id}`, "PUT", updates),

  deleteAccount: (id: string): Promise<void> =>
    request(`/patients/${id}`, "DELETE"),
};

/* ---------------------- DOCTOR API ---------------------- */
export const doctorAPI = {
  getAll: (): Promise<Doctor[]> =>
    request(`/doctors`, "GET"),

  getApproved: (): Promise<Doctor[]> =>
    request(`/doctors/approved`, "GET"),

  getById: (id: string): Promise<Doctor> =>
    request(`/doctors/${id}`, "GET"),

  updateStatus: (id: string, status: DoctorStatus): Promise<Doctor> =>
    request(`/doctors/${id}/status`, "PUT", { status }),
};

/* ---------------------- APPOINTMENT API ---------------------- */
export const appointmentAPI = {
  create: (data: Omit<Appointment, "_id" | "createdAt" | "updatedAt">): Promise<Appointment> =>
    request(`/appointments`, "POST", data).then((res) => res.appointment),

  getByPatient: (patientId: string): Promise<Appointment[]> =>
    request(`/appointments/patient/${patientId}`, "GET"),

  getByDoctor: (doctorId: string): Promise<Appointment[]> =>
    request(`/appointments/doctor/${doctorId}`, "GET"),

  getAll: (): Promise<Appointment[]> =>
    request(`/appointments`, "GET"),

  getById: (id: string): Promise<Appointment> =>
    request(`/appointments/${id}`, "GET"),

  update: (id: string, updates: Partial<Appointment>): Promise<Appointment> =>
    request(`/appointments/${id}`, "PUT", updates),

  updateStatus: (id: string, status: AppointmentStatus): Promise<Appointment> =>
    request(`/appointments/${id}/status`, "PUT", { status }),

  generateVideoLink: (id: string): Promise<string> =>
    request(`/appointments/${id}/video-link`, "POST").then((res) => res.link),

  cancel: (id: string): Promise<Appointment> =>
    request(`/appointments/${id}/cancel`, "PUT"),
};

/* ---------------------- PRESCRIPTION API ---------------------- */
export const prescriptionAPI = {
  create: (data: Omit<Prescription, "_id" | "issuedAt">): Promise<Prescription> =>
    request(`/prescriptions`, "POST", data).then((res) => res.prescription),

  getByPatient: (patientId: string): Promise<Prescription[]> =>
    request(`/prescriptions/patient/${patientId}`, "GET"),

  // ✅ This will return the FULL populated prescription (after we update backend)
  getByAppointment: (appointmentId: string): Promise<Prescription> =>
    request(`/prescriptions/appointment/${appointmentId}`, "GET"),
};

/* ---------------------- ADMIN API ---------------------- */
export const adminAPI = {
  getAllPatients: (): Promise<Patient[]> =>
    request(`/admin/patients`, "GET"),

  deleteUser: (userId: string): Promise<void> =>
    request(`/admin/users/${userId}`, "DELETE"),

  getStats: () =>
    request(`/admin/stats`, "GET"),
};

/* ---------------------- NOTIFICATIONS API ---------------------- */
export const notificationAPI = {
  getForUser: (userId: string) =>
    request(`/notifications/${userId}`, "GET").then(res => res.notifications ?? []),

  markRead: (id: string) =>
    request(`/notifications/${id}/read`, "PUT"),
};
