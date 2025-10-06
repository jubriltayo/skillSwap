"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, MapPin, Calendar } from "lucide-react";
import { useAuth } from "@/lib/contexts/auth-context";
import type { User } from "@/lib/types/database";
import Link from "next/link";
import { useConnections } from "@/lib/contexts/connections-context";

export function MyConnections() {
  const { user } = useAuth();
  const { acceptedConnections, loading } = useConnections();

  // Safely parse skills - handle both array and JSON string
  const parseSkills = (skills: any): string[] => {
    if (Array.isArray(skills)) {
      return skills;
    }

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

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="animate-pulse">Loading connections...</div>
        </CardContent>
      </Card>
    );
  }

  if (acceptedConnections.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <h3 className="text-lg font-semibold mb-2">No connections yet</h3>
          <p className="text-muted-foreground mb-4">
            Start connecting with people to build your professional network.
          </p>
          <Link href="/connections?tab=discover">
            <Button>Discover People</Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {acceptedConnections.map((connection) => {
        // Determine which user is the connected user (not the current user)
        const connectedUser =
          connection.sender_id === user?.id
            ? connection.receiver
            : connection.sender;

        if (!connectedUser) return null;

        const skillsOffered = parseSkills(connectedUser.skills_offered);

        return (
          <Card key={connection.id}>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <Avatar className="w-16 h-16">
                  <AvatarImage
                    src={connectedUser.avatar_url || "/placeholder.svg"}
                    alt={connectedUser.name}
                  />
                  <AvatarFallback>
                    {connectedUser.name
                      .split(" ")
                      .map((n: string) => n[0])
                      .join("")
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-grow">
                  <div className="flex items-start justify-between">
                    <div>
                      <Link href={`/profile/${connectedUser.username}`}>
                        <h3 className="font-semibold text-lg hover:text-primary transition-colors">
                          {connectedUser.name}
                        </h3>
                      </Link>
                      <p className="text-muted-foreground">
                        @{connectedUser.username}
                      </p>

                      <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
                        {connectedUser.location && (
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            <span>{connectedUser.location}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>
                            Connected{" "}
                            {new Date(
                              connection.created_at
                            ).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      {connectedUser.bio && (
                        <p className="text-sm text-foreground mt-2 line-clamp-2">
                          {connectedUser.bio}
                        </p>
                      )}

                      <div className="flex flex-wrap gap-2 mt-3">
                        {skillsOffered.slice(0, 3).map((skill: string) => (
                          <Badge
                            key={skill}
                            variant="secondary"
                            className="bg-green-100 text-green-800 hover:bg-green-100"
                          >
                            {skill}
                          </Badge>
                        ))}
                        {skillsOffered.length > 3 && (
                          <Badge variant="outline">
                            +{skillsOffered.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>

                    <Button variant="outline" size="sm">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Message
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
