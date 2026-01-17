import {
    getUnreadCountOptions,
    getUserNotificationsOptions,
    markAllAsReadMutation,
    markAsReadMutation,
} from "@/api/@tanstack/react-query.gen";
import type { Notification } from "@/api";
import { Button } from "@/ui/atoms/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/ui/atoms/card";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Bell, BellOff, Check, Loader2 } from "lucide-react";
import { useMemo, useState, useRef, useEffect } from "react";
import { cn } from "@/ui/lib/utils";

// Native date formatter
import { formatDate } from "@/ui/lib/date";

export function NotificationPopover() {
    const [isOpen, setIsOpen] = useState(false);
    const queryClient = useQueryClient();
    const containerRef = useRef<HTMLDivElement>(null);

    // Close on click outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                containerRef.current &&
                !containerRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // Fetch notifications
    const { data: notificationsData, isLoading: isLoadingNotifications } =
        useQuery(getUserNotificationsOptions({ query: { page: 1, limit: 20 } }));

    // Fetch unread count
    const { data: unreadCountData } = useQuery(getUnreadCountOptions());

    const notifications = useMemo(() => {
        if (notificationsData?.data?.data) {
            return notificationsData.data.data;
        }
        return [];
    }, [notificationsData]);

    const unreadCount = useMemo(() => {
        if (unreadCountData?.data?.count !== undefined) {
            return unreadCountData.data.count;
        }
        return 0;
    }, [unreadCountData]);

    // Mark as read mutation
    const markAsReadMut = useMutation(markAsReadMutation());
    const markAllAsReadMut = useMutation(markAllAsReadMutation());

    const handleMarkAsRead = (notificationId: string) => {
        markAsReadMut.mutate(
            { path: { id: notificationId } },
            {
                onSuccess: () => {
                    queryClient.invalidateQueries({ queryKey: ["getUserNotifications"] });
                    queryClient.invalidateQueries({ queryKey: ["getUnreadCount"] });
                },
            }
        );
    };

    const handleMarkAllAsRead = () => {
        markAllAsReadMut.mutate(
            {},
            {
                onSuccess: () => {
                    queryClient.invalidateQueries({ queryKey: ["getUserNotifications"] });
                    queryClient.invalidateQueries({ queryKey: ["getUnreadCount"] });
                },
            }
        );
    };

    const toggleOpen = () => setIsOpen(!isOpen);

    return (
        <div className="relative" ref={containerRef}>
            <button
                onClick={toggleOpen}
                className="relative p-2 rounded-full hover:bg-accent transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20"
                aria-label="Notifications"
            >
                <Bell className={cn("h-5 w-5 text-muted-foreground transition-colors", isOpen && "text-primary")} />
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 h-4 min-w-[1rem] px-1 bg-destructive text-destructive-foreground text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-background">
                        {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 top-full mt-2 z-50 w-80 sm:w-96 animate-in fade-in zoom-in-95 duration-200">
                    <Card className="shadow-xl border-border overflow-hidden">
                        <CardHeader className="p-4 border-b bg-muted/30">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Bell className="w-4 h-4 text-primary" />
                                    <CardTitle className="text-sm font-semibold">Notifications</CardTitle>
                                </div>
                                <div className="flex items-center gap-1">
                                    {unreadCount > 0 && (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={handleMarkAllAsRead}
                                            disabled={markAllAsReadMut.isPending}
                                            className="h-7 px-2 text-xs font-medium text-primary hover:text-primary/80 hover:bg-primary/10"
                                        >
                                            {markAllAsReadMut.isPending ? (
                                                <Loader2 className="h-3 w-3 animate-spin" />
                                            ) : (
                                                <>
                                                    <Check className="h-3 w-3 mr-1" />
                                                    Mark all read
                                                </>
                                            )}
                                        </Button>
                                    )}
                                    {/* <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => setIsOpen(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button> */}
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0 max-h-[400px] overflow-y-auto">
                            {isLoadingNotifications ? (
                                <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
                                    <Loader2 className="h-8 w-8 animate-spin mb-2 text-primary/50" />
                                    <span className="text-xs">Loading updates...</span>
                                </div>
                            ) : notifications.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-12 text-muted-foreground space-y-3">
                                    <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                                        <BellOff className="h-6 w-6 text-muted-foreground/50" />
                                    </div>
                                    <div className="text-center">
                                        <p className="text-sm font-medium text-foreground">No notifications</p>
                                        <p className="text-xs text-muted-foreground mt-1">You're all caught up!</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="divide-y divide-border/50">
                                    {notifications.map((notification: Notification) => (
                                        <div
                                            key={notification.id}
                                            className={cn(
                                                "group relative p-4 transition-all hover:bg-muted/50 cursor-pointer",
                                                !notification.isRead ? "bg-primary/5 hover:bg-primary/10" : "bg-transparent"
                                            )}
                                            onClick={() => {
                                                if (!notification.isRead) {
                                                    handleMarkAsRead(notification.id);
                                                }
                                            }}
                                        >
                                            <div className="flex items-start gap-3">
                                                {/* Status Dot */}
                                                <div className={cn(
                                                    "mt-1.5 h-2 w-2 rounded-full flex-shrink-0 transition-transform",
                                                    !notification.isRead ? "bg-primary scale-100" : "bg-transparent scale-0"
                                                )} />

                                                <div className="flex-1 space-y-1">
                                                    <p className={cn(
                                                        "text-sm font-medium leading-none text-foreground",
                                                        !notification.isRead && "font-semibold"
                                                    )}>
                                                        {notification.title}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                                                        {notification.message}
                                                    </p>
                                                    <p className="text-[10px] text-muted-foreground/70 pt-1">
                                                        {formatDate(notification.createdAt)}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                        {/* Footer if needed */}
                        {/* <div className="p-2 border-t bg-muted/10 text-center">
                <Link to="/notifications" className="text-xs text-primary hover:underline">View all</Link>
            </div> */}
                    </Card>
                </div>
            )}
        </div>
    );
}
