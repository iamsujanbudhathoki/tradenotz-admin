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
    <div className="space-y-8 p-1">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-8 md:p-12 mb-8">
        <div className="relative z-10">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-4">
            Welcome back to <span className="text-primary bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">TradeNotz</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Here's an overview of your platform's performance and recent activities.
          </p>
        </div>
        <div className="absolute top-0 right-0 -mt-16 -mr-16 h-64 w-64 rounded-full bg-primary/10 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-0 -mb-16 -ml-16 h-64 w-64 rounded-full bg-accent/10 blur-3xl animate-pulse delay-700"></div>
      </div>

      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card
            key={index}
            className="group overflow-hidden border-border/50 shadow-sm hover:shadow-card-hover transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 bg-card/50 backdrop-blur-sm"
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                {stat.title}
              </CardTitle>
              <div className={`p-2.5 rounded-xl ${stat.bgColor.replace('100', '50')} ${stat.color} ring-1 ring-inset ring-black/5 group-hover:scale-110 transition-transform duration-300`}>
                <stat.icon className="h-5 w-5" />
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-9 w-24 mb-2" />
              ) : (
                <div className="text-3xl font-bold tracking-tight text-foreground">{stat.value}</div>
              )}
              <p className="text-sm text-muted-foreground/80 mt-2 flex items-center gap-1">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <h2 className="text-2xl font-bold tracking-tight text-foreground mt-8 mb-4 px-1">Content Overview</h2>
      <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
        {contentStats.map((stat, index) => (
          <Card key={index} className="group border-border/50 shadow-sm hover:shadow-card-hover transition-all duration-300 bg-card/50 backdrop-blur-sm">
            <CardContent className="pt-6">
              <div className="flex items-start gap-5">
                <div className={`p-3.5 rounded-2xl ${stat.color.replace('text-', 'bg-').replace('600', '50')} ${stat.color} ring-1 ring-inset ring-black/5 group-hover:rotate-6 transition-transform duration-300`}>
                  <stat.icon className="h-7 w-7" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors">
                    {stat.label}
                  </p>
                  {isLoading ? (
                    <Skeleton className="h-8 w-16" />
                  ) : (
                    <h3 className="text-3xl font-bold tracking-tight">{stat.value}</h3>
                  )}
                  <p className="text-sm text-muted-foreground/70">
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
