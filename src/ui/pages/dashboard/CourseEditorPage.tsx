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
import { Input } from "@/ui/atoms/input";
import { Textarea } from "@/ui/atoms/textarea";
import { Label } from "@/ui/atoms/label";
import { Link, useNavigate, useParams } from "@tanstack/react-router";
import {
    ArrowLeft,
    BookText,
    ChevronDown,
    GripVertical,
    Loader2,
    Plus,
    Save,
    Trash2,
} from "lucide-react";
import { useContext, useEffect, useState } from "react";

type CourseLesson = {
    id: string;
    title: string;
    slug: string; // URL-friendly identifier for the lesson
    excerpt: string; // Short description of the lesson
    content: string; // Full lesson content (can be very long)
    order: number;
    duration?: string; // Estimated reading time (e.g., "10 min")
    isPublished: boolean; // Each lesson can be published independently
};

type CourseForm = {
    title: string;
    description: string;
    thumbnail: string;
    lessons: CourseLesson[];
    isPublished: boolean;
};

export function CourseEditorPage() {
    const dashboardContext = useContext(DashboardContext);
    const setTitle = dashboardContext?.setTitle;
    const navigate = useNavigate();

    // Try to get courseId from params, will be undefined for /new route
    let courseId: string | undefined;
    try {
        const params = useParams({ from: "/dashboard/courses/$courseId/edit" });
        courseId = params.courseId;
    } catch {
        // We're on /new route, no params
        courseId = undefined;
    }

    const isEditMode = courseId !== undefined && courseId !== "new";
    const [isLoading, setIsLoading] = useState(false);
    const [expandedLessons, setExpandedLessons] = useState<Set<string>>(new Set());

    // Confirmation dialog states
    const [lessonToDelete, setLessonToDelete] = useState<string | null>(null);
    const [showPublishConfirm, setShowPublishConfirm] = useState(false);

    const [formData, setFormData] = useState<CourseForm>({
        title: "",
        description: "",
        thumbnail: "",
        lessons: [],
        isPublished: false,
    });

    useEffect(() => {
        setTitle?.(isEditMode ? "Edit Course" : "New Course");

        if (isEditMode && courseId !== "new") {
            // TODO: Load course data from API
            // Mock data for now
            setFormData({
                title: "Trading Fundamentals",
                description: "Learn the core concepts of trading",
                thumbnail: "",
                isPublished: false,
                lessons: [
                    {
                        id: "1",
                        title: "Introduction to Trading",
                        slug: "introduction-to-trading",
                        excerpt: "Learn the basics of trading and market fundamentals",
                        content: "# Introduction\n\nWelcome to trading fundamentals...",
                        order: 1,
                        duration: "10 min",
                        isPublished: true,
                    },
                ],
            });
        }
    }, [setTitle, isEditMode, courseId]);

    const generateSlug = (title: string) => {
        return title
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, "")
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-")
            .trim();
    };

    const toggleLesson = (lessonId: string) => {
        setExpandedLessons((prev) => {
            const next = new Set(prev);
            if (next.has(lessonId)) {
                next.delete(lessonId);
            } else {
                next.add(lessonId);
            }
            return next;
        });
    };

    const expandAll = () => {
        setExpandedLessons(new Set(formData.lessons.map((l) => l.id)));
    };

    const collapseAll = () => {
        setExpandedLessons(new Set());
    };

    const addLesson = () => {
        const newLesson: CourseLesson = {
            id: Date.now().toString(),
            title: "New Lesson",
            slug: `lesson-${formData.lessons.length + 1}`,
            excerpt: "",
            content: "",
            order: formData.lessons.length + 1,
            duration: "",
            isPublished: false,
        };
        setFormData({
            ...formData,
            lessons: [...formData.lessons, newLesson],
        });
        // Auto-expand new lesson
        setExpandedLessons((prev) => new Set([...prev, newLesson.id]));
    };

    const updateLesson = (id: string, field: keyof CourseLesson, value: string | boolean) => {
        setFormData({
            ...formData,
            lessons: formData.lessons.map((lesson) => {
                if (lesson.id === id) {
                    const updated = { ...lesson, [field]: value };
                    // Auto-update slug when title changes
                    if (field === "title" && typeof value === "string") {
                        updated.slug = generateSlug(value);
                    }
                    return updated;
                }
                return lesson;
            }),
        });
    };

    const deleteLesson = (id: string) => {
        setLessonToDelete(id);
    };

    const confirmDeleteLesson = () => {
        if (!lessonToDelete) return;
        setFormData({
            ...formData,
            lessons: formData.lessons.filter((lesson) => lesson.id !== lessonToDelete),
        });
        setLessonToDelete(null);
    };

    const handleSave = async (publish: boolean = false) => {
        if (publish && !showPublishConfirm) {
            setShowPublishConfirm(true);
            return;
        }

        setIsLoading(true);
        // TODO: API call to save course
        setTimeout(() => {
            setFormData({ ...formData, isPublished: publish });
            setIsLoading(false);
            setShowPublishConfirm(false);
            // Navigate back to list
            navigate({ to: "/dashboard/courses" });
        }, 1000);
    };

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link to="/dashboard/courses">
                        <Button variant="outline" size="sm">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back
                        </Button>
                    </Link>
                    <div>
                        <h2 className="text-2xl font-semibold text-foreground flex items-center gap-2">
                            <BookText className="w-6 h-6 text-primary" />
                            {isEditMode ? "Edit Course" : "Create New Course"}
                        </h2>
                        <p className="text-muted-foreground text-sm mt-1">
                            Text-based learning path with structured lessons
                        </p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        onClick={() => handleSave(false)}
                        disabled={isLoading || !formData.title}
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
                        disabled={isLoading || !formData.title}
                        className="bg-primary hover:bg-primary/90"
                    >
                        Publish Course
                    </Button>
                </div>
            </div>

            {/* Course Details */}
            <Card>
                <CardHeader>
                    <CardTitle>Course Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="title" required>
                            Course Title
                        </Label>
                        <Input
                            id="title"
                            type="text"
                            className="text-lg font-medium"
                            placeholder="e.g., Trading Fundamentals"
                            value={formData.title}
                            onChange={(e) =>
                                setFormData({ ...formData, title: e.target.value })
                            }
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description" required>
                            Description
                        </Label>
                        <Textarea
                            id="description"
                            className="min-h-[100px]"
                            placeholder="What will students learn in this course?"
                            value={formData.description}
                            onChange={(e) =>
                                setFormData({ ...formData, description: e.target.value })
                            }
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="thumbnail">Thumbnail URL (optional)</Label>
                        <Input
                            id="thumbnail"
                            type="url"
                            placeholder="https://example.com/image.jpg"
                            value={formData.thumbnail}
                            onChange={(e) =>
                                setFormData({ ...formData, thumbnail: e.target.value })
                            }
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Lessons */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <CardTitle>Lessons</CardTitle>
                            {formData.lessons.length > 0 && (
                                <div className="flex gap-2">
                                    <Button
                                        onClick={expandAll}
                                        size="sm"
                                        variant="ghost"
                                        className="text-xs"
                                    >
                                        Expand All
                                    </Button>
                                    <Button
                                        onClick={collapseAll}
                                        size="sm"
                                        variant="ghost"
                                        className="text-xs"
                                    >
                                        Collapse All
                                    </Button>
                                </div>
                            )}
                        </div>
                        <Button onClick={addLesson} size="sm" variant="outline">
                            <Plus className="w-4 h-4 mr-2" />
                            Add Lesson
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    {formData.lessons.length === 0 ? (
                        <div className="text-center py-8">
                            <BookText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                            <p className="text-muted-foreground text-sm">
                                No lessons yet. Add your first lesson to get started.
                            </p>
                            <Button onClick={addLesson} size="sm" className="mt-4">
                                <Plus className="w-4 h-4 mr-2" />
                                Add First Lesson
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {formData.lessons.map((lesson, index) => {
                                const isExpanded = expandedLessons.has(lesson.id);
                                return (
                                    <Card
                                        key={lesson.id}
                                        className="border-l-4 border-l-primary/30"
                                    >
                                        <CardHeader className="pb-3">
                                            <div className="flex items-start gap-3">
                                                <GripVertical className="w-5 h-5 text-muted-foreground mt-1 flex-shrink-0 cursor-move" />
                                                <div className="flex-1 space-y-3">
                                                    {/* Lesson Header */}
                                                    <div className="flex items-center justify-between gap-4">
                                                        <div className="flex items-center gap-3 flex-1">
                                                            <button
                                                                type="button"
                                                                onClick={() => toggleLesson(lesson.id)}
                                                                className="flex items-center gap-2 hover:opacity-70 transition-opacity"
                                                            >
                                                                <ChevronDown
                                                                    className={`w-4 h-4 text-muted-foreground transition-transform ${isExpanded ? "" : "-rotate-90"
                                                                        }`}
                                                                />
                                                                <span className="text-sm font-semibold text-primary bg-primary/10 px-2.5 py-1 rounded">
                                                                    #{index + 1}
                                                                </span>
                                                            </button>
                                                            <Input
                                                                type="text"
                                                                className="font-semibold text-base"
                                                                placeholder="Lesson title..."
                                                                value={lesson.title}
                                                                onChange={(e) =>
                                                                    updateLesson(lesson.id, "title", e.target.value)
                                                                }
                                                                onClick={() => {
                                                                    // Auto-expand when clicking on title input
                                                                    if (!isExpanded) {
                                                                        toggleLesson(lesson.id);
                                                                    }
                                                                }}
                                                            />
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <span
                                                                className={`px-2 py-1 rounded-full text-xs font-medium ${lesson.isPublished
                                                                    ? "status-success"
                                                                    : "status-neutral"
                                                                    }`}
                                                            >
                                                                {lesson.isPublished ? "Published" : "Draft"}
                                                            </span>
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                className="text-destructive hover:text-destructive"
                                                                onClick={() => deleteLesson(lesson.id)}
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </Button>
                                                        </div>
                                                    </div>

                                                    {/* Show metadata even when collapsed for quick view */}
                                                    {!isExpanded && lesson.excerpt && (
                                                        <p className="text-sm text-muted-foreground line-clamp-1 ml-8">
                                                            {lesson.excerpt}
                                                        </p>
                                                    )}

                                                    {/* Lesson Metadata Row - Only when expanded */}
                                                    {isExpanded && (
                                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                                            <div className="space-y-1.5">
                                                                <Label
                                                                    htmlFor={`lesson-slug-${lesson.id}`}
                                                                    className="text-xs"
                                                                >
                                                                    Slug (URL)
                                                                </Label>
                                                                <Input
                                                                    id={`lesson-slug-${lesson.id}`}
                                                                    type="text"
                                                                    className="font-mono text-xs h-8"
                                                                    placeholder="lesson-slug"
                                                                    value={lesson.slug}
                                                                    onChange={(e) =>
                                                                        updateLesson(lesson.id, "slug", e.target.value)
                                                                    }
                                                                />
                                                            </div>

                                                            <div className="space-y-1.5">
                                                                <Label
                                                                    htmlFor={`lesson-duration-${lesson.id}`}
                                                                    className="text-xs"
                                                                >
                                                                    Duration (optional)
                                                                </Label>
                                                                <Input
                                                                    id={`lesson-duration-${lesson.id}`}
                                                                    type="text"
                                                                    className="text-sm h-8"
                                                                    placeholder="e.g., 15 min"
                                                                    value={lesson.duration || ""}
                                                                    onChange={(e) =>
                                                                        updateLesson(lesson.id, "duration", e.target.value)
                                                                    }
                                                                />
                                                            </div>

                                                            <div className="space-y-1.5">
                                                                <Label className="text-xs">Status</Label>
                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        updateLesson(
                                                                            lesson.id,
                                                                            "isPublished",
                                                                            !lesson.isPublished
                                                                        )
                                                                    }
                                                                    className={`w-full px-3 py-1.5 rounded-md text-sm font-medium transition-colors h-8 flex items-center justify-center ${lesson.isPublished
                                                                        ? "bg-green-100 text-green-700 hover:bg-green-200"
                                                                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                                                        }`}
                                                                >
                                                                    {lesson.isPublished ? "Published" : "Draft"}
                                                                </button>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </CardHeader>

                                        {/* Only show full content when expanded */}
                                        {isExpanded && (
                                            <CardContent className="space-y-4 pt-3 border-t border-border">
                                                {/* Lesson Excerpt */}
                                                <div className="space-y-2">
                                                    <Label htmlFor={`lesson-excerpt-${lesson.id}`}>
                                                        Lesson Excerpt
                                                    </Label>
                                                    <Textarea
                                                        id={`lesson-excerpt-${lesson.id}`}
                                                        className="min-h-[60px] text-sm"
                                                        placeholder="Brief description of what students will learn in this lesson..."
                                                        value={lesson.excerpt}
                                                        onChange={(e) =>
                                                            updateLesson(lesson.id, "excerpt", e.target.value)
                                                        }
                                                    />
                                                </div>

                                                {/* Lesson Content */}
                                                <div className="space-y-2">
                                                    <div className="flex items-center justify-between">
                                                        <Label htmlFor={`lesson-content-${lesson.id}`}>
                                                            Lesson Content (Markdown)
                                                        </Label>
                                                        <span className="text-xs text-muted-foreground">
                                                            {lesson.content.length} characters
                                                        </span>
                                                    </div>
                                                    <Textarea
                                                        id={`lesson-content-${lesson.id}`}
                                                        className="min-h-[300px] font-mono text-sm leading-relaxed"
                                                        placeholder="# Lesson Title&#10;&#10;Write your detailed lesson content here using markdown...&#10;&#10;## Section 1&#10;Content...&#10;&#10;## Section 2&#10;More content..."
                                                        value={lesson.content}
                                                        onChange={(e) =>
                                                            updateLesson(lesson.id, "content", e.target.value)
                                                        }
                                                    />
                                                    <p className="text-xs text-muted-foreground">
                                                        💡 Tip: Use markdown for formatting - # for headings, **bold**,
                                                        *italic*, - for lists
                                                    </p>
                                                </div>
                                            </CardContent>
                                        )}
                                    </Card>
                                );
                            })}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Bottom Actions */}
            <div className="flex justify-end gap-2 pb-8">
                <Link to="/dashboard/courses">
                    <Button variant="outline">Cancel</Button>
                </Link>
                <Button
                    variant="outline"
                    onClick={() => handleSave(false)}
                    disabled={isLoading || !formData.title}
                >
                    Save Draft
                </Button>
                <Button
                    onClick={() => handleSave(true)}
                    disabled={isLoading || !formData.title}
                    className="bg-primary hover:bg-primary/90"
                >
                    Publish Course
                </Button>
            </div>

            {/* Delete Lesson Confirmation Dialog */}
            <Dialog open={!!lessonToDelete} onOpenChange={() => setLessonToDelete(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Lesson?</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete this lesson? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setLessonToDelete(null)}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={confirmDeleteLesson}
                        >
                            Delete Lesson
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Publish Course Confirmation Dialog */}
            <Dialog open={showPublishConfirm} onOpenChange={setShowPublishConfirm}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Publish Course?</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to publish this course? It will be visible to all students.
                            Make sure all lessons are complete and reviewed.
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
                                "Publish Course"
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
