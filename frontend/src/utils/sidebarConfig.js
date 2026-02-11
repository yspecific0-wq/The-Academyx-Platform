import { ROLES } from "./roles";

export const sidebarItems = {
  [ROLES.ADMIN]: [
    { label: "Dashboard", path: "/admin" },
    { label: "Teachers", path: "/admin/teachers" },
    { label: "Students", path: "/admin/students" },
    { label: "Classes", path: "/admin/classes" },
    { label: "Notifications", path: "/admin/notifications" },
    { label: "Reports", path: "/admin/reports" },
    { label: "Students", path: "/admin/students" },
    { label: "Parent", path: "/admin/parents" },
   

  ],

  [ROLES.TEACHER]: [
    { label: "Dashboard", path: "/teacher" },
    { label: "My Classes", path: "/teacher/classes" },
    { label: "Attendance", path: "/teacher/attendance" },
  ],
};
