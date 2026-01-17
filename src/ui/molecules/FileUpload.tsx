import { Upload, X, FileIcon, ImageIcon } from "lucide-react";
import type { UseFormRegisterReturn, FieldError } from "react-hook-form";
import { Label } from "../atoms/label";

interface FileUploadProps {
    id: string;
    label: string;
    register: UseFormRegisterReturn;
    error?: FieldError | string;
    onChange: (files: FileList | null) => void;
    onRemove?: (index: number) => void;
    files?: File[];
    accept?: string;
    multiple?: boolean;
    required?: boolean;
    disabled?: boolean;
}

export const FileUpload = ({
    id,
    label,
    register,
    error,
    onChange,
    onRemove,
    files = [],
    accept = ".pdf,.doc,.docx,.jpg,.jpeg,.png",
    multiple = true,
    required = false,
    disabled = false,
}: FileUploadProps) => {
    const isImage = (file: File) => file.type.startsWith("image/");

    return (
        <div className="space-y-2">
            <Label
            required={required}
             htmlFor={id} className="block text-sm font-medium text-gray-700">
                {label} 
            </Label>

            <div
                className={`
                    border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200 
                    ${disabled ? 'opacity-50 cursor-not-allowed bg-gray-50 border-gray-200' : 'cursor-pointer hover:border-primary hover:bg-primary/5 border-gray-300'}
                    ${error ? 'border-red-500 bg-red-50' : ''}
                `}
            >
                <input
                    type="file"
                    id={id}
                    {...register}
                    disabled={disabled}
                    onChange={(e) => {
                        onChange(e.target.files);
                        register.onChange(e);
                    }}
                    accept={accept}
                    className="hidden"
                    multiple={multiple}
                />
                <Label
                    htmlFor={id}
                    className={`flex flex-col items-center ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                >
                    <Upload className={`w-8 h-8 mb-2 ${error ? 'text-red-400' : 'text-gray-400'}`} />
                    <span className="text-gray-600 font-medium text-sm">
                        {disabled ? "Uploading..." : "Click to upload documents"}
                    </span>
                    <span className="text-xs text-gray-400 mt-1">
                        {accept.replace(/\./g, "").toUpperCase().replace(/,/g, ", ")} up to 10MB each
                    </span>
                </Label>
            </div>

            {/* Error Message */}
            {error && (
                <p className="text-xs text-red-500 font-medium">
                    {typeof error === "string" ? error : error.message}
                </p>
            )}

            {/* Files List */}
            {files.length > 0 && (
                <div className="grid grid-cols-1 gap-2 mt-3">
                    {files.map((file, index) => (
                        <div
                            key={`${file.name}-${index}`}
                            className="flex items-center justify-between p-2 pl-3 bg-gray-50 border border-gray-200 rounded-md group hover:border-gray-300 transition-colors"
                        >
                            <div className="flex items-center gap-3 overflow-hidden">
                                {isImage(file) ? (
                                    <ImageIcon className="w-4 h-4 text-primary shrink-0" />
                                ) : (
                                    <FileIcon className="w-4 h-4 text-blue-500 shrink-0" />
                                )}
                                <span className="text-xs text-gray-600 truncate font-medium">
                                    {file.name}
                                </span>
                                <span className="text-[10px] text-gray-400 shrink-0">
                                    ({(file.size / 1024 / 1024).toFixed(2)} MB)
                                </span>
                            </div>
                            {onRemove && (
                                <button
                                    type="button"
                                    onClick={() => onRemove(index)}
                                    className="p-1 hover:bg-red-100 rounded-full text-gray-400 hover:text-red-500 transition-colors"
                                    title="Remove file"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
