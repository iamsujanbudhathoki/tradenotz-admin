import {
  loginMutation,
} from "@/api/@tanstack/react-query.gen";
import { useMutation } from "@tanstack/react-query";

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
