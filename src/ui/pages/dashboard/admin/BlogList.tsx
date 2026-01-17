import { useEffect, useState } from "react";
import { Card, CardContent } from "@/ui/atoms/card";
import { useBlog } from "@/query/useBlog";
import { CreateBlogDialog } from "@/ui/organisms/dashboard/admin/blogs/CreateBlogDialog";
import { ViewBlogDialog } from "@/ui/organisms/dashboard/admin/blogs/ViewBlogDialog";
import { EditBlogDialog } from "@/ui/organisms/dashboard/admin/blogs/EditBlogDialog";
import { Badge } from "@/ui/atoms/badge";
import { Input } from "@/ui/atoms/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/ui/atoms/table";




import { Pencil, Trash2, Eye, Search } from "lucide-react";
import { Button } from "@/ui/atoms/button";
import { useDashboard } from "@/hooks/useContext";
import { useQuery } from "@tanstack/react-query";
import { getBlogsOptions } from "@/api/@tanstack/react-query.gen";
import { Loader } from "@/ui/atoms/loader";
import type { Blog } from "@/api";
import { formatDate } from "@/ui/lib/date";
import { DeleteConfirmationDialog } from "@/ui/molecules/dashboard/DeleteConfirmationDialog";

const BlogList = () => {
  const { setTitle } = useDashboard();
  const { deleteBlog } = useBlog();
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState<string | null>(null);

  const { data: blogsResponse, isLoading } = useQuery({
    ...getBlogsOptions({
      query: {
        search: debouncedSearch || undefined,
      },
    }),
  });

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 1000);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    setTitle("Blog Management");
  }, [setTitle]);

  const handleDelete = (id: string) => {
    setBlogToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (blogToDelete) {
      try {
        await deleteBlog.mutateAsync({ path: { id: blogToDelete } });
        setDeleteDialogOpen(false);
        setBlogToDelete(null);
      } catch (error) {
        // Error handling is likely inside mutateAsync/toast
      }
    }
  };

  const handleView = (blog: Blog) => {
    setSelectedBlog(blog);
    setIsViewDialogOpen(true);
  };

  const handleEdit = (blog: Blog) => {
    setSelectedBlog(blog);
    setIsEditDialogOpen(true);
  };

  const blogs = blogsResponse?.data || [];

  const filteredBlogs = blogs.filter((blog: any) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      blog.title?.toLowerCase().includes(searchLower) ||
      blog.category?.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by title or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <CreateBlogDialog />
      </div>

      <Card>
        <CardContent className="p-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Created Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="p-0">
                    <Loader />
                  </TableCell>
                </TableRow>
              ) : blogs.length > 0 ? (
                filteredBlogs.length > 0 ? (
                  filteredBlogs.map((blog: any) => (
                    <TableRow key={blog.id}>
                      <TableCell className="font-medium">
                        {blog.title}
                      </TableCell>
                      <TableCell>{blog.category || "Uncategorized"}</TableCell>
                      <TableCell>
                        <Badge
                          variant={blog.isPublished ? "default" : "secondary"}
                        >
                          {blog.isPublished ? "Published" : "Draft"}
                        </Badge>
                      </TableCell>
                      <TableCell>Admin</TableCell>
                      <TableCell>{formatDate(blog.createdAt)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleView(blog)}
                            title="View blog"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(blog)}
                            title="Edit blog"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(blog.id)}
                            title="Delete blog"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <p className="text-muted-foreground font-medium">
                          No blogs match your search
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Try adjusting your search terms.
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <p className="text-muted-foreground font-medium">
                        No blog posts found
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Create your first blog post to get started.
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* View Blog Dialog */}
      <ViewBlogDialog
        blog={selectedBlog}
        open={isViewDialogOpen}
        onOpenChange={setIsViewDialogOpen}
      />

      {/* Edit Blog Dialog */}
      <EditBlogDialog
        blog={selectedBlog}
        open={isEditDialogOpen}
        onOpenChange={(open) => {
          setIsEditDialogOpen(open);
          if (!open) {
            setSelectedBlog(null);
          }
        }}
      />

      <DeleteConfirmationDialog
        isOpen={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        title="Delete Blog Post"
        description="Are you sure you want to delete this blog post? This action cannot be undone."
        isPending={deleteBlog.isPending}
      />
    </div>
  );
};

export default BlogList;
