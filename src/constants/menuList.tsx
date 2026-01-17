import {
  BookOpen,
  FileText,
  LayoutDashboard,
  Mail,
  PlaySquare
} from "lucide-react";

export const menuList = [
  {
    label: "Dashboard",
    icon: <LayoutDashboard />,
    path: "/dashboard",
  },

  {
    label: "Courses",
    icon: <PlaySquare />,
    path: "/dashboard/courses",
  },

  {
    label: "Blogs",
    icon: <BookOpen />,
    path: "/dashboard/blogs",
  },

  {
    label: "Reports",
    icon: <FileText />,
    path: "/dashboard/reports",
  },

  {
    label: "Contact Us",
    icon: <Mail />,
    path: "/dashboard/contact-us",
  },
];

