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
    BookText,
    Edit,
    Plus,
    Trash2,
} from "lucide-react";
import { useContext, useEffect, useState } from "react";

// Types for Course (Text-based like Educative.io)
type CourseLesson = {
    id: string;
    title: string;
    content: string; // Rich text content
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

export function CoursesListPage() {
    const dashboardContext = useContext(DashboardContext);
    const setTitle = dashboardContext?.setTitle;
    const [courses, setCourses] = useState<Course[]>([]);

    useEffect(() => {
        setTitle?.("Courses");
        loadMockData();
    }, [setTitle]);

    const loadMockData = () => {
        const mockCourses: Course[] = [
            {
                id: "1",
                title: "Trading Fundamentals",
                description: "Learn the core concepts of trading from beginner to advanced",
                thumbnail: "",
                lessons: [
                    {
                        id: "l1",
                        title: "Introduction to Trading",
                        content: "Welcome to trading fundamentals...",
                        order: 1,
                    },
                    {
                        id: "l2",
                        title: "Understanding Markets",
                        content: "Markets are places where...",
                        order: 2,
                    },
                    {
                        id: "l3",
                        title: "Technical Analysis Basics",
                        content: "Technical analysis involves...",
                        order: 3,
                    },
                ],
                isPublished: true,
                createdAt: "2026-01-10",
                updatedAt: "2026-01-15",
            },
            {
                id: "2",
                title: "Risk Management Mastery",
                description: "Master the art of managing risk in your trading",
                thumbnail: "",
                lessons: [
                    {
                        id: "l1",
                        title: "Why Risk Management Matters",
                        content: "Risk management is crucial...",
                        order: 1,
                    },
                ],
                isPublished: false,
                createdAt: "2026-01-12",
                updatedAt: "2026-01-16",
            },
        ];
        setCourses(mockCourses);
    };

    const handleDelete = (id: string) => {
        if (confirm("Are you sure you want to delete this course?")) {
            setCourses(courses.filter((c) => c.id !== id));
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-semibold text-foreground">Courses</h2>
                    <p className="text-muted-foreground text-sm mt-1">
                        Text-based learning paths with structured lessons
                    </p>
                </div>
                <Link to="/dashboard/courses/new">
                    <Button className="bg-primary hover:bg-primary/90">
                        <Plus className="w-4 h-4 mr-2" />
                        New Course
                    </Button>
                </Link>
            </div>

            {/* Courses Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map((course) => (
                    <Card
                        key={course.id}
                        className="group shadow-sm hover:shadow-card-hover transition-all duration-300 hover:scale-[1.01] hover:-translate-y-1 bg-card/50 backdrop-blur-sm border-border/60"
                    >
                        <CardHeader className="pb-3">
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                                        <BookText className="w-5 h-5 text-primary" />
                                    </div>
                                    <CardTitle className="text-lg line-clamp-1 group-hover:text-primary transition-colors">{course.title}</CardTitle>
                                </div>
                                <span
                                    className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${course.isPublished
                                        ? "bg-green-50 text-green-700 border-green-200"
                                        : "bg-slate-50 text-slate-700 border-slate-200"
                                        }`}
                                >
                                    {course.isPublished ? "Published" : "Draft"}
                                </span>
                            </div>
                            <CardDescription className="line-clamp-2 mt-2 text-muted-foreground/80">
                                {course.description}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4 pt-0">
                            <div className="flex items-center justify-between text-xs font-medium text-muted-foreground bg-secondary/30 rounded-md p-2">
                                <span>{course.lessons.length} lessons</span>
                                <span>
                                    Updated {new Date(course.updatedAt).toLocaleDateString()}
                                </span>
                            </div>
                            <div className="flex gap-2 pt-2 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-200">
                                <Link
                                    to={`/dashboard/courses/${course.id}/edit`}
                                    className="flex-1"
                                >
                                    <Button variant="outline" size="sm" className="w-full hover:border-primary/50 hover:bg-primary/5 hover:text-primary transition-colors">
                                        <Edit className="w-4 h-4 mr-2" />
                                        Edit
                                    </Button>
                                </Link>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-destructive hover:text-destructive hover:border-destructive/50 hover:bg-destructive/5 flex-1 transition-colors"
                                    onClick={() => handleDelete(course.id)}
                                >
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Delete
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}

                {courses.length === 0 && (
                    <div className="col-span-full flex flex-col items-center justify-center py-12">
                        <BookText className="w-12 h-12 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-medium text-foreground mb-2">
                            No courses yet
                        </h3>
                        <p className="text-muted-foreground text-sm mb-4">
                            Create your first text-based learning course
                        </p>
                        <Link to="/dashboard/courses/new">
                            <Button>
                                <Plus className="w-4 h-4 mr-2" />
                                Create Course
                            </Button>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
