import { Routes, Route, Link } from 'react-router-dom'
import DashboardLayout from './layouts/DashboardLayout.jsx'
import Landing from './pages/public/Landing.jsx'
import About from './pages/public/About.jsx'
import Contact from './pages/public/Contact.jsx'
import Login from './pages/auth/Login.jsx'
import Register from './pages/auth/Register.jsx'
import PatientDashboard from './pages/patient/Dashboard.jsx'
import MedicalHistory from './pages/patient/History.jsx'
import Prescriptions from './pages/patient/Prescriptions.jsx'
import Appointments from './pages/patient/Appointments.jsx'
import Reminders from './pages/patient/Reminders.jsx'
import PractitionerDashboard from './pages/practitioner/Dashboard.jsx'
import { SearchPatient } from './pages/practitioner/SearchPatient.jsx'
import { AddAssessment } from './pages/practitioner/Assessment.jsx'
import { LogDiagnosis } from './pages/practitioner/Diagnosis.jsx'
import { AddMedication } from './pages/practitioner/Medication.jsx'
import { ScheduleReview } from './pages/practitioner/Review.jsx'
import { ViewPatientHistory } from './pages/practitioner/PatientHistory.jsx'
import { Monitoring } from './pages/practitioner/Monitoring.jsx'
import AdminDashboard from './pages/admin/Dashboard.jsx'
import ManageFacilities from './pages/admin/Facilities.jsx'
import ManageUsers from './pages/admin/Users.jsx'
import SystemLogs from './pages/admin/Logs.jsx'
import Analytics from './pages/admin/Analytics.jsx'
import MainLayout from './layouts/MainLayout.jsx'
import BroadcastReminders from './pages/admin/BroadcastReminders.jsx'

export default function App() {
  return (
    <>
      <Link
        to="/"
        aria-label="Home"
        className="fixed bottom-4 left-4 z-50 rounded-full bg-[#0f766e] text-white px-3 py-2 shadow-md hover:bg-[#14b8a6]"
      >
        Home
      </Link>
      <Routes>
        <Route
          path="/"
          element={
            <MainLayout>
              <Landing />
            </MainLayout>
          }
        />
        <Route path="/about" element={<MainLayout><About /></MainLayout>} />
        <Route path="/contact" element={<MainLayout><Contact /></MainLayout>} />
        <Route path="/login" element={<MainLayout><Login /></MainLayout>} />
        <Route path="/register" element={<MainLayout><Register /></MainLayout>} />

        <Route element={<DashboardLayout />}>
          <Route path="/patient" element={<PatientDashboard />} />
          <Route path="/patient/history" element={<MedicalHistory />} />
          <Route path="/patient/prescriptions" element={<Prescriptions />} />
          <Route path="/patient/appointments" element={<Appointments />} />
          <Route path="/patient/reminders" element={<Reminders />} />

          <Route path="/practitioner" element={<PractitionerDashboard />} />
          <Route path="/practitioner/search" element={<SearchPatient />} />
          <Route path="/practitioner/assessment" element={<AddAssessment />} />
          <Route path="/practitioner/diagnosis" element={<LogDiagnosis />} />
          <Route path="/practitioner/medication" element={<AddMedication />} />
          <Route path="/practitioner/review" element={<ScheduleReview />} />
          <Route path="/practitioner/history" element={<ViewPatientHistory />} />
          <Route path="/practitioner/monitoring" element={<Monitoring />} />

          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/facilities" element={<ManageFacilities />} />
          <Route path="/admin/users" element={<ManageUsers />} />
          <Route path="/admin/reminders" element={<BroadcastReminders />} />
          <Route path="/admin/logs" element={<SystemLogs />} />
          <Route path="/admin/analytics" element={<Analytics />} />
        </Route>
      </Routes>
    </>
  )
}
