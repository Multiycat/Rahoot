import clsx from "clsx";
import { useRef, useState } from "react";
import toast from "react-hot-toast";

type Props = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label: string;
};

const MAX_FILE_SIZE = 15 * 1024 * 1024; // 15MB

const MusicInput = ({ value, onChange, placeholder, label }: Props) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  const isDataUrl = value?.startsWith("data:audio");
  const hasValue = !!value;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("audio/")) {
      toast.error("Please select an audio file");
      return;
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      toast.error("File is too large (max 5MB)");
      return;
    }

    setIsLoading(true);

    try {
      const base64 = await fileToBase64(file);
      onChange(base64);
      setFileName(file.name);
      toast.success(`"${file.name}" loaded`);
    } catch (error) {
      console.error("Failed to load file:", error);
      toast.error("Failed to load file");
    } finally {
      setIsLoading(false);
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleClear = () => {
    onChange("");
    setFileName(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileName(null);
    onChange(e.target.value);
  };

  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium text-gray-400">{label}</label>
      <div className="flex items-center gap-1">
        {/* URL Input or File Name Display */}
        <div className="flex-1 min-w-0">
          {isDataUrl ? (
            <div className="flex h-8 items-center rounded bg-green-900/50 px-2 text-xs text-green-400 ring-1 ring-green-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="mr-1.5 h-3 w-3 shrink-0"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
              </svg>
              <span className="truncate">{fileName || "Audio loaded"}</span>
            </div>
          ) : (
            <input
              type="text"
              value={value || ""}
              onChange={handleUrlChange}
              placeholder={placeholder || "URL or upload..."}
              className="h-8 w-full rounded bg-gray-700 px-2 text-xs text-white placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
            />
          )}
        </div>

        {/* Upload Button */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isLoading}
          className={clsx(
            "flex h-8 w-8 shrink-0 items-center justify-center rounded text-white transition-colors",
            isLoading
              ? "cursor-not-allowed bg-gray-600"
              : "bg-purple-600 hover:bg-purple-700",
          )}
          title="Upload audio file"
        >
          {isLoading ? (
            <svg
              className="h-4 w-4 animate-spin"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </button>

        {/* Clear Button */}
        {hasValue && (
          <button
            type="button"
            onClick={handleClear}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-red-600 text-white hover:bg-red-700"
            title="Clear"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        )}

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="audio/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
    </div>
  );
};

export default MusicInput;
