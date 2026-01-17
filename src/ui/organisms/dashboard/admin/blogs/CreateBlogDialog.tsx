import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from "@/ui/atoms/dialog";
import { Button } from "@/ui/atoms/button";
import { Input } from "@/ui/atoms/input";
import { useBlog } from "@/query/useBlog";
import { Loader2 } from "lucide-react";
import { Label } from "@/ui/atoms/label";

type BlogFormData = {
  title: string;
  content: string;
  category: string;
  isPublished: boolean;
};

export const CreateBlogDialog = () => {
  const [open, setOpen] = useState(false);
  const { createBlog } = useBlog();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BlogFormData>({
    defaultValues: {
      title: "",
      content: "",
      category: "",
      isPublished: false,
    },
  });

  // Reset form when dialog opens
  useEffect(() => {
    if (open) reset();
  }, [open, reset]);

  const generateSlug = (title: string) =>
    title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");

  const onSubmit = async (data: BlogFormData) => {
    try {
      const slug = generateSlug(data.title);

      await createBlog.mutateAsync({
        body: {
          ...data,
          slug,
        },
      });

      reset();
      setOpen(false);
    } catch {
      // error handled in mutation
    }
  };

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        Create New Blog
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          onInteractOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}
          className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                     w-full max-w-2xl bg-white rounded-2xl shadow-2xl
                     border border-gray-100 z-50 overflow-hidden
                     max-h-[90vh] overflow-y-auto focus:outline-none"
        >
          <div className="p-8">
            {/* Header */}
            <div className="mb-8">
              <DialogTitle className="text-2xl font-bold text-gray-900">
                Create New Blog Post
              </DialogTitle>
              <DialogDescription className="text-gray-500 mt-1">
                Fill in the details below to publish a new blog post.
              </DialogDescription>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Title */}
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-gray-700">
                    Title <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    {...register("title", { required: "Title is required" })}
                    placeholder="Enter blog title"
                  />
                  {errors.title && (
                    <p className="text-xs text-red-500">
                      {errors.title.message}
                    </p>
                  )}
                </div>

                {/* Category */}
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-gray-700">
                    Category
                  </Label>
                  <Input
                    {...register("category")}
                    placeholder="e.g. Construction, Real Estate"
                  />
                </div>
              </div>

              {/* Content */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">
                  Content <span className="text-red-500">*</span>
                </label>
                <textarea
                  {...register("content", { required: "Content is required" })}
                  className="w-full min-h-[250px] p-4 rounded-xl border border-gray-200
                             focus:outline-none focus:ring-4 focus:ring-primary/5
                             focus:border-primary transition-all resize-none
                             text-gray-700 leading-relaxed"
                  placeholder="Write your blog content here..."
                />
                {errors.content && (
                  <p className="text-xs text-red-500">
                    {errors.content.message}
                  </p>
                )}
              </div>

              {/* Publish */}
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
                <input
                  type="checkbox"
                  {...register("isPublished")}
                  className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary/20"
                />
                <span className="text-sm font-medium text-gray-700">
                  Publish immediately
                </span>
              </div>

              {/* Footer */}
              <DialogFooter className="flex justify-end gap-3 pt-6 border-t border-gray-100">
                <Button
                  variant="outline"
                  onClick={() => setOpen(false)}
                  disabled={createBlog.isPending}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={createBlog.isPending}>
                  {createBlog.isPending && (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  )}
                  Create Post
                </Button>
              </DialogFooter>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
