import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getAllMediaOptions,
  getAllMediaQueryKey,
  uploadMediaMutation,
  deleteMediaMutation,
  updateMediaMutation,
  getMediaByIdOptions,
  getMediaByIdQueryKey,
} from "@/api/@tanstack/react-query.gen";
import type { MediaEntityType } from "@/api";

/**
 * Hook for fetching all media with pagination
 */
export const useGetAllMedia = (
  page?: number,
  limit?: number,
  entityType?: MediaEntityType,
  entityId?: string
) => {
  return useQuery({
    ...getAllMediaOptions({
      query: {
        page,
        limit,
        entityType,
        entityId,
      },
    }),
  });
};

/**
 * Hook for fetching media by ID
 */
export const useGetMediaById = (mediaId: string) => {
  return useQuery({
    ...getMediaByIdOptions({
      path: {
        id: mediaId,
      },
    }),
  });
};

/**
 * Hook for uploading media
 */
export const useUploadMediaMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    ...uploadMediaMutation(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getAllMediaQueryKey() });
    },
  });
};

/**
 * Hook for updating media
 */
export const useUpdateMediaMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    ...updateMediaMutation(),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: getAllMediaQueryKey() });
      // Invalidate specific media query if entityId is provided
      if (variables.path?.id) {
        queryClient.invalidateQueries({
          queryKey: getMediaByIdQueryKey({ path: { id: variables.path.id } }),
        });
      }
    },
  });
};

/**
 * Hook for deleting media
 */
export const useDeleteMediaMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    ...deleteMediaMutation(),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: getAllMediaQueryKey() });
      // Invalidate specific media query
      if (variables.path?.id) {
        queryClient.invalidateQueries({
          queryKey: getMediaByIdQueryKey({ path: { id: variables.path.id } }),
        });
      }
    },
  });
};

