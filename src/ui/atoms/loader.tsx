import { Loader2 } from "lucide-react";

export const Loader = ({
    className = "",

}) => {
    return (
        <div className={`flex items-center justify-center min-h-[300px] ${className}`}>
            <Loader2 className="w-8 h-8 animate-spin text-primary/50" />
        </div>
    );
};