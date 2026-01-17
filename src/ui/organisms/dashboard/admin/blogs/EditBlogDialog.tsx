import { useState, useEffect } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Button } from "@/ui/atoms/button";
import { Input } from "@/ui/atoms/input";
import { useBlog } from "@/query/useBlog";
import { X } from "lucide-react";
import type { Blog } from "@/api";
import toast from "react-hot-toast";
import { Label } from "@/ui/atoms/label";

interface EditBlogDialogProps {
  blog: Blog | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const EditBlogDialog = ({
  blog,
  open,
  onOpenChange,
}: EditBlogDialogProps) => {
  const { updateBlog } = useBlog();
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    isPublished: false,
    tags: [] as string[],
  });
  const [tagInput, setTagInput] = useState("");

  useEffect(() => {
    if (blog) {
      setFormData({
        title: blog.title || "",
        content: blog.content || "",
        isPublished: blog.isPublished || false,
        tags: blog.tags || [],
      });
    }
  }, [blog]);

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()],
      });
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((tag) => tag !== tagToRemove),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!blog) return;

    try {
      const slug = generateSlug(formData.title);

      await updateBlog.mutateAsync({
        path: { id: blog.id },
        body: {
          ...formData,
          slug,
        },
      });

      toast.success("Blog updated successfully");
      onOpenChange(false);
      setFormData({
        title: "",
        content: "",
        isPublished: false,
        tags: [],
      });
    } catch (error: any) {
      toast.error(error?.message || "Failed to update blog");
    }
  };

  if (!blog) return null;

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-50 animate-in fade-in duration-300" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 animate-in fade-in zoom-in duration-300 focus:outline-none overflow-hidden max-h-[90vh] overflow-y-auto">
          <div className="relative p-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <Dialog.Title className="text-2xl font-bold text-gray-900">
                  Edit Blog Post
                </Dialog.Title>
                <Dialog.Description className="text-gray-500 mt-1">
                  Update the blog post details below.
                </Dialog.Description>
              </div>
              <Dialog.Close asChild>
                <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all duration-200">
                  <X className="w-5 h-5" />
                </button>
              </Dialog.Close>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-gray-700">
                    Title
                  </Label>
                  <Input
                    placeholder="Enter blog title"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    required
                    className="focus:ring-primary/10 border-gray-200"
                  />
                </div>

              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold text-gray-700">
                  Content
                </Label>
                <textarea
                  className="w-full min-h-[250px] p-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all resize-none text-gray-700 leading-relaxed"
                  placeholder="Write your blog content here..."
                  value={formData.content}
                  onChange={(e) =>
                    setFormData({ ...formData, content: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold text-gray-700">
                  Tags
                </Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add a tag and press Enter"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddTag();
                      }
                    }}
                    className="focus:ring-primary/10 border-gray-200"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleAddTag}
                    disabled={!tagInput.trim()}
                  >
                    Add
                  </Button>
                </div>
                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.tags.map((tag, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-full text-sm"
                      >
                        <span>{tag}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="ml-1 text-gray-500 hover:text-gray-700"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
                <input
                  type="checkbox"
                  id="isPublished"
                  checked={formData.isPublished}
                  onChange={(e) =>
                    setFormData({ ...formData, isPublished: e.target.checked })
                  }
                  className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary/20 transition-all cursor-pointer"
                />
                <Label
                  htmlFor="isPublished"
                  className="text-sm font-medium text-gray-700 cursor-pointer select-none"
                >
                  Publish immediately to your blog
                </Label>
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
                <Dialog.Close asChild>
                  <Button variant="ghost" className="px-6">
                    Cancel
                  </Button>
                </Dialog.Close>
                <Button
                  type="submit"
                  disabled={updateBlog.isPending}
                  className="px-8 bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 transition-all duration-200 active:scale-95"
                >
                  {updateBlog.isPending ? "Updating..." : "Update Post"}
                </Button>
              </div>
            </form>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
