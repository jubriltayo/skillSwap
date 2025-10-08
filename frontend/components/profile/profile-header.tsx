"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Calendar, Edit, UserPlus } from "lucide-react";
import type { User } from "@/lib/types";
import { EditProfileDialog } from "./edit-profile-dialog";
import { useConnections } from "@/lib/contexts/connections-context";
import { useAuth } from "@/lib/contexts/auth-context";
import { ModernAvatar } from "./modern-avatar";
import { toast } from "sonner";

interface ProfileHeaderProps {
  user: User;
  isOwnProfile: boolean;
  onProfileUpdate?: (updatedUser: User) => void;
}

export function ProfileHeader({
  user,
  isOwnProfile,
  onProfileUpdate,
}: ProfileHeaderProps) {
  const { user: currentUser } = useAuth();
  const { sendRequest } = useConnections();
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
    });
  };

  // Safe experience level formatting
  const formatExperienceLevel = (level: string | null | undefined): string => {
    if (!level) return "Not specified";
    return level.charAt(0).toUpperCase() + level.slice(1);
  };

  const getExperienceBadgeColor = (level: string | null | undefined) => {
    if (!level) return "bg-gray-100 text-gray-800 hover:bg-gray-100";

    switch (level) {
      case "beginner":
        return "bg-green-100 text-green-800 hover:bg-green-100";
      case "intermediate":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100";
      case "advanced":
        return "bg-purple-100 text-purple-800 hover:bg-purple-100";
      case "expert":
        return "bg-orange-100 text-orange-800 hover:bg-orange-100";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    }
  };

  const handleProfileUpdate = (updatedUser: User) => {
    onProfileUpdate?.(updatedUser);
  };

  const handleConnect = async () => {
    if (!currentUser) return;

    setIsConnecting(true);
    try {
      const result = await sendRequest(
        "",
        `I'd like to connect with you, ${user.name}!`
      );
      if (result.success) {
        toast.success("Connection request sent successfully!");
      } else {
        toast.error(result.error || "Failed to send connection request");
      }
    } catch {
      toast.error("An error occurred while sending the request");
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <>
      <Card className="mb-8">
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-shrink-0">
              <ModernAvatar
                src={user.avatar_url}
                alt={user.name}
                name={user.name}
                size="xl"
                className="w-32 h-32"
              />
            </div>

            <div className="flex-grow">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold text-foreground mb-2">
                    {user.name}
                  </h1>
                  <p className="text-lg text-muted-foreground mb-3">
                    @{user.username}
                  </p>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                    {user.location && (
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>{user.location}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>Joined {formatDate(user.created_at)}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mb-4">
                    <Badge
                      className={getExperienceBadgeColor(user.experience_level)}
                    >
                      {formatExperienceLevel(user.experience_level)}
                    </Badge>
                  </div>

                  {user.bio && (
                    <p className="text-foreground leading-relaxed">
                      {user.bio}
                    </p>
                  )}
                </div>

                <div className="flex gap-2">
                  {isOwnProfile ? (
                    <Button
                      onClick={() => setShowEditDialog(true)}
                      variant="outline"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Profile
                    </Button>
                  ) : (
                    <Button onClick={handleConnect} disabled={isConnecting}>
                      <UserPlus className="w-4 h-4 mr-2" />
                      {isConnecting ? "Connecting..." : "Connect"}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <EditProfileDialog
        user={user}
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        onProfileUpdate={handleProfileUpdate}
      />
    </>
  );
}
