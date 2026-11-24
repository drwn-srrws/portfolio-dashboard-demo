import { Loader2 as LoaderIcon } from "lucide-react";

export interface LoaderProps {
  message?: string;
}

export const Loader = ({ message }: LoaderProps) => (
  <div
    className="flex items-center justify-center z-10 size-full flex-1 text-white gap-2"
    data-testid="loading-configuration-loader"
  >
    <LoaderIcon className="animate-spin size-4" />
    {message && <p>{message}</p>}
  </div>
);
