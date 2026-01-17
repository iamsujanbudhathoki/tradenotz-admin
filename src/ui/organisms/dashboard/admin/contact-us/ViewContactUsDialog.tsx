import {
    type ContactUs,
    type ContactUsStatus,
} from "@/api";
import {
    getAllMessagesOptions,
    updateStatusMutation,
} from "@/api/@tanstack/react-query.gen";
import { Avatar, AvatarFallback } from "@/ui/atoms/avatar";
import { Badge } from "@/ui/atoms/badge";
import { Button } from "@/ui/atoms/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/ui/atoms/dialog";
import { Label } from "@/ui/atoms/label";
import { Separator } from "@/ui/atoms/separator";
import { formatDate } from "@/ui/lib/date";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
    Archive,
    BookOpen,
    Calendar,
    CheckCircle2,
    Clock,
    Mail,
    Tag
} from "lucide-react";
import toast from "react-hot-toast";

export type ViewContactUsDialogProps = {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    contact: ContactUs;
};

export const ViewContactUsDialog: React.FC<ViewContactUsDialogProps> = ({
    isOpen,
    onOpenChange,
    contact,
}) => {
    const queryClient = useQueryClient();

    const updateStatus = useMutation({
        ...updateStatusMutation(),
        onSuccess: () => {
            toast.success("Status updated successfully");
            queryClient.invalidateQueries({
                queryKey: getAllMessagesOptions().queryKey,
            });
            onOpenChange(false);
        },
        onError: (error: any) => {
            toast.error(error?.message || "Failed to update status");
        },
    });

    const handleStatusChange = (status: ContactUsStatus) => {
        updateStatus.mutate({
            path: { id: contact.id },
            body: { status },
        });
    };

    const getStatusBadge = (status: ContactUsStatus) => {
        switch (status) {
            case "PENDING":
                return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">Pending</Badge>;
            case "READ":
                return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Read</Badge>;
            case "RESPONDED":
                return <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">Responded</Badge>;
            case "ARCHIVED":
                return <Badge variant="secondary">Archived</Badge>;
            default:
                return <Badge>{status}</Badge>;
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent
                onInteractOutside={(e) => e.preventDefault()}
                onEscapeKeyDown={(e) => e.preventDefault()}
                className="max-w-3xl max-h-[85vh] overflow-y-auto"
            >
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold">
                        Contact Details
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-6 py-2">
                    {/* Header Overview */}
                    <div className="relative overflow-hidden rounded-lg border border-border bg-muted/20 p-6">
                        <div className="flex flex-col md:flex-row items-center gap-6">
                            <Avatar className="h-20 w-20 border border-border shadow-sm">
                                <AvatarFallback className="bg-primary/5 text-primary/40 font-semibold text-2xl">
                                    {contact.name?.charAt(0) || "U"}
                                </AvatarFallback>
                            </Avatar>

                            <div className="flex-1 text-center md:text-left space-y-2">
                                <div>
                                    <h3 className="text-xl font-bold">{contact.name}</h3>
                                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mt-1">
                                        {getStatusBadge(contact.status)}
                                        <Badge variant="outline" className="px-2 py-0 text-[10px] uppercase font-bold tracking-wider">
                                            CONTACT
                                        </Badge>
                                    </div>
                                </div>

                                <div className="flex flex-wrap justify-center md:justify-start gap-x-6 gap-y-2 text-sm text-muted-foreground">
                                    <div className="flex items-center gap-2">
                                        <Mail className="h-3.5 w-3.5" />
                                        <span>{contact.email}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Information Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                        {/* Message Info */}
                        <section className="space-y-3">
                            <Label className="text-muted-foreground">Information</Label>
                            <div className="space-y-3 p-4 rounded-lg border border-border bg-muted/5">
                                <DetailItem label="Received At" value={formatDate(contact.createdAt)} icon={<Calendar className="w-3.5 h-3.5" />} />
                                <DetailItem label="Last Update" value={formatDate(contact.updatedAt)} icon={<Clock className="w-3.5 h-3.5" />} />
                                <DetailItem label="Message ID" value={contact.id.substring(0, 8)} icon={<Tag className="w-3.5 h-3.5" />} />
                            </div>
                        </section>

                        {/* Subject */}
                        <section className="space-y-3">
                            <Label className="text-muted-foreground">Subject</Label>
                            <div className="p-4 rounded-lg border border-border bg-muted/5 flex items-center h-[116px]">
                                <p className="font-semibold text-lg leading-tight">{contact.subject}</p>
                            </div>
                        </section>
                    </div>

                    <Separator className="bg-border" />

                    {/* Message Content */}
                    <section className="space-y-3">
                        <Label className="text-muted-foreground">Message Content</Label>
                        <div className="bg-background rounded-lg border border-border p-4 min-h-[120px]">
                            <p className="text-sm leading-relaxed whitespace-pre-wrap">{contact.message}</p>
                        </div>
                    </section>

                    {/* Actions - Sticky Footer Style */}
                    <div className="flex flex-wrap items-center justify-end gap-3 pt-6 border-t sticky bottom-0 bg-background/80 backdrop-blur-md pb-2 z-20">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleStatusChange("PENDING")}
                            disabled={contact.status === "PENDING" || updateStatus.isPending}
                            className="gap-2"
                        >
                            <Clock className="w-4 h-4" /> Pending
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleStatusChange("READ")}
                            disabled={contact.status === "READ" || updateStatus.isPending}
                            className="gap-2"
                        >
                            <BookOpen className="w-4 h-4" /> Mark Read
                        </Button>
                        <Button
                            variant="default"
                            size="sm"
                            onClick={() => handleStatusChange("RESPONDED")}
                            disabled={contact.status === "RESPONDED" || updateStatus.isPending}
                            className="gap-2"
                        >
                            <CheckCircle2 className="w-4 h-4" /> Responded
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleStatusChange("ARCHIVED")}
                            disabled={contact.status === "ARCHIVED" || updateStatus.isPending}
                            className="gap-2"
                        >
                            <Archive className="w-4 h-4" /> Archive
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

// Helper Component for compact details matching ViewUserDialog
const DetailItem = ({
    label,
    value,
    icon,
}: {
    label: string;
    value: React.ReactNode;
    icon?: React.ReactNode;
}) => {
    return (
        <div className="flex items-center justify-between group">
            <div className="flex items-center gap-2">
                <span className="text-muted-foreground/60 group-hover:text-primary transition-colors">
                    {icon}
                </span>
                <span className="text-xs font-medium text-muted-foreground">{label}</span>
            </div>
            <span className="text-[13px] font-semibold text-right">
                {value}
            </span>
        </div>
    );
};
