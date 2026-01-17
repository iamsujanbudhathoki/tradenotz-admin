import { DashboardContext } from "@/context/DashboardContext";
import { Button } from "@/ui/atoms/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/ui/atoms/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/ui/atoms/dialog";
import { Label } from "@/ui/atoms/label";
import { Link, useNavigate, useParams } from "@tanstack/react-router";
import {
    ArrowLeft,
    BookOpen,
    Loader2,
    Save,
} from "lucide-react";
import { useContext, useEffect, useState } from "react";

type BlogForm = {
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    thumbnail: string;
    tags: string;
    isPublished: boolean;
};

export function BlogEditorPage() {
    const dashboardContext = useContext(DashboardContext);
    const setTitle = dashboardContext?.setTitle;
    const navigate = useNavigate();

    // Try to get blogId from params, will be undefined for /new route
    let blogId: string | undefined;
    try {
        const params = useParams({ from: "/dashboard/blogs/$blogId/edit" });
        blogId = params.blogId;
    } catch {
        // We're on /new route, no params
        blogId = undefined;
    }

    const isEditMode = blogId !== undefined && blogId !== "new";
    const [isLoading, setIsLoading] = useState(false);
    const [showPublishConfirm, setShowPublishConfirm] = useState(false);
    const [formData, setFormData] = useState<BlogForm>({
        title: "",
        slug: "",
        excerpt: "",
        content: "",
        thumbnail: "",
        tags: "",
        isPublished: false,
    });

    useEffect(() => {
        setTitle?.(isEditMode ? "Edit Blog" : "New Blog");

        if (isEditMode && blogId !== "new") {
            // TODO: Load blog data from API
            // Mock data for now
            setFormData({
                title: "Understanding Support and Resistance",
                slug: "understanding-support-resistance",
                excerpt: "Learn the fundamentals of support and resistance levels",
                content: "# Understanding Support and Resistance\n\nIn trading, support and resistance levels are crucial...",
                thumbnail: "",
                tags: "basics, technical-analysis",
                isPublished: false,
            });
        }
    }, [setTitle, isEditMode, blogId]);

    const generateSlug = (title: string) => {
        return title
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, "")
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-")
            .trim();
    };

    const handleSave = async (publish: boolean = false) => {
        if (publish && !showPublishConfirm) {
            setShowPublishConfirm(true);
            return;
        }

        setIsLoading(true);
        // TODO: API call to save blog
        setTimeout(() => {
            setFormData({ ...formData, isPublished: publish });
            setIsLoading(false);
            setShowPublishConfirm(false);
            navigate({ to: "/dashboard/blogs" });
        }, 1000);
    };

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link to="/dashboard/blogs">
                        <Button variant="outline" size="sm">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back
                        </Button>
                    </Link>
                    <div>
                        <h2 className="text-2xl font-semibold text-foreground flex items-center gap-2">
                            <BookOpen className="w-6 h-6 text-primary" />
                            {isEditMode ? "Edit Blog" : "Create New Blog"}
                        </h2>
                        <p className="text-muted-foreground text-sm mt-1">
                            Write and format your trading article
                        </p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        onClick={() => handleSave(false)}
                        disabled={isLoading || !formData.title || !formData.content}
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save className="w-4 h-4 mr-2" />
                                Save Draft
                            </>
                        )}
                    </Button>
                    <Button
                        onClick={() => handleSave(true)}
                        disabled={isLoading || !formData.title || !formData.content}
                        className="bg-primary hover:bg-primary/90"
                    >
                        Publish Blog
                    </Button>
                </div>
            </div>

            {/* Blog Details */}
            <Card>
                <CardHeader>
                    <CardTitle>Blog Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="title" required>
                                Blog Title
                            </Label>
                            <input
                                id="title"
                                type="text"
                                className="w-full px-4 py-2.5 border border-border bg-card rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-lg font-medium"
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

                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="slug" required>
                                URL Slug
                            </Label>
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

                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="excerpt" required>
                                Excerpt
                            </Label>
                            <textarea
                                id="excerpt"
                                className="w-full px-4 py-2.5 border border-border bg-card rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent min-h-[80px]"
                                placeholder="Brief summary of your blog post..."
                                value={formData.excerpt}
                                onChange={(e) =>
                                    setFormData({ ...formData, excerpt: e.target.value })
                                }
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="tags">Tags (comma-separated)</Label>
                            <input
                                id="tags"
                                type="text"
                                className="w-full px-4 py-2.5 border border-border bg-card rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                placeholder="e.g., basics, strategy, risk-management"
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
                </CardContent>
            </Card>

            {/* Content Editor */}
            <Card>
                <CardHeader>
                    <CardTitle>Blog Content</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        <Label htmlFor="content" required>
                            Article Content (Markdown supported)
                        </Label>
                        <textarea
                            id="content"
                            className="w-full px-4 py-3 border border-border bg-card rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent min-h-[500px] font-mono text-sm"
                            placeholder="# Your Article Title&#10;&#10;Write your article here using markdown formatting...&#10;&#10;## Subheading&#10;&#10;Your content with **bold**, *italic*, and [links](https://example.com)"
                            value={formData.content}
                            onChange={(e) =>
                                setFormData({ ...formData, content: e.target.value })
                            }
                        />
                        <div className="bg-muted border border-border rounded-lg p-3 mt-2">
                            <p className="text-xs text-muted-foreground font-medium mb-2">
                                Markdown Quick Reference:
                            </p>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-muted-foreground font-mono">
                                <span># Heading 1</span>
                                <span>## Heading 2</span>
                                <span>**bold**</span>
                                <span>*italic*</span>
                                <span>[link](url)</span>
                                <span>- list item</span>
                                <span>```code```</span>
                                <span>&gt; quote</span>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Bottom Actions */}
            <div className="flex justify-end gap-2 pb-8">
                <Link to="/dashboard/blogs">
                    <Button variant="outline">Cancel</Button>
                </Link>
                <Button
                    variant="outline"
                    onClick={() => handleSave(false)}
                    disabled={isLoading || !formData.title || !formData.content}
                >
                    Save Draft
                </Button>
                <Button
                    onClick={() => handleSave(true)}
                    disabled={isLoading || !formData.title || !formData.content}
                    className="bg-primary hover:bg-primary/90"
                >
                    Publish Blog
                </Button>
            </div>

            {/* Publish Blog Confirmation Dialog */}
            <Dialog open={showPublishConfirm} onOpenChange={setShowPublishConfirm}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Publish Blog?</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to publish this blog article? It will be visible to all readers.
                            Make sure the content is complete and reviewed.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setShowPublishConfirm(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            className="bg-primary hover:bg-primary/90"
                            onClick={() => handleSave(true)}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Publishing...
                                </>
                            ) : (
                                "Publish Blog"
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
