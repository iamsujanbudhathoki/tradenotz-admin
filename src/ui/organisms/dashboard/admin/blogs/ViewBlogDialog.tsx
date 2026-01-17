import * as Dialog from "@radix-ui/react-dialog";
import { X, Calendar, User, Tag } from "lucide-react";
import type { Blog } from "@/api";
import { Badge } from "@/ui/atoms/badge";
import { formatDate } from "@/ui/lib/date";

interface ViewBlogDialogProps {
  blog: Blog | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}


export const ViewBlogDialog = ({
  blog,
  open,
  onOpenChange,
}: ViewBlogDialogProps) => {
  if (!blog) return null;

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-50 animate-in fade-in duration-300" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl max-h-[90vh] bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 animate-in fade-in zoom-in duration-300 focus:outline-none overflow-hidden flex flex-col">
          <div className="relative p-8 flex-1 overflow-y-auto">
            <div className="flex items-center justify-between mb-6 sticky top-0 bg-white pb-4 border-b">
              <div>
                <Dialog.Title className="text-2xl font-bold text-gray-900">
                  {blog.title}
                </Dialog.Title>
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(blog.createdAt)}</span>
                  </div>
                  {blog.updatedAt !== blog.createdAt && (
                    <div className="flex items-center gap-1">
                      <span className="text-xs">
                        Updated: {formatDate(blog.updatedAt)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <Dialog.Close asChild>
                <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all duration-200">
                  <X className="w-5 h-5" />
                </button>
              </Dialog.Close>
            </div>

            <div className="space-y-6">
              {/* Meta Information */}
              <div className="flex flex-wrap items-center gap-4 pb-4 border-b">
                <div className="flex items-center gap-2">
                  <Badge variant={blog.isPublished ? "default" : "secondary"}>
                    {blog.isPublished ? "Published" : "Draft"}
                  </Badge>
                </div>
                {blog.category && (
                  <div className="flex items-center gap-2">
                    <Tag className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      {blog.category}
                    </span>
                  </div>
                )}
                {blog.author && (
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      {typeof blog.author === "object" &&
                      "fullName" in blog.author
                        ? blog.author.fullName
                        : "Admin"}
                    </span>
                  </div>
                )}
              </div>

              {/* Featured Image */}
              {blog.featuredImage && (
                <div className="w-full h-64 rounded-xl overflow-hidden bg-gray-100">
                  <img
                    src={
                      typeof blog.featuredImage === "object" &&
                      "url" in blog.featuredImage
                        ? blog.featuredImage.url
                        : ""
                    }
                    alt={blog.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Tags */}
              {blog.tags && blog.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {blog.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Content */}
              <div className="prose prose-gray max-w-none">
                <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {blog.content}
                </div>
              </div>

              {/* Slug */}
              <div className="pt-4 border-t">
                <p className="text-xs text-gray-400">
                  <span className="font-semibold">Slug:</span> {blog.slug}
                </p>
              </div>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
