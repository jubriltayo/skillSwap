"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useState, useMemo } from "react";

interface ModernAvatarProps {
  src?: string;
  alt?: string;
  name: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  showOnlineStatus?: boolean;
  isOnline?: boolean;
}

const sizeClasses = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-12 w-12 text-base",
  xl: "h-16 w-16 text-lg",
};

const statusSizes = {
  sm: "h-2 w-2",
  md: "h-2.5 w-2.5",
  lg: "h-3 w-3",
  xl: "h-4 w-4",
};

export function ModernAvatar({
  src,
  alt,
  name,
  size = "md",
  className,
  showOnlineStatus = false,
  isOnline = false,
}: ModernAvatarProps) {
  const [imageError, setImageError] = useState(false);

  // Use useMemo to prevent unnecessary recalculations
  const finalSrc = useMemo(() => {
    if (!src) return undefined;

    // If it's already a full URL, return as is
    if (src.startsWith("http")) {
      return src;
    }

    // If it's a relative storage path, convert to absolute URL
    if (src.startsWith("/storage/") || src.startsWith("storage/")) {
      const cleanPath = src.replace(/^\/?/, ""); // Remove leading slash if present
      return `http://localhost:8000/${cleanPath}`;
    }

    // For other relative paths or placeholder
    return src;
  }, [src]); // Only recalculate when src changes

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getGradientFromName = (name: string) => {
    const colors = [
      "from-blue-500 to-purple-600",
      "from-green-500 to-teal-600",
      "from-orange-500 to-red-600",
      "from-purple-500 to-pink-600",
      "from-teal-500 to-blue-600",
      "from-red-500 to-orange-600",
      "from-pink-500 to-purple-600",
      "from-indigo-500 to-blue-600",
    ];

    const hash = name.split("").reduce((acc, char) => {
      return char.charCodeAt(0) + ((acc << 5) - acc);
    }, 0);

    return colors[Math.abs(hash) % colors.length];
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const shouldShowFallback = !finalSrc || imageError;

  return (
    <div className="relative">
      <Avatar className={cn(sizeClasses[size], className)}>
        {!shouldShowFallback && finalSrc && (
          <AvatarImage
            src={finalSrc}
            alt={alt || name}
            onError={handleImageError}
            className="object-cover"
          />
        )}
        <AvatarFallback
          className={cn(
            "bg-gradient-to-br text-white font-semibold",
            getGradientFromName(name)
          )}
        >
          {getInitials(name)}
        </AvatarFallback>
      </Avatar>
      {showOnlineStatus && (
        <div
          className={cn(
            "absolute -bottom-0.5 -right-0.5 rounded-full border-2 border-background",
            statusSizes[size],
            isOnline ? "bg-green-500" : "bg-gray-400"
          )}
        />
      )}
    </div>
  );
}
