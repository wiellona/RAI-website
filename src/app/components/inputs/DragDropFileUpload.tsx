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
    <div className="space-y-1.5 text-sm">
      <div
        {...getRootProps({
          className: `group relative rounded-lg border-2 p-4 transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0047AB] focus-visible:ring-offset-2 ${
            hasError
              ? "border-red-400 bg-red-50"
              : isDragActive
              ? "border-[#0047AB] bg-gradient-to-br from-[#0047AB]/5 to-[#0099ED]/5"
              : "border-dashed border-[#0047AB]/30 hover:border-[#0047AB]/60 hover:bg-gradient-to-br hover:from-[#0047AB]/5 hover:to-transparent"
          } ${disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"}`,
        })}
      >
        <input {...getInputProps()} />

        {hasFile ? (
          <div className="flex flex-col gap-2 rounded-lg border border-[#0047AB]/30 bg-gradient-to-br from-[#0047AB]/10 to-[#0099ED]/10 px-4 py-3 text-[#000080] sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <FileText
                className="h-5 w-5 text-[#0047AB] shrink-0"
                aria-hidden
              />
              <div>
                <p className="text-xs font-semibold sm:text-sm">
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
              className="inline-flex items-center gap-1 rounded-full border border-[#0047AB] px-2.5 py-1 text-[11px] font-medium text-[#0047AB] transition-all hover:bg-[#0047AB] hover:text-white disabled:opacity-60 cursor-pointer shadow-sm hover:shadow"
              disabled={disabled || removingExisting}
            >
              {removingExisting ? (
                "Removing..."
              ) : (
                <>
                  <X className="h-3.5 w-3.5" aria-hidden />
                  Remove
                </>
              )}
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-4 text-center text-[#000080]">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#0047AB]/10 text-[#0047AB]">
              <UploadCloud className="h-6 w-6" aria-hidden />
            </div>
            <div className="flex flex-col items-center">
              <p className="text-sm font-semibold">
                {isDragActive
                  ? "Drop file here"
                  : "Drag & drop or click to upload"}
              </p>
              <p className="mt-0.5 text-[11px] font-medium text-[#000080]/70">
                {helperText ?? "Supports PDF, DOCX, XLSX, CSV"}
              </p>
            </div>
          </div>
        )}
      </div>

      {hasError && (
        <p className="text-xs text-red-600">
          {errorMessage ?? "File rejected"}
        </p>
      )}
    </div>
  );
}
