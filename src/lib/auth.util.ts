import { jwtDecode } from "jwt-decode";

export type DecodedUser = {
  exp: number;
  id: string
} & Record<string, any>;

export function getValidUser(): DecodedUser | null {
  const token = localStorage.getItem("token");
  if (!token) return null;

  const parts = token.split(".");
  if (parts.length !== 3) {
    localStorage.removeItem("token");
    return null;
  }

  try {
    const decoded = jwtDecode<DecodedUser>(token);

    if (decoded.exp * 1000 < Date.now()) {
      localStorage.removeItem("token");
      return null;
    }

    if (!decoded.userRole) {
      localStorage.removeItem("token");
      return null;
    }

    return decoded;
  } catch {
    localStorage.removeItem("token");
    return null;
  }
}
