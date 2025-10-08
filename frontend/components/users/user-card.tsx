"use client";

import { ModernAvatar } from "@/components/profile/modern-avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Users } from "lucide-react";
import Link from "next/link";
import type { User } from "@/lib/types/database";

interface UserCardProps {
  user: User;
  connectionCount?: number;
}

export function UserCard({ user, connectionCount }: UserCardProps) {
  // Safely parse skills - handle both array and JSON string
  const parseSkills = (skills: unknown): string[] => {
    if (Array.isArray(skills)) {
      return skills.filter(
        (skill): skill is string => typeof skill === "string"
      );
    }

    if (typeof skills === "string") {
      try {
        const parsed = JSON.parse(skills);
        return Array.isArray(parsed)
          ? parsed.filter((skill): skill is string => typeof skill === "string")
          : [];
      } catch {
        return [];
      }
    }

    return [];
  };

  const skillsOffered = parseSkills(user.skills_offered);
  const skillsWanted = parseSkills(user.skills_wanted);

  // Format experience level for display
  const formatExperienceLevel = (level: string | null) => {
    if (!level) return "Not specified";
    return level.charAt(0).toUpperCase() + level.slice(1);
  };

  // Safe avatar URL - prevent 404 errors
  const getSafeAvatarUrl = (avatarUrl: string | undefined | null): string => {
    if (!avatarUrl) return "";

    // If it's a relative path that doesn't exist, return empty to use fallback
    if (
      avatarUrl.startsWith("/avatars/") ||
      avatarUrl.startsWith("/placeholder.svg")
    ) {
      return "";
    }

    // If it's a valid URL, use it
    if (avatarUrl.startsWith("http") || avatarUrl.startsWith("/api/")) {
      return avatarUrl;
    }

    return "";
  };

  // Handle connection count display
  const getConnectionDisplay = () => {
    if (connectionCount === undefined) return "Loading...";
    if (connectionCount === 0) return "No connections";
    return `${connectionCount} connection${connectionCount === 1 ? "" : "s"}`;
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 border-border/50 hover:border-primary/20 h-full flex flex-col">
      <CardContent className="p-6 flex flex-col h-full">
        {/* Header Section */}
        <div className="flex items-start space-x-4 mb-4">
          <ModernAvatar
            src={getSafeAvatarUrl(user.avatar_url)}
            name={user.name}
            size="lg"
          />
          <div className="flex-1 min-w-0">
            <Link
              href={`/profile/${user.username}`}
              className="font-semibold text-foreground hover:text-primary transition-colors block truncate"
            >
              {user.name}
            </Link>
            <p className="text-sm text-muted-foreground truncate">
              @{user.username}
            </p>
            {user.location && (
              <div className="flex items-center text-xs text-muted-foreground mt-1">
                <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
                <span className="truncate">{user.location}</span>
              </div>
            )}
          </div>
          <Badge variant="secondary" className="text-xs flex-shrink-0">
            {formatExperienceLevel(user.experience_level)}
          </Badge>
        </div>

        {/* Bio Section - Fixed height */}
        <div className="mb-4 h-10 flex items-start">
          <p className="text-sm text-muted-foreground line-clamp-2">
            {user.bio || "No bio provided yet."}
          </p>
        </div>

        {/* Skills Section - Fixed height for each */}
        <div className="flex-1 space-y-3">
          {/* Skills Offered - Single line */}
          {skillsOffered.length > 0 && (
            <div className="h-12">
              <p className="text-xs font-medium text-green-600 mb-2">Offers</p>
              <div className="flex flex-wrap gap-1 overflow-hidden h-6">
                {skillsOffered.slice(0, 2).map((skill) => (
                  <Badge
                    key={skill}
                    variant="outline"
                    className="text-xs border-green-300 text-green-700 bg-green-50 flex-shrink-0"
                  >
                    {skill}
                  </Badge>
                ))}
                {skillsOffered.length > 2 && (
                  <Badge variant="outline" className="text-xs flex-shrink-0">
                    +{skillsOffered.length - 2}
                  </Badge>
                )}
              </div>
            </div>
          )}

          {/* Skills Wanted - Single line */}
          {skillsWanted.length > 0 && (
            <div className="h-12">
              <p className="text-xs font-medium text-blue-600 mb-2">Seeks</p>
              <div className="flex flex-wrap gap-1 overflow-hidden h-6">
                {skillsWanted.slice(0, 2).map((skill) => (
                  <Badge
                    key={skill}
                    variant="outline"
                    className="text-xs border-blue-300 text-blue-700 bg-blue-50 flex-shrink-0"
                  >
                    {skill}
                  </Badge>
                ))}
                {skillsWanted.length > 2 && (
                  <Badge variant="outline" className="text-xs flex-shrink-0">
                    +{skillsWanted.length - 2}
                  </Badge>
                )}
              </div>
            </div>
          )}

          {/* Show message if no skills */}
          {skillsOffered.length === 0 && skillsWanted.length === 0 && (
            <div className="h-12 flex items-center">
              <p className="text-xs text-muted-foreground">
                No skills listed yet
              </p>
            </div>
          )}
        </div>

        {/* Footer Section - Always at bottom */}
        <div className="flex items-center justify-between pt-4 border-t border-border/50 mt-auto">
          <div className="flex items-center text-xs text-muted-foreground">
            <Users className="h-3 w-3 mr-1 flex-shrink-0" />
            <span>{getConnectionDisplay()}</span>
          </div>
          <Link href={`/profile/${user.username}`}>
            <Button size="sm" className="text-xs">
              View Profile
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
