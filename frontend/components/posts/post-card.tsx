"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ModernAvatar } from "@/components/profile/modern-avatar";
import { Clock, Users, Sparkles, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Post } from "@/lib/types/database";
import { useAuth } from "@/lib/contexts/auth-context";
import { useConnections } from "@/lib/contexts/connections-context";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  const { user, isAuthenticated } = useAuth();
  const { sendRequest } = useConnections();
  const router = useRouter();
  const [isConnecting, setIsConnecting] = useState(false);

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

  const skills = parseSkills(post.skills);

  const handleCardClick = () => {
    router.push(`/posts/${post.id}`);
  };

  const handleConnect = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    if (user?.id === post.user_id) {
      toast.error("Cannot connect to your own post");
      return;
    }

    setIsConnecting(true);
    const loadingToast = toast.loading("Sending connection request...");

    try {
      const result = await sendRequest(
        post.id,
        "I'm interested in connecting!"
      );

      if (result.success) {
        toast.success("Request Sent! 🎉", {
          id: loadingToast,
          description: "Your connection request has been sent",
        });
      } else {
        toast.error("Request Failed", {
          id: loadingToast,
          description: result.error || "Failed to send request",
        });
      }
    } catch (error) {
      toast.error("Something Went Wrong", {
        id: loadingToast,
        description: "An error occurred while sending the request",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return `${Math.floor(diffInHours / 168)}w ago`;
  };

  const getLocationDisplay = () => {
    if (post.is_remote) {
      return "Remote";
    }
    return post.location || "In-person";
  };

  return (
    <Card
      className="group hover:shadow-lg transition-all duration-300 border-border/50 hover:border-primary/20 h-full flex flex-col cursor-pointer"
      onClick={handleCardClick}
    >
      <CardContent className="p-6 flex flex-col h-full">
        {/* Header Section */}
        <div className="flex items-start space-x-4 mb-4">
          <ModernAvatar
            src={post.user?.avatar_url}
            name={post.user?.name || "User"}
            size="lg"
          />
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg line-clamp-1 group-hover:text-primary transition-colors duration-300 text-balance">
              {post.title}
            </CardTitle>
            <p className="text-sm text-muted-foreground font-medium truncate">
              {post.user?.name || "Unknown User"}
            </p>
          </div>
          <div className="flex flex-col items-end gap-2 flex-shrink-0">
            <Badge
              variant="secondary"
              className={cn(
                "font-medium transition-all duration-300 border-0 shadow-sm text-xs",
                post.type === "offer"
                  ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300"
                  : "bg-amber-100 text-amber-700 hover:bg-amber-200 dark:bg-amber-900/30 dark:text-amber-300"
              )}
            >
              {post.type === "offer" ? (
                <>
                  <Sparkles className="w-3 h-3 mr-1" />
                  Offering
                </>
              ) : (
                "Seeking"
              )}
            </Badge>
            <div className="flex items-center gap-1.5">
              <div
                className={cn(
                  "w-2 h-2 rounded-full transition-all duration-300",
                  post.status === "active"
                    ? "bg-emerald-500 shadow-sm shadow-emerald-500/50"
                    : "bg-slate-400 dark:bg-slate-600"
                )}
              />
              <span className="text-xs font-medium text-muted-foreground">
                {post.status === "active" ? "Active" : "Inactive"}
              </span>
            </div>
          </div>
        </div>

        {/* Description Section - Fixed height */}
        <div className="mb-4 h-12 flex items-start">
          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
            {post.description}
          </p>
        </div>

        {/* Skills Section - Fixed height */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-1 overflow-hidden h-6">
            <Badge
              variant="outline"
              className="font-medium border-primary/20 text-primary bg-primary/5 text-xs flex-shrink-0"
            >
              {post.experience_level}
            </Badge>
            {skills.slice(0, 2).map((skill, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="text-xs flex-shrink-0"
              >
                {skill}
              </Badge>
            ))}
            {skills.length > 2 && (
              <Badge variant="outline" className="text-xs flex-shrink-0">
                +{skills.length - 2}
              </Badge>
            )}
          </div>
        </div>

        {/* Info Section - Fixed height */}
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
          <div className="flex items-center">
            <Clock className="h-3 w-3 mr-1 flex-shrink-0" />
            <span className="truncate">{formatTimeAgo(post.created_at)}</span>
          </div>
          <div className="flex items-center">
            <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
            <span className="truncate max-w-[100px]">
              {getLocationDisplay()}
            </span>
          </div>
        </div>

        {/* Footer Section - Always at bottom */}
        <div className="flex items-center justify-between pt-3 border-t border-border/50 mt-auto">
          <div className="text-xs text-muted-foreground">
            {post.category || "General"}
          </div>
          <Button
            onClick={handleConnect}
            disabled={isConnecting || user?.id === post.user_id}
            size="sm"
            className="text-xs h-8"
          >
            {isConnecting ? (
              <>
                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-1"></div>
                Sending...
              </>
            ) : post.type === "offer" ? (
              "Learn Skill"
            ) : (
              "Offer Help"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
