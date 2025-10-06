"use client";

import { useAuth } from "@/lib/contexts/auth-context";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { AppShell } from "@/components/layout/app-shell";
import { ProfileHeader } from "@/components/profile/profile-header";
import { ProfileTabs } from "@/components/profile/profile-tabs";
import { EnhancedLoading } from "@/components/loading/enhanced-loading";
import { useState, useEffect } from "react";

export default function ProfilePage() {
  const { user, loading, updateUser } = useAuth();
  const [currentUser, setCurrentUser] = useState(user);

  // Sync local state with auth context
  useEffect(() => {
    setCurrentUser(user);
  }, [user]);

  const handleProfileUpdate = (updatedUser: any) => {
    console.log("🔄 Profile update received:", updatedUser);

    // Update local state immediately
    setCurrentUser(updatedUser);

    // Update auth context
    if (updateUser) {
      updateUser(updatedUser);
    }
  };

  const handleSkillsUpdate = (updatedUser: any) => {
    console.log("🔄 Skills update received:", updatedUser);

    // Update local state immediately
    setCurrentUser(updatedUser);

    // Update auth context
    if (updateUser) {
      updateUser(updatedUser);
    }
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <AppShell>
          <div className="container mx-auto px-4 py-8">
            <EnhancedLoading variant="card" count={1} />
          </div>
        </AppShell>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <AppShell>
        <div className="container mx-auto px-4 py-8">
          {currentUser && (
            <>
              <ProfileHeader
                user={currentUser}
                isOwnProfile={true}
                onProfileUpdate={handleProfileUpdate}
              />
              <ProfileTabs
                user={currentUser}
                isOwnProfile={true}
                onSkillsUpdate={handleSkillsUpdate}
              />
            </>
          )}
        </div>
      </AppShell>
    </ProtectedRoute>
  );
}
