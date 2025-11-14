import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Toaster, toast } from "react-hot-toast";

import { Capacitor } from "@capacitor/core";
import { PushNotifications } from '@capacitor/push-notifications';
import { FCM } from '@capacitor-community/fcm';


import { getToken } from "firebase/messaging";
import { getMessagingInstance } from "./firebase"; // Updated import

const API_URL = import.meta.env.VITE_API_URL || "http://10.0.2.2:5000";

/* ---------- AUTH PAGES ---------- */
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { DoctorRegister } from './pages/doctor/DoctorRegister';

/* ---------- PATIENT PAGES ---------- */
import { PatientLayout } from './components/layout/PatientLayout';
import { PatientDashboard } from './pages/patient/PatientDashboard';
import { PatientProfile } from './pages/patient/PatientProfile';
import { DoctorList } from './pages/patient/DoctorList';
import { BookAppointment } from './pages/patient/BookAppointment';
import { PatientAppointments } from './pages/patient/PatientAppointments';
import { PatientPrescriptions } from './pages/patient/PatientPrescriptions';

/* ---------- DOCTOR PAGES ---------- */
import { DoctorLayout } from './components/layout/DoctorLayout';
import { DoctorDashboard } from './pages/doctor/DoctorDashboard';
import { AppointmentDetail } from './pages/doctor/AppointmentDetail';
import { IssuePrescription } from './pages/doctor/IssuePrescription';
import { Patients } from "./pages/doctor/Patients";
import { Availability } from "./pages/doctor/Availability";
import  Notes  from "./pages/doctor/Notes";
import { Telehealth } from "./pages/doctor/Telehealth";



/* ---------- ADMIN PAGES ---------- */
import { AdminLayout } from './components/layout/AdminLayout';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { ManagePatients } from './pages/admin/ManagePatients';
import { ManageDoctors } from './pages/admin/ManageDoctors';
import { ManageAppointments } from './pages/admin/ManageAppointments';

/* ----------- PROTECTED ROUTE ----------- */
function ProtectedRoute({ children, allowedRole }: { children: React.ReactNode; allowedRole: string }) {
  const { user, isLoading } = useAuth();

  if (isLoading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (user.role !== allowedRole) return <Navigate to="/login" />;

  return <>{children}</>;
}

/* ----------- APP ROUTES ----------- */
function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to={`/${user.role}/dashboard`} /> : <Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/doctor/register" element={<DoctorRegister />} />

      {/* Patient */}
      <Route path="/patient/*" element={
        <ProtectedRoute allowedRole="patient">
          <PatientLayout>
            <Routes>
              <Route path="dashboard" element={<PatientDashboard />} />
              <Route path="profile" element={<PatientProfile />} />
              <Route path="doctors" element={<DoctorList />} />
              <Route path="book-appointment" element={<BookAppointment />} />
              <Route path="appointments" element={<PatientAppointments />} />
              <Route path="prescriptions" element={<PatientPrescriptions />} />
            </Routes>
          </PatientLayout>
        </ProtectedRoute>
      } />

      {/* Doctor */}
      <Route path="/doctor/*" element={
        <ProtectedRoute allowedRole="doctor">
          <DoctorLayout>
            <Routes>
              <Route path="dashboard" element={<DoctorDashboard />} />
              <Route path="appointments" element={<DoctorDashboard />} />
              <Route path="appointments/:id" element={<AppointmentDetail />} />
              <Route path="appointments/:id/prescription" element={<IssuePrescription />} />
              <Route path="patients" element={<Patients />} />
              <Route path="availability" element={<Availability />} />
              <Route path="notes" element={<Notes />} />
              <Route path="telehealth" element={<Telehealth />} />
              <Route path="/doctor/patients/:id" element={<PatientProfile />} />

            </Routes>
          </DoctorLayout>
        </ProtectedRoute>
      } />

      {/* Admin */}
      <Route path="/admin/*" element={
        <ProtectedRoute allowedRole="admin">
          <AdminLayout>
            <Routes>
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="patients" element={<ManagePatients />} />
              <Route path="doctors" element={<ManageDoctors />} />
              <Route path="appointments" element={<ManageAppointments />} />
            </Routes>
          </AdminLayout>
        </ProtectedRoute>
      } />

      <Route path="/" element={<Navigate to="/login" />} />
    </Routes>
  );
}

/* ----------- PUSH NOTIFICATIONS HANDLER ----------- */
function PushHandler() {
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const isMobile = Capacitor.getPlatform() !== "web";

    /* ✅ WEB PUSH */
if (!isMobile) {
  Notification.requestPermission().then(async (permission) => {
    if (permission !== "granted") return;

    const messaging = await getMessagingInstance(); // Updated: Call the function
    if (!messaging) return;

    const token = await getToken(messaging, {
      vapidKey: "BOtgES5rWVy7kqGg1rWFK91iPuW9tRBQ5GTcI_9qgKSLbFJq7YcnnLX_7yzDQye_JYW8KjW9HftwGF2xEfACgpI",
    });

    await fetch(`${API_URL}/push/save-token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user._id, token }),
    });
  });

      
    }

    /* ✅ ANDROID / iOS PUSH */
    async function setup() {
      await PushNotifications.requestPermissions();
      await PushNotifications.register();

      PushNotifications.addListener("registration", async (token) => {
        await fetch(`${API_URL}/push/save-token`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user?._id, token: token.value }),
        });

        try {
          await FCM.subscribeTo({ topic: "general" });
        } catch (err) {
  console.log("Push topic subscription skipped:", err);
}
      });

      PushNotifications.addListener("pushNotificationReceived", (notification) => {
        toast(`${notification.title}: ${notification.body}`);
      });
    }

    setup();
  }, [user]);

  return null;
}

/* ----------- MAIN APP ----------- */
export function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" />
        <PushHandler />
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}