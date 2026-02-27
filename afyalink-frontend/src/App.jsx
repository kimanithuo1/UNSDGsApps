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
import SearchPatient from './pages/practitioner/SearchPatient.jsx'
import AddAssessment from './pages/practitioner/Assessment.jsx'
import LogDiagnosis from './pages/practitioner/Diagnosis.jsx'
import AddMedication from './pages/practitioner/Medication.jsx'
import ScheduleReview from './pages/practitioner/Review.jsx'
import ViewPatientHistory from './pages/practitioner/PatientHistory.jsx'
import Monitoring from './pages/practitioner/Monitoring.jsx'
import AdminDashboard from './pages/admin/Dashboard.jsx'
import ManageFacilities from './pages/admin/Facilities.jsx'
import ManageUsers from './pages/admin/Users.jsx'
import SystemLogs from './pages/admin/Logs.jsx'
import Analytics from './pages/admin/Analytics.jsx'
 

export default function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <div className="min-h-screen bg-gradient-to-b from-teal-50/50 to-white">
            <header className="sticky top-0 z-30 bg-white/80 backdrop-blur border-b">
              <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
                <Link to="/" className="text-xl font-semibold text-primary">AFYALINK</Link>
                <nav className="flex items-center gap-2">
                  <Link to="/about" className="px-3 py-2 text-sm rounded-lg hover:bg-gray-100">About</Link>
                  <Link to="/contact" className="px-3 py-2 text-sm rounded-lg hover:bg-gray-100">Contact</Link>
                  <Link to="/login" className="px-3 py-2 text-sm rounded-lg text-primary hover:bg-teal-50">Login</Link>
                  <Link to="/register" className="px-3 py-2 text-sm rounded-lg bg-primary text-white hover:bg-primary/90 shadow-sm">Register</Link>
                </nav>
              </div>
            </header>
            <Landing />
          </div>
        }
      />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

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
        <Route path="/admin/logs" element={<SystemLogs />} />
        <Route path="/admin/analytics" element={<Analytics />} />
      </Route>
    </Routes>
  )
}
