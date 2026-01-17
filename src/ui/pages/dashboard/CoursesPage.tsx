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
    Edit,
    Loader2,
    PlaySquare,
    Plus,
    Trash2,
} from "lucide-react";
import { useContext, useEffect, useState } from "react";

// Types for Course
type CourseLesson = {
    id: string;
    title: string;
    videoUrl: string;
    duration: string;
    order: number;
};

type Course = {
    id: string;
    title: string;
    description: string;
    thumbnail?: string;
    lessons: CourseLesson[];
    isPublished: boolean;
    createdAt: string;
    updatedAt: string;
};

export function CoursesPage() {
    const dashboardContext = useContext(DashboardContext);
    const setTitle = dashboardContext?.setTitle;
    const [courses, setCourses] = useState<Course[]>([]);
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        thumbnail: "",
    });

    useEffect(() => {
        setTitle?.("Courses");
        // TODO: Fetch courses from API
        loadMockData();
    }, [setTitle]);

    const loadMockData = () => {
        // Mock data for now
        const mockCourses: Course[] = [
            {
                id: "1",
                title: "Trading Basics for Beginners",
                description: "Learn the fundamentals of trading from scratch",
                thumbnail: "",
                lessons: [
                    {
                        id: "l1",
                        title: "Introduction to Trading",
                        videoUrl: "",
                        duration: "10:30",
                        order: 1,
                    },
                    {
                        id: "l2",
                        title: "Understanding Market Charts",
                        videoUrl: "",
                        duration: "15:45",
                        order: 2,
                    },
                ],
                isPublished: true,
                createdAt: "2026-01-10",
                updatedAt: "2026-01-15",
            },
            {
                id: "2",
                title: "Advanced Trading Strategies",
                description: "Master advanced techniques and strategies",
                thumbnail: "",
                lessons: [],
                isPublished: false,
                createdAt: "2026-01-12",
                updatedAt: "2026-01-16",
            },
        ];
        setCourses(mockCourses);
    };

    const handleCreateCourse = () => {
        setIsLoading(true);
        // TODO: API call to create course
        setTimeout(() => {
            const newCourse: Course = {
                id: Date.now().toString(),
                ...formData,
                lessons: [],
                isPublished: false,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };
            setCourses([...courses, newCourse]);
            setIsLoading(false);
            setIsCreateDialogOpen(false);
            setFormData({ title: "", description: "", thumbnail: "" });
        }, 500);
    };

    const handleEditCourse = () => {
        if (!selectedCourse) return;
        setIsLoading(true);
        // TODO: API call to update course
        setTimeout(() => {
            setCourses(
                courses.map((c) =>
                    c.id === selectedCourse.id
                        ? { ...c, ...formData, updatedAt: new Date().toISOString() }
                        : c
                )
            );
            setIsLoading(false);
            setIsEditDialogOpen(false);
            setSelectedCourse(null);
            setFormData({ title: "", description: "", thumbnail: "" });
        }, 500);
    };

    const handleDeleteCourse = () => {
        if (!selectedCourse) return;
        setIsLoading(true);
        // TODO: API call to delete course
        setTimeout(() => {
            setCourses(courses.filter((c) => c.id !== selectedCourse.id));
            setIsLoading(false);
            setIsDeleteDialogOpen(false);
            setSelectedCourse(null);
        }, 500);
    };

    const openEditDialog = (course: Course) => {
        setSelectedCourse(course);
        setFormData({
            title: course.title,
            description: course.description,
            thumbnail: course.thumbnail || "",
        });
        setIsEditDialogOpen(true);
    };

    const openDeleteDialog = (course: Course) => {
        setSelectedCourse(course);
        setIsDeleteDialogOpen(true);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-semibold text-foreground">Manage Courses</h2>
                    <p className="text-muted-foreground text-sm mt-1">
                        Create and manage your trading course playlists
                    </p>
                </div>
                <Button
                    onClick={() => setIsCreateDialogOpen(true)}
                    className="bg-primary hover:bg-primary/90"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    New Course
                </Button>
            </div>

            {/* Courses Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map((course) => (
                    <Card key={course.id} className="shadow-card hover:shadow-card-hover transition-smooth">
                        <CardHeader>
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-2">
                                    <PlaySquare className="w-5 h-5 text-primary" />
                                    <CardTitle className="text-lg">{course.title}</CardTitle>
                                </div>
                                <span
                                    className={`px-2 py-1 rounded-full text-xs font-medium ${course.isPublished
                                        ? "status-success"
                                        : "status-neutral"
                                        }`}
                                >
                                    {course.isPublished ? "Published" : "Draft"}
                                </span>
                            </div>
                            <CardDescription className="line-clamp-2">
                                {course.description}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between text-sm text-muted-foreground">
                                <span>{course.lessons.length} lessons</span>
                                <span>Updated {new Date(course.updatedAt).toLocaleDateString()}</span>
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="flex-1"
                                    onClick={() => openEditDialog(course)}
                                >
                                    <Edit className="w-4 h-4 mr-1" />
                                    Edit
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-destructive hover:text-destructive flex-1"
                                    onClick={() => openDeleteDialog(course)}
                                >
                                    <Trash2 className="w-4 h-4 mr-1" />
                                    Delete
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}

                {courses.length === 0 && (
                    <div className="col-span-full flex flex-col items-center justify-center py-12">
                        <PlaySquare className="w-12 h-12 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-medium text-foreground mb-2">No courses yet</h3>
                        <p className="text-muted-foreground text-sm mb-4">
                            Get started by creating your first course
                        </p>
                        <Button onClick={() => setIsCreateDialogOpen(true)}>
                            <Plus className="w-4 h-4 mr-2" />
                            Create Course
                        </Button>
                    </div>
                )}
            </div>

            {/* Create Course Dialog */}
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Create New Course</DialogTitle>
                        <DialogDescription>
                            Add a new course to your trading education platform
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="title" required>Course Title</Label>
                            <input
                                id="title"
                                type="text"
                                className="w-full px-4 py-2.5 border border-border bg-card rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                placeholder="e.g., Trading Basics for Beginners"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description" required>Description</Label>
                            <textarea
                                id="description"
                                className="w-full px-4 py-2.5 border border-border bg-card rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent min-h-[100px]"
                                placeholder="Describe what students will learn..."
                                value={formData.description}
                                onChange={(e) =>
                                    setFormData({ ...formData, description: e.target.value })
                                }
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
                            onClick={handleCreateCourse}
                            disabled={isLoading || !formData.title || !formData.description}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Creating...
                                </>
                            ) : (
                                "Create Course"
                            )}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Edit Course Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Course</DialogTitle>
                        <DialogDescription>
                            Update your course information
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="edit-title" required>Course Title</Label>
                            <input
                                id="edit-title"
                                type="text"
                                className="w-full px-4 py-2.5 border border-border bg-card rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-description" required>Description</Label>
                            <textarea
                                id="edit-description"
                                className="w-full px-4 py-2.5 border border-border bg-card rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent min-h-[100px]"
                                value={formData.description}
                                onChange={(e) =>
                                    setFormData({ ...formData, description: e.target.value })
                                }
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
                            onClick={handleEditCourse}
                            disabled={isLoading || !formData.title || !formData.description}
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
                        <DialogTitle>Delete Course?</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete "{selectedCourse?.title}"? This action cannot
                            be undone and will remove all lessons in this course.
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
                            onClick={handleDeleteCourse}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Deleting...
                                </>
                            ) : (
                                "Delete Course"
                            )}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
