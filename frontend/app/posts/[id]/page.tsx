"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  MapPin,
  Clock,
  Users,
  Sparkles,
  Edit,
  Trash2,
  ArrowLeft,
} from "lucide-react";
import { ModernAvatar } from "@/components/profile/modern-avatar";
import { useAuth } from "@/lib/contexts/auth-context";
import { PostService } from "@/lib/services/posts";
import { useConnections } from "@/lib/contexts/connections-context";
import { EnhancedLoading } from "@/components/loading/enhanced-loading";
import type { Post } from "@/lib/types/database";
import Link from "next/link";
import { toast } from "sonner";

export default function PostDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const { sendRequest } = useConnections();

  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [isConnecting, setIsConnecting] = useState(false);

  const postId = params.id as string;

  // Load post data
  useEffect(() => {
    const loadPost = async () => {
      try {
        setLoading(true);
        const result = await PostService.getPost(postId);

        if (result.success && result.data) {
          setPost(result.data);
        } else {
          toast.error("Post not found");
          router.push("/posts");
        }
      } catch (error) {
        toast.error("Failed to load post");
        router.push("/posts");
      } finally {
        setLoading(false);
      }
    };

    if (postId) {
      loadPost();
    }
  }, [postId, router]);

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

  const skills = post ? parseSkills(post.skills) : [];

  const handleConnect = async () => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    if (user?.id === post?.user_id) {
      toast.error("Cannot connect to your own post");
      return;
    }

    setIsConnecting(true);
    const loadingToast = toast.loading("Sending connection request...");

    try {
      const result = await sendRequest(postId, "I'm interested in connecting!");

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

  const handleDelete = async () => {
    if (!post) return;

    const loadingToast = toast.loading("Deleting post...");

    try {
      const result = await PostService.deletePost(post.id);

      if (result.success) {
        toast.success("Post Deleted", {
          id: loadingToast,
          description: "Your post has been deleted",
        });
        router.push("/posts");
      } else {
        toast.error("Delete Failed", {
          id: loadingToast,
          description: result.error || "Failed to delete post",
        });
      }
    } catch (error) {
      toast.error("Delete Failed", {
        id: loadingToast,
        description: "An error occurred while deleting the post",
      });
    }
  };

  const getLocationDisplay = () => {
    if (post?.is_remote) {
      return "Remote only";
    }
    return post?.location || "Location not specified";
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

  if (!post) {
    return (
      <AppShell>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Post Not Found
            </h1>
            <Link href="/posts">
              <Button>Back to Posts</Button>
            </Link>
          </div>
        </div>
      </AppShell>
    );
  }

  const isOwner = user?.id === post.user_id;

  return (
    <AppShell>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Link href="/posts">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Posts
            </Button>
          </Link>

          {isOwner && (
            <div className="flex gap-2">
              <Link href={`/posts/${post.id}/edit`}>
                <Button variant="outline" size="sm">
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Button>
              </Link>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDelete}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </div>
          )}
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-4">
                    <ModernAvatar
                      src={post.user?.avatar_url}
                      name={post.user?.name || "User"}
                      size="lg"
                    />
                    <div>
                      <CardTitle className="text-2xl mb-1">
                        {post.title}
                      </CardTitle>
                      <p className="text-muted-foreground font-medium">
                        by {post.user?.name || "Unknown User"}
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant="secondary"
                    className={
                      post.type === "offer"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-amber-100 text-amber-700"
                    }
                  >
                    {post.type === "offer" ? (
                      <>
                        <Sparkles className="w-4 h-4 mr-1" />
                        Offering Skill
                      </>
                    ) : (
                      "Seeking to Learn"
                    )}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-3 text-lg">Description</h3>
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                    {post.description}
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold mb-3 text-lg">
                    Skills & Experience
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    <Badge
                      variant="outline"
                      className="font-medium border-primary/20 text-primary bg-primary/5"
                    >
                      {post.experience_level}
                    </Badge>
                    {skills.map((skill, index) => (
                      <Badge key={index} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold mb-2">Category</h3>
                    <p className="text-muted-foreground">
                      {post.category || "General"}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Status</h3>
                    <Badge
                      variant={
                        post.status === "active" ? "default" : "secondary"
                      }
                    >
                      {post.status === "active" ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Location & Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>{getLocationDisplay()}</span>
                </div>

                <div className="flex items-center text-sm text-muted-foreground">
                  <Clock className="h-4 w-4 mr-2" />
                  Posted {new Date(post.created_at).toLocaleDateString()}
                </div>

                <div className="flex items-center text-sm text-muted-foreground">
                  <Users className="h-4 w-4 mr-2" />
                  {post.status === "active"
                    ? "Accepting connections"
                    : "Not accepting connections"}
                </div>
              </CardContent>
            </Card>

            {!isOwner && (
              <Card>
                <CardContent className="p-6">
                  <Button
                    onClick={handleConnect}
                    disabled={isConnecting || post.status !== "active"}
                    className="w-full"
                    size="lg"
                  >
                    {isConnecting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Sending...
                      </>
                    ) : post.type === "offer" ? (
                      "Request to Learn"
                    ) : (
                      "Offer to Teach"
                    )}
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
