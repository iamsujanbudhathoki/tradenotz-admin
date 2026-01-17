import { type DecodedUser } from "@/lib/auth.util";
import { createContext } from "react";

type AuthContextType = {
  user: DecodedUser | null;
};

export const AuthContext = createContext<AuthContextType>({
  user: null,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // const [user, _setUser] = useState<DecodedUser | null>(() => getValidUser());

  return (
    <AuthContext.Provider value={{ user: null }}>
      {children}
    </AuthContext.Provider>
  );
}