import {
  loginMutation,
  createAgentMutation,
  updateAgentMutation,
  deleteAgentMutation,
  getAllUsersOptions,
} from "@/api/@tanstack/react-query.gen";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

// Admin login mutation
export const useAdminLoginMutation = () => {
  return useMutation({
    ...loginMutation(),
    onSuccess: (data) => {
      console.log("Admin login successful", data);
      // Cookies are set by backend, no need to store token manually
    },
    onError: (error) => {
      console.log("Admin login error", error);
      // show toast
    },
  });
};

// Create agent mutation
export const useCreateAgentMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    ...createAgentMutation(),
    onSuccess: () => {
      // Invalidate all getAllUsers queries regardless of parameters
      queryClient.invalidateQueries(getAllUsersOptions());
      toast.success("Agent created successfully!");
    },
    onError: (error: any) => {
      console.error("Failed to create agent:", error);
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to create agent. Please try again.";
      toast.error(errorMessage);
    },
  });
};

// Update agent mutation
export const useUpdateAgentMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    ...updateAgentMutation(),
    onSuccess: () => {
      queryClient.invalidateQueries(getAllUsersOptions());
      toast.success("Agent updated successfully!");
    },
    onError: (error: any) => {
      console.error("Failed to update agent:", error);
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to update agent. Please try again.";
      toast.error(errorMessage);
    },
  });
};

// Delete agent mutation
export const useDeleteAgentMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    ...deleteAgentMutation(),
    onSuccess: () => {
      queryClient.invalidateQueries(getAllUsersOptions());
      toast.success("Agent deleted successfully!");
    },
    onError: (error: any) => {
      console.error("Failed to delete agent:", error);
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to delete agent. Please try again.";
      toast.error(errorMessage);
    },
  });
};
