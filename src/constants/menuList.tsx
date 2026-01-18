import {
  BookOpen,
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
    label: "Contact Us",
    icon: <Mail />,
    path: "/dashboard/contact-us",
  },
];

