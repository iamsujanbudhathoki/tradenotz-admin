import type { ResponseInterfaceAny } from "@/api";
import { getValidUser, type DecodedUser } from "@/lib/auth.util";
import { useGetMe } from "@/query/useAuth";
import type { QueryObserverResult, RefetchOptions } from "@tanstack/react-query";
import { createContext, useState } from "react";

type AuthContextType = {
  user: DecodedUser | null;
  fullUserDetails: any | null;
  isLoading: boolean;
  refetch?: (options?: RefetchOptions | undefined) => Promise<QueryObserverResult<ResponseInterfaceAny, Error>>
  isError?: any 

};

export const AuthContext = createContext<AuthContextType>({
  user: null,
  fullUserDetails: null,
  isLoading: false,

});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, _setUser] = useState<DecodedUser | null>(() => getValidUser());


  const {
    data,
    isLoading,
    refetch,
    isError
  } = useGetMe()

  const fullUserDetails = data?.data


  return (
    <AuthContext.Provider value={{ user, fullUserDetails, isLoading, refetch, isError }}>
      {children}
    </AuthContext.Provider>
  );
}