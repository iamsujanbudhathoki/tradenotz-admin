import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/atoms/card";
import { useQuery } from "@tanstack/react-query";
import { getAnalyticsOverviewOptions } from "@/api/@tanstack/react-query.gen";
import {
  Users,
  Briefcase,
  Gavel,
  ShieldAlert,
  UserCheck,
  Wrench,
  Building2,
} from "lucide-react";
import { Skeleton } from "@/ui/atoms/skeleton";
import { useDashboard } from "@/hooks/useContext";

const AdminHomepage = () => {
  const { setTitle } = useDashboard();

  useEffect(() => {
    setTitle("Admin Dashboard");
  }, []);

  const { data: analyticsResponse, isLoading } = useQuery({
    ...getAnalyticsOverviewOptions(),
  });

  const analytics = (analyticsResponse?.data as any) || {};

  const stats = [
    {
      title: "Total Users",
      value: analytics.totalUsers || 0,
      description: "Registered platform users",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Projects",
      value: analytics.projects || 0,
      description: "Total projects posted",
      icon: Briefcase,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      title: "Total Bids",
      value: analytics.bids || 0,
      description: "Bids placed on projects",
      icon: Gavel,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
    {
      title: "Pending Reviews",
      value: analytics.pendingVerifications || 0,
      description: "Verifications awaiting action",
      icon: ShieldAlert,
      color: "text-red-600",
      bgColor: "bg-red-100",
    },
  ];

  const roleStats = [
    {
      label: "Clients",
      value: analytics.clients || 0,
      icon: UserCheck,
      color: "text-emerald-600",
    },
    {
      label: "Contractors",
      value: analytics.contractors || 0,
      icon: Wrench,
      color: "text-indigo-600",
    },
    {
      label: "Consultants",
      value: analytics.consultants || 0,
      icon: Building2,
      color: "text-cyan-600",
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
        {roleStats.map((role, index) => (
          <Card key={index} className="border border-border shadow-sm">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className={`${role.color} p-3 rounded-full bg-gray-50`}>
                  <role.icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {role.label}
                  </p>
                  {isLoading ? (
                    <Skeleton className="h-7 w-12 mt-1" />
                  ) : (
                    <h3 className="text-2xl font-bold">{role.value}</h3>
                  )}
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
