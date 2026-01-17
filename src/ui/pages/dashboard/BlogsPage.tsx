import { DashboardContext } from "@/context/DashboardContext";
import { Button } from "@/ui/atoms/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/ui/atoms/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/ui/atoms/dialog";
import { Label } from "@/ui/atoms/label";
import {
    BookOpen,
    Edit,
    Link2,
    Loader2,
    Plus,
    Trash2,
} from "lucide-react";
import { useContext, useEffect, useState } from "react";

// Types for Blog
type BlogPart = {
    id: string;
    title: string;
    content: string;
    order: number;
};

type BlogReference = {
    id: string;
    blogId: string;
    blogTitle: string;
};

type Blog = {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    thumbnail?: string;
    tags: string[];
    parts: BlogPart[];
    references: BlogReference[];
    isPublished: boolean;
    createdAt: string;
    updatedAt: string;
};

export function BlogsPage() {
    const dashboardContext = useContext(DashboardContext);
    const setTitle = dashboardContext?.setTitle;
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        title: "",
        slug: "",
        excerpt: "",
        content: "",
        thumbnail: "",
        tags: "",
    });

    useEffect(() => {
        setTitle?.("Blogs");
        // TODO: Fetch blogs from API
        loadMockData();
    }, [setTitle]);

    const loadMockData = () => {
        // Mock data for now
        const mockBlogs: Blog[] = [
            {
                id: "1",
                title: "Understanding Support and Resistance",
                slug: "understanding-support-resistance",
                excerpt: "Learn the fundamentals of support and resistance levels in trading",
                content: "Full blog content here...",
                thumbnail: "",
                tags: ["basics", "technical-analysis"],
                parts: [
                    {
                        id: "p1",
                        title: "What is Support?",
                        content: "Support is a price level...",
                        order: 1,
                    },
                    {
                        id: "p2",
                        title: "What is Resistance?",
                        content: "Resistance is a price level...",
                        order: 2,
                    },
                ],
                references: [],
                isPublished: true,
                createdAt: "2026-01-10",
                updatedAt: "2026-01-15",
            },
            {
                id: "2",
                title: "Risk Management Strategies",
                slug: "risk-management-strategies",
                excerpt: "Essential risk management techniques every trader should know",
                content: "Full blog content here...",
                thumbnail: "",
                tags: ["risk-management", "strategy"],
                parts: [],
                references: [
                    {
                        id: "r1",
                        blogId: "1",
                        blogTitle: "Understanding Support and Resistance",
                    },
                ],
                isPublished: false,
                createdAt: "2026-01-12",
                updatedAt: "2026-01-16",
            },
        ];
        setBlogs(mockBlogs);
    };

    const generateSlug = (title: string) => {
        return title
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, "")
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-")
            .trim();
    };

    const handleCreateBlog = () => {
        setIsLoading(true);
        // TODO: API call to create blog
        setTimeout(() => {
            const newBlog: Blog = {
                id: Date.now().toString(),
                ...formData,
                slug: formData.slug || generateSlug(formData.title),
                tags: formData.tags.split(",").map((t) => t.trim()).filter(Boolean),
                parts: [],
                references: [],
                isPublished: false,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };
            setBlogs([...blogs, newBlog]);
            setIsLoading(false);
            setIsCreateDialogOpen(false);
            setFormData({
                title: "",
                slug: "",
                excerpt: "",
                content: "",
                thumbnail: "",
                tags: "",
            });
        }, 500);
    };

    const handleEditBlog = () => {
        if (!selectedBlog) return;
        setIsLoading(true);
        // TODO: API call to update blog
        setTimeout(() => {
            setBlogs(
                blogs.map((b) =>
                    b.id === selectedBlog.id
                        ? {
                            ...b,
                            ...formData,
                            slug: formData.slug || generateSlug(formData.title),
                            tags: formData.tags
                                .split(",")
                                .map((t) => t.trim())
                                .filter(Boolean),
                            updatedAt: new Date().toISOString(),
                        }
                        : b
                )
            );
            setIsLoading(false);
            setIsEditDialogOpen(false);
            setSelectedBlog(null);
            setFormData({
                title: "",
                slug: "",
                excerpt: "",
                content: "",
                thumbnail: "",
                tags: "",
            });
        }, 500);
    };

    const handleDeleteBlog = () => {
        if (!selectedBlog) return;
        setIsLoading(true);
        // TODO: API call to delete blog
        setTimeout(() => {
            setBlogs(blogs.filter((b) => b.id !== selectedBlog.id));
            setIsLoading(false);
            setIsDeleteDialogOpen(false);
            setSelectedBlog(null);
        }, 500);
    };

    const openEditDialog = (blog: Blog) => {
        setSelectedBlog(blog);
        setFormData({
            title: blog.title,
            slug: blog.slug,
            excerpt: blog.excerpt,
            content: blog.content,
            thumbnail: blog.thumbnail || "",
            tags: blog.tags.join(", "),
        });
        setIsEditDialogOpen(true);
    };

    const openDeleteDialog = (blog: Blog) => {
        setSelectedBlog(blog);
        setIsDeleteDialogOpen(true);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-semibold text-foreground">Manage Blogs</h2>
                    <p className="text-muted-foreground text-sm mt-1">
                        Create and manage your trading articles with parts and references
                    </p>
                </div>
                <Button
                    onClick={() => setIsCreateDialogOpen(true)}
                    className="bg-primary hover:bg-primary/90"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    New Blog
                </Button>
            </div>

            {/* Blogs Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {blogs.map((blog) => (
                    <Card key={blog.id} className="shadow-card hover:shadow-card-hover transition-smooth">
                        <CardHeader>
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-2 flex-1">
                                    <BookOpen className="w-5 h-5 text-primary flex-shrink-0" />
                                    <CardTitle className="text-lg line-clamp-1">{blog.title}</CardTitle>
                                </div>
                                <span
                                    className={`px-2 py-1 rounded-full text-xs font-medium ml-2 ${blog.isPublished
                                        ? "status-success"
                                        : "status-neutral"
                                        }`}
                                >
                                    {blog.isPublished ? "Published" : "Draft"}
                                </span>
                            </div>
                            <CardDescription className="line-clamp-2">
                                {blog.excerpt}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Tags */}
                            {blog.tags.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                    {blog.tags.map((tag, index) => (
                                        <span
                                            key={index}
                                            className="px-2 py-1 bg-muted text-muted-foreground rounded text-xs"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            )}

                            {/* Metadata */}
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <span>{blog.parts.length} parts</span>
                                {blog.references.length > 0 && (
                                    <span className="flex items-center gap-1">
                                        <Link2 className="w-3 h-3" />
                                        {blog.references.length} refs
                                    </span>
                                )}
                                <span className="ml-auto">
                                    {new Date(blog.updatedAt).toLocaleDateString()}
                                </span>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2 pt-2 border-t border-border">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="flex-1"
                                    onClick={() => openEditDialog(blog)}
                                >
                                    <Edit className="w-4 h-4 mr-1" />
                                    Edit
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-destructive hover:text-destructive flex-1"
                                    onClick={() => openDeleteDialog(blog)}
                                >
                                    <Trash2 className="w-4 h-4 mr-1" />
                                    Delete
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}

                {blogs.length === 0 && (
                    <div className="col-span-full flex flex-col items-center justify-center py-12">
                        <BookOpen className="w-12 h-12 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-medium text-foreground mb-2">No blogs yet</h3>
                        <p className="text-muted-foreground text-sm mb-4">
                            Start writing your first trading article
                        </p>
                        <Button onClick={() => setIsCreateDialogOpen(true)}>
                            <Plus className="w-4 h-4 mr-2" />
                            Create Blog
                        </Button>
                    </div>
                )}
            </div>

            {/* Create Blog Dialog */}
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Create New Blog</DialogTitle>
                        <DialogDescription>
                            Add a new blog article with support for multiple parts and references
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="title" required>Blog Title</Label>
                            <input
                                id="title"
                                type="text"
                                className="w-full px-4 py-2.5 border border-border bg-card rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                placeholder="e.g., Understanding Support and Resistance"
                                value={formData.title}
                                onChange={(e) => {
                                    setFormData({
                                        ...formData,
                                        title: e.target.value,
                                        slug: generateSlug(e.target.value),
                                    });
                                }}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="slug" required>Slug (URL)</Label>
                            <input
                                id="slug"
                                type="text"
                                className="w-full px-4 py-2.5 border border-border bg-card rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-mono text-sm"
                                placeholder="understanding-support-resistance"
                                value={formData.slug}
                                onChange={(e) =>
                                    setFormData({ ...formData, slug: e.target.value })
                                }
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="excerpt" required>Excerpt</Label>
                            <textarea
                                id="excerpt"
                                className="w-full px-4 py-2.5 border border-border bg-card rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent min-h-[80px]"
                                placeholder="Brief description of the article..."
                                value={formData.excerpt}
                                onChange={(e) =>
                                    setFormData({ ...formData, excerpt: e.target.value })
                                }
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="content" required>Full Content</Label>
                            <textarea
                                id="content"
                                className="w-full px-4 py-2.5 border border-border bg-card rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent min-h-[150px] font-mono text-sm"
                                placeholder="Write your blog content here (supports markdown)..."
                                value={formData.content}
                                onChange={(e) =>
                                    setFormData({ ...formData, content: e.target.value })
                                }
                            />
                            <p className="text-xs text-muted-foreground">
                                Tip: You can add parts and references after creating the blog
                            </p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="tags">Tags (comma-separated)</Label>
                            <input
                                id="tags"
                                type="text"
                                className="w-full px-4 py-2.5 border border-border bg-card rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                placeholder="e.g., basics, technical-analysis, strategy"
                                value={formData.tags}
                                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="thumbnail">Thumbnail URL (optional)</Label>
                            <input
                                id="thumbnail"
                                type="url"
                                className="w-full px-4 py-2.5 border border-border bg-card rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                placeholder="https://example.com/image.jpg"
                                value={formData.thumbnail}
                                onChange={(e) =>
                                    setFormData({ ...formData, thumbnail: e.target.value })
                                }
                            />
                        </div>
                    </div>
                    <div className="flex justify-end gap-2">
                        <Button
                            variant="outline"
                            onClick={() => setIsCreateDialogOpen(false)}
                            disabled={isLoading}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleCreateBlog}
                            disabled={
                                isLoading ||
                                !formData.title ||
                                !formData.excerpt ||
                                !formData.content
                            }
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Creating...
                                </>
                            ) : (
                                "Create Blog"
                            )}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Edit Blog Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Edit Blog</DialogTitle>
                        <DialogDescription>
                            Update your blog article
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="edit-title" required>Blog Title</Label>
                            <input
                                id="edit-title"
                                type="text"
                                className="w-full px-4 py-2.5 border border-border bg-card rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                value={formData.title}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        title: e.target.value,
                                        slug: generateSlug(e.target.value),
                                    })
                                }
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="edit-slug" required>Slug (URL)</Label>
                            <input
                                id="edit-slug"
                                type="text"
                                className="w-full px-4 py-2.5 border border-border bg-card rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-mono text-sm"
                                value={formData.slug}
                                onChange={(e) =>
                                    setFormData({ ...formData, slug: e.target.value })
                                }
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="edit-excerpt" required>Excerpt</Label>
                            <textarea
                                id="edit-excerpt"
                                className="w-full px-4 py-2.5 border border-border bg-card rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent min-h-[80px]"
                                value={formData.excerpt}
                                onChange={(e) =>
                                    setFormData({ ...formData, excerpt: e.target.value })
                                }
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="edit-content" required>Full Content</Label>
                            <textarea
                                id="edit-content"
                                className="w-full px-4 py-2.5 border border-border bg-card rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent min-h-[150px] font-mono text-sm"
                                value={formData.content}
                                onChange={(e) =>
                                    setFormData({ ...formData, content: e.target.value })
                                }
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="edit-tags">Tags (comma-separated)</Label>
                            <input
                                id="edit-tags"
                                type="text"
                                className="w-full px-4 py-2.5 border border-border bg-card rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                value={formData.tags}
                                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="edit-thumbnail">Thumbnail URL</Label>
                            <input
                                id="edit-thumbnail"
                                type="url"
                                className="w-full px-4 py-2.5 border border-border bg-card rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                value={formData.thumbnail}
                                onChange={(e) =>
                                    setFormData({ ...formData, thumbnail: e.target.value })
                                }
                            />
                        </div>
                    </div>
                    <div className="flex justify-end gap-2">
                        <Button
                            variant="outline"
                            onClick={() => setIsEditDialogOpen(false)}
                            disabled={isLoading}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleEditBlog}
                            disabled={
                                isLoading ||
                                !formData.title ||
                                !formData.excerpt ||
                                !formData.content
                            }
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                "Save Changes"
                            )}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Blog?</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete "{selectedBlog?.title}"? This action cannot
                            be undone and will remove all parts and references.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex justify-end gap-2 pt-4">
                        <Button
                            variant="outline"
                            onClick={() => setIsDeleteDialogOpen(false)}
                            disabled={isLoading}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDeleteBlog}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Deleting...
                                </>
                            ) : (
                                "Delete Blog"
                            )}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
