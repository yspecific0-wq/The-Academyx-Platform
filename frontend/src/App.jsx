import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminLayout from "./layouts/AdminLayout";
import Home from "./pages/Home";

// Admin Pages
import AdminDashboard from "./pages/AdminDashboard";
import AdminTeachers from "./pages/admin/AdminTeachers";
import AdminStudents from "./pages/admin/AdminStudents";
import AdminParents from "./pages/admin/AdminParents";
import AdminClasses from "./pages/admin/AdminClasses";
import TeacherAttendance from "./pages/admin/TeacherAttendance";
import Profile from "./pages/Profile";

// Teacher Pages
import TeacherDashboard from "./pages/TeacherDashboard";
import MarkAttendance from "./pages/teacher/MarkAttendance";
import AttendanceReport from "./pages/teacher/AttendanceReport"; // Added to fix ReferenceErrorimport AttendanceReport from "./pages/teacher/AttendanceReport"; // Fixes image_44e7c0.png

// Student Pages
import StudentDashboard from "./pages/StudentDashboard";
import StudentAttendance from "./pages/student/StudentAttendance";
import StudentClasses from "./pages/student/StudentClasses";
import StudentTeachers from "./pages/student/StudentTeachers";

// Parent Pages
import ParentDashboard from "./pages/ParentDashboard"; 
import ChildReport from "./pages/parent/ChildReport";

// General Pages
import ForgotPassword from "./pages/ForgotPassword";
import Unauthorized from "./pages/Unauthorized";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        {/* Corrected path from "/" to "/login" to allow navigation */}
        <Route path="/login" element={<Login />} /> 
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* --- ADMIN ROUTES --- */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["ADMIN", "SCHOOL_ADMIN"]}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="teachers" element={<AdminTeachers />} />
          <Route path="students" element={<AdminStudents />} />
          <Route path="parents" element={<AdminParents />} />
          <Route path="classes" element={<AdminClasses />} />
          <Route path="teacher-attendance" element={<TeacherAttendance />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        {/* --- TEACHER ROUTES --- */}
        <Route
          path="/teacher"
          element={
            <ProtectedRoute allowedRoles={["TEACHER"]}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<TeacherDashboard />} />
          <Route path="attendance" element={<MarkAttendance />} />
          <Route path="reports" element={<AttendanceReport />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        {/* --- STUDENT ROUTES --- */}
        <Route
          path="/student"
          element={
            <ProtectedRoute allowedRoles={["STUDENT"]}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<StudentDashboard />} />
          <Route path="attendance" element={<StudentAttendance />} />
          <Route path="classes" element={<StudentClasses />} />
          <Route path="teachers" element={<StudentTeachers />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        {/* --- PARENT ROUTES --- */}
        <Route
          path="/parent"
          element={
            <ProtectedRoute allowedRoles={["PARENT"]}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
        <Route index element={<ParentDashboard />} />
  
        {/* Add this line: It allows the sidebar link to work by showing the dashboard list */}
          <Route path="reports" element={<ParentDashboard />} /> 
          {/* This remains for the specific child detail */}
          <Route path="reports/:studentId" element={<ChildReport />} />
  
          <Route path="profile" element={<Profile />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;