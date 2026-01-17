import { createContext } from "react";


export interface DashboardContextType {
  title: string;
  setTitle: (title: string) => void;
}

export const DashboardContext = createContext<DashboardContextType | undefined>(
  undefined
);


