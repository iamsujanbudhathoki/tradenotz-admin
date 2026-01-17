import type { User } from "@/api";
import { menuList } from "@/constants/menuList";
import { DashboardContext } from "@/context/DashboardContext";
import type { RouteContextType } from "@/main";
import { useGetMe, useLogoutMutation } from "@/query/useAuth";
import { Avatar, AvatarFallback, AvatarImage } from "@/ui/atoms/avatar";
import { Button } from "@/ui/atoms/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/ui/atoms/card";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/ui/atoms/sidebar";
import {
  Link,
  useLocation,
  useNavigate,
  useRouteContext,
} from "@tanstack/react-router";
import { AlertTriangle, ArrowRight, Loader2, X } from "lucide-react";
import * as React from "react";
import { useMemo, useState } from "react";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [title, setTitle] = useState("Dashboard"); // Default title
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  // @ts-ignore
  const { user: contextUser } = useRouteContext({
    from: "__root__",
  }) as RouteContextType;
  // @ts-ignore
  const { data: userData, error, isLoading: isLoadingUser } = useGetMe();
  const logoutMutation = useLogoutMutation();

  console.log("error", error);
  const user = useMemo(() => {
    if (!userData) return null;

    if (
      userData &&
      typeof userData === "object" &&
      "data" in userData &&
      userData.data
    ) {
      const innerData = userData.data as any;

      if (
        innerData &&
        typeof innerData === "object" &&
        "user" in innerData &&
        innerData.user
      ) {
        const userObj = innerData.user as any;
        // Remove nested profile and media from user object for display
        return {
          ...userObj,
          profile: undefined,
          media: undefined,
        } as User;
      }

      // Check if innerData also has a data property (nested structure for other roles)
      if (
        innerData &&
        typeof innerData === "object" &&
        "data" in innerData &&
        innerData.data
      ) {
        const profileData = innerData.data as any;
        // Check if profileData has a user property
        if (
          profileData &&
          typeof profileData === "object" &&
          "user" in profileData &&
          profileData.user
        ) {
          return profileData.user as User;
        }
        // If profileData is directly a user object
        if (
          profileData &&
          typeof profileData === "object" &&
          "fullName" in profileData
        ) {
          return profileData as User;
        }
      }

      // Fallback: if innerData is directly the user object (has fullName property)
      if (
        innerData &&
        typeof innerData === "object" &&
        "fullName" in innerData
      ) {
        return innerData as User;
      }
    }

    return null;
  }, [userData]);

  const initials = useMemo(() => {
    if (!user?.fullName) return "U";
    const parts = user.fullName.split(" ");
    const firstName = parts[0] || "";
    const lastName = parts.slice(1).join(" ") || "";
    return firstName[0] + (lastName[0] || "").toUpperCase();
  }, [user]);

  const profileImageUrl = useMemo(() => {
    if (user?.profileImage?.url) {
      return user.profileImage.url;
    }
    if (user?.avatar) {
      return user.avatar;
    }
    return "";
  }, [user]);

  const handleLogout = () => {
    setShowLogoutDialog(true);
  };

  const confirmLogout = () => {
    logoutMutation.mutate(
      {},
      {
        onSuccess: () => {
          localStorage.removeItem("token");
          window.location.href = "/login";
        },
        onError: (error: any) => {
          console.error("Logout error:", error);
          localStorage.removeItem("token");
          window.location.href = "/login";
        },
      }
    );
  };

  // if (!contextUser || isLoadingUser) {
  //   return (
  //     <div className="flex items-center justify-center min-h-screen">
  //       <Loader />
  //     </div>
  //   );
  // }

  return (
    <DashboardContext.Provider value={{ title, setTitle }}>
      {/* Logout Confirmation Dialog */}
      {showLogoutDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <Card className="w-full max-w-md mx-4">
            <CardHeader>
              <CardTitle>Confirm Logout</CardTitle>
              <CardDescription>
                Are you sure you want to logout? You will need to login again to
                access your account.
              </CardDescription>
            </CardHeader>
            <CardFooter className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setShowLogoutDialog(false)}
                disabled={logoutMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={confirmLogout}
                disabled={logoutMutation.isPending}
              >
                {logoutMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Logging out...
                  </>
                ) : (
                  "Logout"
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}

      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          <Sidebar>
            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupLabel>Navigation</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {menuList
                      .map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                          <SidebarMenuItem key={item.path}>
                            <SidebarMenuButton
                              asChild
                              isActive={isActive}
                              tooltip={item.label}
                              size="lg"
                              className="py-3 px-4"
                            >
                              <Link to={item.path}>
                                <span className="h-5 w-5 flex items-center justify-center">
                                  {React.cloneElement(item.icon, {
                                    className: "h-5 w-5",
                                  })}
                                </span>
                                <span>{item.label}</span>
                              </Link>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                        );
                      })}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>
          </Sidebar>
          <main className="flex-1 flex flex-col">
            <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 md:px-6">
              <SidebarTrigger />
              <div className="flex-1">
                <h1 className="text-lg font-semibold">{title}</h1>
              </div>
              <div className="flex items-center gap-3 relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="cursor-pointer hover:opacity-80 transition-opacity"
                  aria-label="User menu"
                >
                  <div className="p-[2px] rounded-full gradient-accent">
                    <Avatar className="h-10 w-10 border-2 border-white bg-white">
                      <AvatarImage
                        src={profileImageUrl}
                        alt={user?.fullName || "User"}
                      />
                      <AvatarFallback>{initials}</AvatarFallback>
                    </Avatar>
                  </div>
                </button>

                {/* User Menu Dialog */}
                {showUserMenu && (
                  <>
                    {/* Backdrop */}
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setShowUserMenu(false)}
                    />
                    {/* Menu Card */}
                    <div className="fixed top-20 left-4 right-4 z-50 md:left-auto md:right-6 md:w-96 bg-white rounded-lg shadow-lg border border-gray-200">
                      <Card className="border-0 shadow-none">
                        <CardHeader className="relative pb-4">
                          <button
                            onClick={() => setShowUserMenu(false)}
                            className="absolute right-2 top-2 p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
                            aria-label="Close"
                          >
                            <X className="h-5 w-5" />
                          </button>
                          <p className="text-sm text-gray-700 text-center pr-10">
                            {user?.email}
                          </p>
                        </CardHeader>
                        <CardContent className="pt-0 pb-6">
                          <div className="flex flex-col items-center space-y-4">
                            {/* Profile Picture */}
                            <div className="relative">
                              <div className="p-[3px] rounded-full gradient-accent">
                                <Avatar className="h-24 w-24 border-4 border-white bg-white">
                                  <AvatarImage
                                    src={profileImageUrl}
                                    alt={user?.fullName || "User"}
                                  />
                                  <AvatarFallback className="text-2xl bg-primary text-white">
                                    {initials}
                                  </AvatarFallback>
                                </Avatar>
                              </div>
                              <div className="absolute bottom-0 right-0 bg-white rounded-full p-1.5 shadow-md border-2 border-white">
                                <div className="w-4 h-4 bg-gray-400 rounded-sm flex items-center justify-center">
                                  <div className="w-2 h-2 bg-white rounded-sm" />
                                </div>
                              </div>
                            </div>

                            {/* Greeting */}
                            <h3 className="text-xl font-semibold text-gray-900">
                              Hi, {user?.fullName}!
                            </h3>

                            {/* Manage Account Button */}
                            <Button
                              variant="outline"
                              className="w-full border-gray-300"
                              onClick={() => {
                                setShowUserMenu(false);
                                navigate({ to: "/dashboard/profile" });
                              }}
                            >
                              Manage your Account
                            </Button>

                            {/* Bottom Buttons */}
                            <div className="flex gap-2 w-full pt-2 border-t">
                              <Button
                                variant="outline"
                                className="flex-1 border-gray-300"
                                onClick={() => {
                                  setShowUserMenu(false);
                                  handleLogout();
                                }}
                              >
                                <ArrowRight className="h-4 w-4 mr-2" />
                                Sign out
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </>
                )}
              </div>
            </header>
            <div className="flex-1 overflow-auto">
              {user && !(user as any).isAgentVerified && (
                <div className="bg-amber-50 border-l-4 border-amber-500 p-4 m-4 md:mx-6 mb-0 flex items-start gap-3 shadow-sm rounded-r-md">
                  <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="text-amber-800 font-medium">
                      Profile Verification Pending
                    </h3>
                    <p className="text-amber-700 text-sm mt-1">
                      Your profile has not been verified by an agent yet. Some
                      platform features may be limited until verification is
                      complete.
                    </p>
                  </div>
                </div>
              )}
              <div className="p-4 md:p-6">{children}</div>
            </div>
          </main>
        </div>
      </SidebarProvider>
    </DashboardContext.Provider>
  );
}
