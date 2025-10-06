"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { ProfileHeader } from "@/components/profile/profile-header";
import { ProfileTabs } from "@/components/profile/profile-tabs";
import { useAuth } from "@/lib/contexts/auth-context";
import type { User } from "@/lib/types/database";
import { UserService } from "@/lib/services/users";
import { EnhancedLoading } from "@/components/loading/enhanced-loading";

export default function UserProfilePage() {
  const params = useParams();
  const { user: currentUser } = useAuth();
  const [profileUser, setProfileUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const username = params.username as string;

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get all users and find the matching username
        const usersResult = await UserService.getUsers();

        if (usersResult.success && usersResult.data) {
          const exactMatch = usersResult.data.find(
            (user: User) => user.username === username
          );

          if (exactMatch) {
            setProfileUser(exactMatch);
          } else {
            setError("User not found");
          }
        } else {
          setError("Failed to load users");
        }
      } catch (err) {
        setError("Failed to load user profile");
        console.error("Error fetching user:", err);
      } finally {
        setLoading(false);
      }
    };

    if (username) {
      fetchUser();
    }
  }, [username]);

  const handleProfileUpdate = (updatedUser: User) => {
    setProfileUser(updatedUser);
  };

  const handleSkillsUpdate = (updatedUser: User) => {
    setProfileUser(updatedUser);
  };

  if (loading) {
    return (
      <AppShell>
        <div className="container mx-auto px-4 py-8">
          <EnhancedLoading variant="card" count={1} />
        </div>
      </AppShell>
    );
  }

  if (error || !profileUser) {
    return (
      <AppShell>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-2">
              User Not Found
            </h1>
            <p className="text-muted-foreground">
              The user &quot;{username}&quot; doesn&apos;t exist.
            </p>
          </div>
        </div>
      </AppShell>
    );
  }

  const isOwnProfile = currentUser?.id === profileUser.id;

  return (
    <AppShell>
      <div className="container mx-auto px-4 py-8">
        <ProfileHeader
          user={profileUser}
          isOwnProfile={isOwnProfile}
          onProfileUpdate={handleProfileUpdate}
        />
        <ProfileTabs
          user={profileUser}
          isOwnProfile={isOwnProfile}
          onSkillsUpdate={handleSkillsUpdate}
        />
      </div>
    </AppShell>
  );
}
