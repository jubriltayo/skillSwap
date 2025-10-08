// components/connections/pending-requests.tsx
"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X, MapPin } from "lucide-react";
import { useAuth } from "@/lib/contexts/auth-context";
import Link from "next/link";
import { useConnections } from "@/lib/contexts/connections-context";
import type { Connection } from "@/lib/types";

export function PendingRequests() {
  useAuth();
  const { pendingRequests, loading, acceptRequest, rejectRequest } =
    useConnections();

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

  const handleAccept = async (connectionId: string) => {
    await acceptRequest(connectionId);
  };

  const handleDecline = async (connectionId: string) => {
    await rejectRequest(connectionId);
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="animate-pulse">Loading pending requests...</div>
        </CardContent>
      </Card>
    );
  }

  if (pendingRequests.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <h3 className="text-lg font-semibold mb-2">No pending requests</h3>
          <p className="text-muted-foreground">
            You don&apos;t have any pending connection requests at the moment.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {pendingRequests.map((request: Connection) => {
        const requester = request.sender;
        if (!requester) return null;

        const skillsOffered = parseSkills(requester.skills_offered);

        return (
          <Card key={request.id}>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <Avatar className="w-16 h-16">
                  <AvatarImage
                    src={requester.avatar_url || "/placeholder.svg"}
                    alt={requester.name}
                  />
                  <AvatarFallback>
                    {requester.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-grow">
                  <div className="flex items-start justify-between">
                    <div>
                      <Link href={`/profile/${requester.username}`}>
                        <h3 className="font-semibold text-lg hover:text-primary transition-colors">
                          {requester.name}
                        </h3>
                      </Link>
                      <p className="text-muted-foreground">
                        @{requester.username}
                      </p>

                      {requester.location && (
                        <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                          <MapPin className="w-4 h-4" />
                          <span>{requester.location}</span>
                        </div>
                      )}

                      {request.message && (
                        <div className="mt-3 p-3 bg-muted rounded-lg">
                          <p className="text-sm text-foreground">
                            {request.message}
                          </p>
                        </div>
                      )}

                      <div className="flex flex-wrap gap-2 mt-3">
                        {skillsOffered.slice(0, 3).map((skill) => (
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

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleAccept(request.id)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Check className="w-4 h-4 mr-1" />
                        Accept
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDecline(request.id)}
                      >
                        <X className="w-4 h-4 mr-1" />
                        Decline
                      </Button>
                    </div>
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
