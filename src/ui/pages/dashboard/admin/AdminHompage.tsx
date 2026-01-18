import { useDashboard } from "@/hooks/useContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/atoms/card";
import { Skeleton } from "@/ui/atoms/skeleton";
import {
  Activity,
  BookText,
  CheckCircle,
  Clock,
  Eye,
  FileText,
  Users,
} from "lucide-react";
import { useEffect } from "react";

const AdminHomepage = () => {
  const { setTitle } = useDashboard();

  useEffect(() => {
    setTitle("Admin Dashboard");
  }, []);


  const isLoading = false

  // @ts-ignore
  const analytics = ({} as any) || {};

  const stats = [
    {
      title: "Total Users",
      value: analytics.totalUsers || 0,
      description: "Registered learners",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Total Courses",
      value: analytics.totalCourses || 0,
      description: "Learning paths available",
      icon: BookText,
      color: "text-indigo-600",
      bgColor: "bg-indigo-100",
    },
    {
      title: "Total Blogs",
      value: analytics.totalBlogs || 0,
      description: "Articles published",
      icon: FileText,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      title: "Total Lessons",
      value: analytics.totalLessons || 0,
      description: "Course lessons created",
      icon: Activity,
      color: "text-cyan-600",
      bgColor: "bg-cyan-100",
    },
  ];

  const contentStats = [
    {
      label: "Published Content",
      value: analytics.publishedContent || 0,
      icon: CheckCircle,
      color: "text-green-600",
      description: "Live courses & blogs",
    },
    {
      label: "Draft Content",
      value: analytics.draftContent || 0,
      icon: Clock,
      color: "text-yellow-600",
      description: "In progress",
    },
    {
      label: "Total Views",
      value: analytics.totalViews || 0,
      icon: Eye,
      color: "text-blue-600",
      description: "Content impressions",
    },
  ];

  return (
    <div className="space-y-8">
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card
            key={index}
            className="overflow-hidden border border-border shadow-sm hover:shadow-md transition-shadow"
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <div className={`${stat.bgColor} p-2 rounded-lg`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-20" />
              ) : (
                <div className="text-2xl font-bold">{stat.value}</div>
              )}
              <p className="text-xs text-muted-foreground mt-1">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
        {contentStats.map((stat, index) => (
          <Card key={index} className="border border-border shadow-sm">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className={`${stat.color} p-3 rounded-full bg-gray-50`}>
                  <stat.icon className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.label}
                  </p>
                  {isLoading ? (
                    <Skeleton className="h-7 w-12 mt-1" />
                  ) : (
                    <h3 className="text-2xl font-bold">{stat.value}</h3>
                  )}
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {stat.description}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminHomepage;
