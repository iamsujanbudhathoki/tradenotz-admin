import {
  FileText,
  LayoutDashboard,
  Mail
} from "lucide-react";

export const menuList = [
  {
    label: "Dashboard",
    icon: <LayoutDashboard />,
    path: "/dashboard",
  },

  {
    label: "Reports",
    icon: <FileText />,
    path: "/dashboard/reports",
  },

 
  {
    label: "Blogs",
    icon: <FileText />,
    path: "/dashboard/blogs",
  },
  {
    label: "Contact Us",
    icon: <Mail />,
    path: "/dashboard/contact-us",
  },
];
