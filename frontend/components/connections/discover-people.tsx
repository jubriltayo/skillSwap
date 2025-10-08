"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { UserPlus, MapPin, Search } from "lucide-react";
import { useAuth } from "@/lib/contexts/auth-context";
import type { User } from "@/lib/types";
import Link from "next/link";
import { ConnectDialog } from "./connect-dialog";
import { useUsers } from "@/lib/hooks/useUsers";

export function DiscoverPeople() {
  const { user: currentUser } = useAuth();
  const { users, loading, searchUsers } = useUsers();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isSearching, setIsSearching] = useState(false);

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
          ? parsed.filter((s): s is string => typeof s === "string")
          : [];
      } catch {
        return [];
      }
    }

    return [];
  };

  useEffect(() => {
    // The useUsers hook will handle fetching automatically
  }, []);

  const handleSearch = async () => {
    if (searchQuery.trim()) {
      setIsSearching(true);
      await searchUsers(searchQuery);
      setIsSearching(false);
    }
  };

  const handleConnect = (user: User) => {
    setSelectedUser(user);
  };

  const filteredUsers = users.filter((user) => user.id !== currentUser?.id);

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="animate-pulse">Loading people...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search people by name, username, or skills..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {isSearching ? (
          <Card>
            <CardContent className="p-8 text-center">
              <div className="animate-pulse">Searching...</div>
            </CardContent>
          </Card>
        ) : filteredUsers.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <h3 className="text-lg font-semibold mb-2">No people found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search terms.
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredUsers.map((user) => {
            const skillsOffered = parseSkills(user.skills_offered);
            const skillsWanted = parseSkills(user.skills_wanted);

            return (
              <Card key={user.id}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <Avatar className="w-16 h-16">
                      <AvatarImage
                        src={user.avatar_url || "/placeholder.svg"}
                        alt={user.name}
                      />
                      <AvatarFallback>
                        {user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-grow">
                      <div className="flex items-start justify-between">
                        <div>
                          <Link href={`/profile/${user.username}`}>
                            <h3 className="font-semibold text-lg hover:text-primary transition-colors">
                              {user.name}
                            </h3>
                          </Link>
                          <p className="text-muted-foreground">
                            @{user.username}
                          </p>

                          {user.location && (
                            <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                              <MapPin className="w-4 h-4" />
                              <span>{user.location}</span>
                            </div>
                          )}

                          {user.bio && (
                            <p className="text-sm text-foreground mt-2 line-clamp-2">
                              {user.bio}
                            </p>
                          )}

                          <div className="mt-3">
                            <p className="text-sm font-medium text-muted-foreground mb-2">
                              Skills offered:
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {skillsOffered.slice(0, 4).map((skill) => (
                                <Badge
                                  key={skill}
                                  variant="secondary"
                                  className="bg-green-100 text-green-800 hover:bg-green-100"
                                >
                                  {skill}
                                </Badge>
                              ))}
                              {skillsOffered.length > 4 && (
                                <Badge variant="outline">
                                  +{skillsOffered.length - 4} more
                                </Badge>
                              )}
                            </div>
                          </div>

                          {skillsWanted.length > 0 && (
                            <div className="mt-2">
                              <p className="text-sm font-medium text-muted-foreground mb-2">
                                Wants to learn:
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {skillsWanted.slice(0, 3).map((skill) => (
                                  <Badge
                                    key={skill}
                                    variant="secondary"
                                    className="bg-blue-100 text-blue-800 hover:bg-blue-100"
                                  >
                                    {skill}
                                  </Badge>
                                ))}
                                {skillsWanted.length > 3 && (
                                  <Badge variant="outline">
                                    +{skillsWanted.length - 3} more
                                  </Badge>
                                )}
                              </div>
                            </div>
                          )}
                        </div>

                        <Button onClick={() => handleConnect(user)}>
                          <UserPlus className="w-4 h-4 mr-2" />
                          Connect
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      <ConnectDialog
        user={selectedUser}
        open={!!selectedUser}
        onOpenChange={(open) => !open && setSelectedUser(null)}
      />
    </div>
  );
}
