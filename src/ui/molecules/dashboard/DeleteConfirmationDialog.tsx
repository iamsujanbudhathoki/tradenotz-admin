import { Button } from "@/ui/atoms/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/ui/atoms/dialog";
import { AlertCircle, Trash2, Loader2 } from "lucide-react";

interface DeleteConfirmationDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => void;
    title?: string;
    description?: string;
    confirmLabel?: string;
    isPending?: boolean;
}

export const DeleteConfirmationDialog: React.FC<DeleteConfirmationDialogProps> = ({
    isOpen,
    onOpenChange,
    onConfirm,
    title = "Confirm Deletion",
    description = "This action cannot be undone. Are you sure you want to permanently delete this item?",
    confirmLabel = "Delete",
    isPending = false,
}) => {
    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-[400px] p-6 shadow-xl">
                <DialogHeader className="space-y-3">
                    <div className="flex items-center gap-2 text-red-600">
                        <AlertCircle className="w-5 h-5" />
                        <DialogTitle className="text-xl font-bold tracking-tight">
                            {title}
                        </DialogTitle>
                    </div>
                    <DialogDescription className="text-[15px] leading-relaxed text-muted-foreground mr-4">
                        {description}
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter className="mt-6 flex flex-col sm:flex-row gap-2">
                   <Button
  variant="ghost"
  onClick={() => onOpenChange(false)}
  disabled={isPending}
  className="
    flex-1 font-medium
    text-foreground
    hover:bg-muted
    hover:text-foreground
  "
>
  Cancel
</Button>

                    <Button
                        variant="destructive"
                        onClick={onConfirm}
                        disabled={isPending}
                        className="flex-1 bg-red-600 hover:bg-red-700 font-semibold gap-2 shadow-sm"
                    >
                        {isPending ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin text-white/80" />
                                <span>Deleting...</span>
                            </>
                        ) : (
                            <>
                                <Trash2 className="w-4 h-4" />
                                <span>{confirmLabel}</span>
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
