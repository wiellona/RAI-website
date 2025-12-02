"use client";

import { useCallback, useMemo } from "react";
import { FileText, UploadCloud, X } from "lucide-react";
import { useDropzone, type DropzoneOptions } from "react-dropzone";

const bytesToReadable = (bytes?: number) => {
  if (!bytes && bytes !== 0) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const extractFileName = (input?: string | null) => {
  if (!input) return "";
  try {
    const url = new URL(input);
    return url.pathname.split("/").pop() ?? input;
  } catch {
    return input.split("/").pop() ?? input;
  }
};

export type DragDropAccept = DropzoneOptions["accept"];

type UploadValue = File | string | null;

export interface DragDropFileUploadProps {
  onFileSelect: (file: File | null) => void;
  currentFile: UploadValue;
  accept?: DragDropAccept;
  label?: string;
  helperText?: string;
  disabled?: boolean;
  maxSize?: number;
  existingFile?: {
    name?: string | null;
    downloadUrl?: string | null;
    description?: string | null;
  };
  onRemoveExisting?: () => void | Promise<void>;
  removingExisting?: boolean;
}

export function DragDropFileUpload({
  onFileSelect,
  currentFile,
  accept,
  label,
  helperText,
  disabled = false,
  maxSize,
  existingFile,
  onRemoveExisting,
  removingExisting = false,
}: DragDropFileUploadProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (!acceptedFiles.length) return;
      onFileSelect(acceptedFiles[0]);
    },
    [onFileSelect]
  );

  const dropzoneConfig = useMemo<DropzoneOptions>(
    () => ({
      onDrop,
      multiple: false,
      disabled,
      accept,
      maxSize,
    }),
    [accept, disabled, maxSize, onDrop]
  );

  const { getRootProps, getInputProps, isDragActive, fileRejections } =
    useDropzone(dropzoneConfig);

  const hasError = fileRejections.length > 0;
  const errorMessage = fileRejections[0]?.errors[0]?.message;

  const isFileObject = currentFile instanceof File;

  const resolvedName = (() => {
    if (isFileObject) return currentFile.name;
    if (typeof currentFile === "string") return extractFileName(currentFile);
    if (existingFile?.name) return existingFile.name;
    if (existingFile?.downloadUrl)
      return extractFileName(existingFile.downloadUrl);
    return "";
  })();

  const resolvedDescription = isFileObject
    ? bytesToReadable(currentFile.size)
    : existingFile?.description ?? "";

  const resolvedDownloadUrl = (() => {
    if (typeof currentFile === "string") return currentFile;
    return existingFile?.downloadUrl ?? null;
  })();

  const hasFile = Boolean(resolvedName);

  const handleRemoveClick = useCallback(() => {
    if (isFileObject) {
      onFileSelect(null);
      return;
    }

    if (typeof currentFile === "string") {
      onFileSelect(null);
      return;
    }

    if (existingFile && onRemoveExisting) {
      void onRemoveExisting();
    }
  }, [currentFile, existingFile, isFileObject, onFileSelect, onRemoveExisting]);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        {/* {label && <p className="text-sm font-medium text-gray-700">{label}</p>} */}
      </div>

      <div
        {...getRootProps({
          className: `group relative min-h-[140px] rounded-xl border-2 p-6 transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#511715] focus-visible:ring-offset-2 ${
            hasError
              ? "border-red-400 bg-red-50"
              : isDragActive
              ? "border-[#511715] bg-[#fdf3f2]"
              : "border-dashed border-gray-300 hover:border-[#511715]/60"
          } ${disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"}`,
        })}
      >
        <input {...getInputProps()} />

        {hasFile ? (
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-emerald-900 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <FileText className="h-6 w-6 text-emerald-600" aria-hidden />
                <div>
                  <p className="text-sm font-semibold sm:text-base">
                    {resolvedName}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  handleRemoveClick();
                }}
                className="inline-flex items-center gap-1 rounded-full border border-emerald-600 px-3 py-1 text-xs font-medium text-emerald-700 transition-colors hover:bg-emerald-600 hover:text-white disabled:opacity-60 cursor-pointer"
                disabled={disabled || removingExisting}
              >
                {removingExisting ? (
                  "Removing..."
                ) : (
                  <>
                    <X className="h-4 w-4" aria-hidden />
                    Remove
                  </>
                )}
              </button>
            </div>
            <p className="text-xs text-emerald-800">
              Drop or click to replace the current document.
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center text-center text-gray-600">
            <UploadCloud className="h-12 w-12 text-[#C5372C]" aria-hidden />
            <p className="mt-3 text-base text-gray-600">
              {isDragActive
                ? "Drop file here"
                : "Drag & drop or click to upload"}
            </p>
            <p className="text-xs text-gray-500">
              {helperText ?? "Supports PDF, DOCX, XLSX, CSV"}
            </p>
          </div>
        )}
      </div>

      {hasError && (
        <p className="text-sm text-red-600">
          {errorMessage ?? "File rejected"}
        </p>
      )}
    </div>
  );
}
