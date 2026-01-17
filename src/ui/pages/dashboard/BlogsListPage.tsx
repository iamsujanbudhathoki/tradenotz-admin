import { DashboardContext } from "@/context/DashboardContext";
import { Button } from "@/ui/atoms/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/ui/atoms/card";
import { Link } from "@tanstack/react-router";
import {
    BookOpen,
    Edit,
    Link2,
    Plus,
    Trash2,
} from "lucide-react";
import { useContext, useEffect, useState } from "react";

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
    references: BlogReference[];
    isPublished: boolean;
    createdAt: string;
    updatedAt: string;
};

export function BlogsListPage() {
    const dashboardContext = useContext(DashboardContext);
    const setTitle = dashboardContext?.setTitle;
    const [blogs, setBlogs] = useState<Blog[]>([]);

    useEffect(() => {
        setTitle?.("Blogs");
        loadMockData();
    }, [setTitle]);

    const loadMockData = () => {
        const mockBlogs: Blog[] = [
            {
                id: "1",
                title: "Understanding Support and Resistance",
                slug: "understanding-support-resistance",
                excerpt: "Learn the fundamentals of support and resistance levels",
                content: "# Understanding Support and Resistance\n\nSupport and resistance...",
                thumbnail: "",
                tags: ["basics", "technical-analysis"],
                references: [],
                isPublished: true,
                createdAt: "2026-01-10",
                updatedAt: "2026-01-15",
            },
            {
                id: "2",
                title: "Risk Management Essentials",
                slug: "risk-management-essentials",
                excerpt: "Master the key principles of risk management in trading",
                content: "# Risk Management\n\nRisk management is crucial...",
                thumbnail: "",
                tags: ["strategy", "risk"],
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

    const handleDelete = (id: string) => {
        if (confirm("Are you sure you want to delete this blog?")) {
            setBlogs(blogs.filter((b) => b.id !== id));
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-semibold text-foreground">Blogs</h2>
                    <p className="text-muted-foreground text-sm mt-1">
                        Trading articles with rich text and cross-references
                    </p>
                </div>
                <Link to="/dashboard/blogs/new">
                    <Button className="bg-primary hover:bg-primary/90">
                        <Plus className="w-4 h-4 mr-2" />
                        New Blog
                    </Button>
                </Link>
            </div>

            {/* Blogs Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {blogs.map((blog) => (
                    <Card
                        key={blog.id}
                        className="shadow-card hover:shadow-card-hover transition-smooth"
                    >
                        <CardHeader>
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-2 flex-1">
                                    <BookOpen className="w-5 h-5 text-primary flex-shrink-0" />
                                    <CardTitle className="text-lg line-clamp-1">
                                        {blog.title}
                                    </CardTitle>
                                </div>
                                <span
                                    className={`px-2 py-1 rounded-full text-xs font-medium ml-2 ${blog.isPublished ? "status-success" : "status-neutral"
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
                                <Link
                                    to={`/dashboard/blogs/${blog.id}/edit`}
                                    className="flex-1"
                                >
                                    <Button variant="outline" size="sm" className="w-full">
                                        <Edit className="w-4 h-4 mr-1" />
                                        Edit
                                    </Button>
                                </Link>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-destructive hover:text-destructive flex-1"
                                    onClick={() => handleDelete(blog.id)}
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
                        <h3 className="text-lg font-medium text-foreground mb-2">
                            No blogs yet
                        </h3>
                        <p className="text-muted-foreground text-sm mb-4">
                            Start writing your first trading article
                        </p>
                        <Link to="/dashboard/blogs/new">
                            <Button>
                                <Plus className="w-4 h-4 mr-2" />
                                Create Blog
                            </Button>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
