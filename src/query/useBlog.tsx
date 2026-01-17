import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getBlogsOptions,
  createBlogMutation,
  updateBlogMutation,
  deleteBlogMutation,
  getPublishedBlogsOptions,
  getBlogBySlugOptions,
} from "@/api/@tanstack/react-query.gen";
import { envConfig } from "@/config/env.config";
import type { Blog } from "@/api";

export const getAllBlogs = () =>
  useQuery({
    ...getPublishedBlogsOptions({
      query: {
        limit: envConfig.API_DEFAULT_LIMIT,
        page: envConfig.API_DEFAULT_PAGE,
      },
    }),
    select: (data) => data?.data as Blog[] | null,
  });

export const getBlogBySlug = (slug: string) =>
  useQuery({
    ...getBlogBySlugOptions({
      path: {
        slug,
      },
    }),
    select: (data) => data?.data as Blog | null,
  });

export const useBlog = () => {
  const queryClient = useQueryClient();

  const useBlogs = (page?: number, limit?: number, search?: string) => {
    return useQuery({
      ...getBlogsOptions({
        query: {
          page,
          limit,
          search,
        },
      }),
    });
  };

  const createBlog = useMutation({
    ...createBlogMutation(),
    onSuccess: () => {
      queryClient.invalidateQueries(getBlogsOptions());
    },
  });

  const updateBlog = useMutation({
    ...updateBlogMutation(),
    onSuccess: () => {
      queryClient.invalidateQueries(getBlogsOptions());
    },
  });

  const deleteBlog = useMutation({
    ...deleteBlogMutation(),
    onSuccess: () => {
      queryClient.invalidateQueries(getBlogsOptions());
    },
  });

  return {
    useBlogs,
    createBlog,
    updateBlog,
    deleteBlog,
  };
};
