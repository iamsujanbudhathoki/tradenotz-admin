import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllMessagesOptions, deleteMessageMutation } from "@/api/@tanstack/react-query.gen";
import { Mail, Search, Eye, Trash2, MessageSquare } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/atoms/card";
import { Input } from "@/ui/atoms/input";
import { Button } from "@/ui/atoms/button";
import { Badge } from "@/ui/atoms/badge";
import { useDashboard } from "@/hooks/useContext";
// import { Loader } from "@/ui/atoms/loader";
import { formatDate } from "@/ui/lib/date";
import { ViewContactUsDialog } from "@/ui/organisms/dashboard/admin/contact-us/ViewContactUsDialog";
import toast from "react-hot-toast";
import type { ContactUs, ContactUsStatus } from "@/api";

import { Skeleton } from "@/ui/atoms/skeleton";
import { DeleteConfirmationDialog } from "@/ui/molecules/dashboard/DeleteConfirmationDialog";

const ContactUsList = () => {
    const { setTitle } = useDashboard();
    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("");
    const [selectedContact, setSelectedContact] = useState<ContactUs | null>(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [contactToDelete, setContactToDelete] = useState<string | null>(null);

    // Pagination state
    const [page, setPage] = useState(1);
    const [limit] = useState(10);

    const queryClient = useQueryClient();

    useEffect(() => {
        setTitle("Contact Requests");
    }, [setTitle]);

    // Debounce search term
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchTerm);
            setPage(1); // Reset to first page on search
        }, 500);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    // Reset page when status filter changes
    useEffect(() => {
        setPage(1);
    }, [statusFilter]);

    const {
        data: messagesResponse,
        isLoading,
        error,
    } = useQuery({
        ...getAllMessagesOptions({
            query: {
                // @ts-ignore - search is supported by backend but missing in generated types
                search: debouncedSearch || undefined,
                status: statusFilter || undefined,
                page,
                limit,
            },
        }),
        placeholderData: (previousData) => previousData, // Keep showing previous data while fetching new page
        staleTime: 30000, // Keep data fresh for 30 seconds to reduce API calls
    });

    const messages = (messagesResponse?.data as ContactUs[]) || [];
    const pagination = messagesResponse?.pagination;

    const deleteMessage = useMutation({
        ...deleteMessageMutation(),
        onSuccess: () => {
            toast.success("Message deleted successfully");
            queryClient.invalidateQueries({
                queryKey: getAllMessagesOptions().queryKey,
            });
            setDeleteDialogOpen(false);
            setContactToDelete(null);
        },
        onError: (error: any) => {
            toast.error(error?.message || "Failed to delete message");
        },
    });

    const handleDelete = (id: string) => {
        setContactToDelete(id);
        setDeleteDialogOpen(true);
    };

    const handleConfirmDelete = () => {
        if (contactToDelete) {
            deleteMessage.mutate({ path: { id: contactToDelete } });
        }
    };

    const handleViewDetails = (contact: ContactUs) => {
        setSelectedContact(contact);
        setIsDetailsOpen(true);
    };



    if (error) {
        return (
            <div className="p-4 text-red-500 bg-red-50 rounded-lg border border-red-200">
                Error loading messages: {(error as any)?.message || "Unknown error"}
            </div>
        );
    }

    const getStatusBadge = (status: ContactUsStatus) => {
        switch (status) {
            case "PENDING":
                return <Badge variant="outline" className="status-warning border bg-amber-50/50">Pending</Badge>;
            case "READ":
                return <Badge variant="outline" className="status-info border bg-blue-50/50">Read</Badge>;
            case "RESPONDED":
                return <Badge variant="outline" className="status-success border bg-green-50/50">Responded</Badge>;
            case "ARCHIVED":
                return <Badge variant="secondary" className="status-neutral border bg-slate-50/50">Archived</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <CardTitle className="text-xl font-bold flex items-center gap-2">
                        <MessageSquare className="w-5 h-5 text-primary" />
                        Contact Messages
                    </CardTitle>
                    <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                        <div className="relative w-full sm:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                placeholder="Search name, email or subject..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-9"
                            />
                        </div>
                        <div className="relative w-full sm:w-48">
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                            >
                                <option value="">All Statuses</option>
                                <option value="PENDING">Pending</option>
                                <option value="READ">Read</option>
                                <option value="RESPONDED">Responded</option>
                                <option value="ARCHIVED">Archived</option>
                            </select>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b bg-muted/40">
                                    <th className="py-4 px-6 font-semibold text-xs uppercase tracking-wider text-muted-foreground">Sender</th>
                                    <th className="py-4 px-6 font-semibold text-xs uppercase tracking-wider text-muted-foreground">Subject</th>
                                    <th className="py-4 px-6 font-semibold text-xs uppercase tracking-wider text-muted-foreground">Status</th>
                                    <th className="py-4 px-6 font-semibold text-xs uppercase tracking-wider text-muted-foreground">Date</th>
                                    <th className="py-4 px-6 font-semibold text-xs uppercase tracking-wider text-muted-foreground text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {isLoading ? (
                                    // Skeleton Loading State
                                    Array.from({ length: 5 }).map((_, index) => (
                                        <tr key={index}>
                                            <td className="py-4 px-6">
                                                <div className="space-y-2">
                                                    <Skeleton className="h-4 w-32" />
                                                    <Skeleton className="h-3 w-40" />
                                                </div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <Skeleton className="h-4 w-48" />
                                            </td>
                                            <td className="py-4 px-6">
                                                <Skeleton className="h-6 w-20 rounded-full" />
                                            </td>
                                            <td className="py-4 px-6">
                                                <Skeleton className="h-4 w-24" />
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="flex justify-center gap-2">
                                                    <Skeleton className="h-8 w-8 rounded-md" />
                                                    <Skeleton className="h-8 w-8 rounded-md" />
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : messages.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="py-16 text-center">
                                            <div className="flex flex-col items-center gap-3">
                                                <div className="w-16 h-16 rounded-full bg-muted/30 flex items-center justify-center">
                                                    <MessageSquare className="w-8 h-8 text-muted-foreground/50" />
                                                </div>
                                                <div>
                                                    <p className="text-lg font-medium text-foreground">No messages found</p>
                                                    <p className="text-sm text-muted-foreground">Try adjusting your search or filters</p>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    messages.map((contact: ContactUs) => (
                                        <tr
                                            key={contact.id}
                                            className="group hover:bg-muted/30 transition-all duration-200 cursor-pointer"
                                            onClick={() => handleViewDetails(contact)}
                                        >
                                            <td className="py-4 px-6">
                                                <div className="flex flex-col gap-1">
                                                    <span className="font-semibold text-foreground group-hover:text-primary transition-colors">{contact.name}</span>
                                                    <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                                                        <Mail className="w-3 h-3" /> {contact.email}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <span className="text-sm font-medium line-clamp-1 truncate max-w-[250px] text-muted-foreground group-hover:text-foreground transition-colors">
                                                    {contact.subject}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6">
                                                {getStatusBadge(contact.status)}
                                            </td>
                                            <td className="py-4 px-6 text-muted-foreground text-sm font-medium">
                                                {formatDate(contact.createdAt)}
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleViewDetails(contact);
                                                        }}
                                                        className="h-8 w-8 hover:bg-primary/10 hover:text-primary rounded-full transition-colors"
                                                        title="View Details"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleDelete(contact.id);
                                                        }}
                                                        className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive rounded-full transition-colors"
                                                        disabled={deleteMessage.isPending}
                                                        title="Delete Contact Request"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination Controls */}
                    {pagination && pagination.totalPages > 1 && (
                        <div className="flex items-center justify-between mt-6">
                            <div className="text-sm text-muted-foreground">
                                Showing <span className="font-medium">{(page - 1) * limit + 1}</span> to{" "}
                                <span className="font-medium">
                                    {Math.min(page * limit, pagination.total)}
                                </span>{" "}
                                of <span className="font-medium">{pagination.total}</span> entries
                            </div>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                                    disabled={page === 1 || isLoading}
                                >
                                    Previous
                                </Button>
                                {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                                    // Logic to show pages around current page
                                    let p = i + 1;
                                    if (pagination.totalPages > 5 && page > 3) {
                                        p = page - 2 + i;
                                        if (p > pagination.totalPages) p = pagination.totalPages - (4 - i);
                                    }
                                    return (
                                        <Button
                                            key={i}
                                            variant={p === page ? "default" : "outline"}
                                            size="sm"
                                            className="w-8 h-8 p-0"
                                            onClick={() => setPage(p)}
                                            disabled={isLoading}
                                        >
                                            {p}
                                        </Button>
                                    );
                                })}
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                                    disabled={page === pagination.totalPages || isLoading}
                                >
                                    Next
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {isDetailsOpen && selectedContact && (
                <ViewContactUsDialog
                    isOpen={isDetailsOpen}
                    contact={selectedContact}
                    onOpenChange={setIsDetailsOpen}
                />
            )}

            <DeleteConfirmationDialog
                isOpen={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                onConfirm={handleConfirmDelete}
                title="Delete Contact Request"
                description="Are you sure you want to delete this contact request? This action cannot be undone."
                isPending={deleteMessage.isPending}
            />
        </div>
    );
};

export default ContactUsList;
