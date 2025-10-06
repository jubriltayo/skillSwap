"use client";

import { useState, useMemo } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Users } from "lucide-react";
import { UserCard } from "@/components/users/user-card";
import { useUsers } from "@/lib/hooks/useUsers";
import { EnhancedLoading } from "@/components/loading/enhanced-loading";
import type { User } from "@/lib/types/database";

export default function UsersPage() {
  const { users, loading, error, refetch } = useUsers();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSkill, setSelectedSkill] = useState("");

  // Safely parse skills
  const parseSkills = (skills: any): string[] => {
    if (Array.isArray(skills)) return skills;
    if (typeof skills === "string") {
      try {
        const parsed = JSON.parse(skills);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    }
    return [];
  };

  // Frontend search filter
  const filteredUsers = useMemo(() => {
    let filtered = users;

    // Apply text search
    if (searchQuery.trim()) {
      const searchLower = searchQuery.toLowerCase();
      filtered = filtered.filter((user: User) => {
        const skillsOffered = parseSkills(user.skills_offered);
        const skillsWanted = parseSkills(user.skills_wanted);
        const allSkills = [...skillsOffered, ...skillsWanted];

        return (
          user.name.toLowerCase().includes(searchLower) ||
          user.username?.toLowerCase().includes(searchLower) ||
          user.bio?.toLowerCase().includes(searchLower) ||
          user.location?.toLowerCase().includes(searchLower) ||
          allSkills.some((skill) => skill.toLowerCase().includes(searchLower))
        );
      });
    }

    // Apply skill filter
    if (selectedSkill) {
      filtered = filtered.filter((user: User) => {
        const skillsOffered = parseSkills(user.skills_offered);
        const skillsWanted = parseSkills(user.skills_wanted);
        return (
          skillsOffered.includes(selectedSkill) ||
          skillsWanted.includes(selectedSkill)
        );
      });
    }

    return filtered;
  }, [users, searchQuery, selectedSkill]);

  // Get all unique skills for filtering
  const allSkills = useMemo(() => {
    const skills = new Set<string>();
    users.forEach((user: User) => {
      const skillsOffered = parseSkills(user.skills_offered);
      const skillsWanted = parseSkills(user.skills_wanted);
      skillsOffered.forEach((skill: string) => skills.add(skill));
      skillsWanted.forEach((skill: string) => skills.add(skill));
    });
    return Array.from(skills).sort();
  }, [users]);

  if (loading && users.length === 0) {
    return (
      <AppShell>
        <div className="container mx-auto px-4 py-8">
          <EnhancedLoading variant="card" count={6} />
        </div>
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-red-500 mb-4">Error: {error}</div>
          <Button onClick={refetch} className="mx-auto block">
            Try Again
          </Button>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Find People
          </h1>
          <p className="text-muted-foreground">
            Connect with skilled professionals and expand your learning network
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search by name, username, skills, bio, or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedSkill === "" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedSkill("")}
            >
              All Skills
            </Button>
            {allSkills.slice(0, 10).map((skill) => (
              <Button
                key={skill}
                variant={selectedSkill === skill ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedSkill(skill)}
              >
                {skill}
              </Button>
            ))}
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-sm text-muted-foreground">
            Showing {filteredUsers.length} of {users.length}{" "}
            {users.length === 1 ? "person" : "people"}
          </p>
          {searchQuery && (
            <p className="text-xs text-muted-foreground mt-1">
              Search results for: "{searchQuery}"
            </p>
          )}
        </div>

        {/* Users Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.map((user: User) => (
            <UserCard
              key={user.id}
              user={user}
              connectionCount={user.accepted_connections_count}
            />
          ))}
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              No people found
            </h3>
            <p className="text-muted-foreground">
              {searchQuery || selectedSkill
                ? "Try adjusting your search criteria"
                : "No users found in the system"}
            </p>
            {(searchQuery || selectedSkill) && (
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedSkill("");
                }}
              >
                Clear Filters
              </Button>
            )}
          </div>
        )}
      </div>
    </AppShell>
  );
}
