import {
  getMeOptions,
  loginMutation,
  logoutMutation
} from "@/api/@tanstack/react-query.gen";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useLoginMutation = () => {
  return useMutation({
    ...loginMutation(),
    onSuccess: (data) => {
      console.log("data", data);
    },
    onError: (error) => {
      console.log("error", error);
    },
  });
};


// Get current user profile
export const useGetMe = (): any => {
  const token = localStorage.getItem("token");
  return useQuery({
    ...getMeOptions(),
    enabled: !!token,
  });
};



// Logout user
export const useLogoutMutation = () => {
  return useMutation({
    ...logoutMutation(),
    onSuccess: (data) => {
      console.log("Logged out successfully", data);
    },
    onError: (error) => {
      console.log("error", error);
    },
  });
};

