import { getMyLogsOptions } from "@/api/@tanstack/react-query.gen";
import { envConfig } from "@/config/env.config";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/atoms/card";
import { Loader } from "@/ui/atoms/loader";
import { formatDate } from "@/ui/lib/date";
import { useQuery } from "@tanstack/react-query";
import { Activity, History } from "lucide-react";

export function UserLogs() {
    const { data: logsData, isLoading } = useQuery({
        ...getMyLogsOptions({ query: { page: envConfig.API_DEFAULT_PAGE, limit: envConfig.API_DEFAULT_LIMIT } }),
    });

    const logs = logsData?.data as any
    console.log(logs, "logslogs")
    if (isLoading) {
        return <Loader />;
    }

    return (
        <Card className="shadow-sm">
            <CardHeader className="border-b bg-muted/20 pb-4">
                <div className="flex items-center gap-2">
                    <History className="h-5 w-5 text-muted-foreground" />
                    <CardTitle className="text-lg font-medium">Activity Logs</CardTitle>
                </div>
            </CardHeader>
            <CardContent className="p-0">
                {!logs || logs.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-8 text-muted-foreground">
                        <Activity className="h-8 w-8 mb-2 opacity-50" />
                        <p>No recent activity found.</p>
                    </div>
                ) : (
                    <div className="max-h-[500px] overflow-y-auto">
                        <div className="divide-y">
                            {logs.map((log: any) => (
                                <div key={log.id} className="p-4 hover:bg-muted/50 transition-colors flex gap-4 text-sm group">
                                    <div className="min-w-[4rem] text-xs text-muted-foreground pt-1">
                                        {formatDate(log.createdAt)}
                                    </div>
                                    <div className="flex-1 space-y-1">
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium text-foreground">
                                                {log.action}
                                            </span>
                                        </div>
                                        <span>{log.description}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
