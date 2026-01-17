import { useMemo, useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllMessagesOptions, deleteMessageMutation } from "@/api/@tanstack/react-query.gen";
import { Mail, Search, Eye, Trash2, MessageSquare } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/atoms/card";
import { Input } from "@/ui/atoms/input";
import { Button } from "@/ui/atoms/button";
import { Badge } from "@/ui/atoms/badge";
import { useDashboard } from "@/hooks/useContext";
import { Loader } from "@/ui/atoms/loader";
import { formatDate } from "@/ui/lib/date";
import { ViewContactUsDialog } from "@/ui/organisms/dashboard/admin/contact-us/ViewContactUsDialog";
import toast from "react-hot-toast";
import type { ContactUs, ContactUsStatus } from "@/api";

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
    const queryClient = useQueryClient();

    useEffect(() => {
        setTitle("Contact Requests");
    }, [setTitle]);

    // Debounce search term
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchTerm);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    const {
        data: messagesResponse,
        isLoading,
        error,
    } = useQuery({
        ...getAllMessagesOptions({
            query: {
                search: debouncedSearch || undefined,
                status: statusFilter || undefined,
            } as any,
        }),
        staleTime: 30000, // Keep data fresh for 30 seconds to reduce API calls
    });

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

    // Messages are now filtered by the backend
    const filteredMessages = useMemo(() => {
        if (!messagesResponse?.data) return [];
        return messagesResponse.data as ContactUs[];
    }, [messagesResponse]);

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
                    {isLoading ? (
                        <Loader />
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b bg-muted/30">
                                        <th className="py-4 px-4 font-semibold text-muted-foreground">Sender</th>
                                        <th className="py-4 px-4 font-semibold text-muted-foreground">Subject</th>
                                        <th className="py-4 px-4 font-semibold text-muted-foreground">Status</th>
                                        <th className="py-4 px-4 font-semibold text-muted-foreground">Date</th>
                                        <th className="py-4 px-4 font-semibold text-muted-foreground text-center">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredMessages.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="py-12 text-center text-muted-foreground">
                                                <div className="flex flex-col items-center gap-2">
                                                    <MessageSquare className="w-8 h-8 opacity-20" />
                                                    <p>No contact messages found.</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredMessages.map((contact: ContactUs) => (
                                            <tr
                                                key={contact.id}
                                                className="border-b hover:bg-muted/10 transition-colors"
                                            >
                                                <td className="py-4 px-4">
                                                    <div className="flex flex-col">
                                                        <span className="font-medium text-foreground">{contact.name}</span>
                                                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                                                            <Mail className="w-3 h-3" /> {contact.email}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-4">
                                                    <span className="text-sm font-medium line-clamp-1 truncate max-w-[200px]">
                                                        {contact.subject}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-4">
                                                    {getStatusBadge(contact.status)}
                                                </td>
                                                <td className="py-4 px-4 text-muted-foreground text-sm">
                                                    {formatDate(contact.createdAt)}
                                                </td>
                                                <td className="py-4 px-4">
                                                    <div className="flex items-center justify-center gap-2">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleViewDetails(contact)}
                                                            className="h-8 px-2 hover:bg-blue-50 hover:text-blue-600"
                                                            title="View Details"
                                                        >
                                                            <Eye className="w-4 h-4 mr-1" />

                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleDelete(contact.id)}
                                                            className="h-8 px-2 hover:bg-red-50 hover:text-red-600"
                                                            disabled={deleteMessage.isPending}
                                                            title="Delete Contact Request"
                                                        >
                                                            <Trash2 className="w-4 h-4 mr-1" />

                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
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
