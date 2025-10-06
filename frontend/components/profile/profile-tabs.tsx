"use client";
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, X, MapPin, Clock, Sparkles } from "lucide-react";
import type { User, Post } from "@/lib/types/database";
import { SkillsManager } from "./skills-manager";
import { UserService } from "@/lib/services/users";
import { PostService } from "@/lib/services/posts";
import { useAuth } from "@/lib/contexts/auth-context";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ModernAvatar } from "@/components/profile/modern-avatar";
import { cn } from "@/lib/utils";

interface ProfileTabsProps {
  user: User;
  isOwnProfile: boolean;
  onSkillsUpdate?: (user: User) => void;
}

export function ProfileTabs({
  user,
  isOwnProfile,
  onSkillsUpdate,
}: ProfileTabsProps) {
  const { user: currentUser, updateUser } = useAuth();
  const router = useRouter();
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [postsLoading, setPostsLoading] = useState(true);

  // Load user's posts
  useEffect(() => {
    const loadUserPosts = async () => {
      if (!user.id) return;

      try {
        setPostsLoading(true);
        const result = await PostService.getPosts();

        if (result.success && result.data) {
          // Filter posts to only show this user's posts
          const userPosts = result.data.filter(
            (post: Post) => post.user_id === user.id
          );
          setUserPosts(userPosts);
        }
      } catch (error) {
        console.error("Failed to load user posts:", error);
      } finally {
        setPostsLoading(false);
      }
    };

    loadUserPosts();
  }, [user.id]);

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

  const skillsOffered = parseSkills(user.skills_offered);
  const skillsWanted = parseSkills(user.skills_wanted);

  const handleRemoveSkill = async (
    skill: string,
    type: "offered" | "wanted"
  ) => {
    if (!user.id) return;

    const fieldName = type === "offered" ? "skills_offered" : "skills_wanted";
    const currentSkills = type === "offered" ? skillsOffered : skillsWanted;
    const updatedSkills = currentSkills.filter((s) => s !== skill);

    const loadingToast = toast.loading("Removing skill...");

    try {
      const skillsData = { [fieldName]: updatedSkills };
      const result = await UserService.updateUserSkills(user.id, skillsData);

      if (result.success) {
        // Update auth context if it's the current user
        if (currentUser?.id === user.id) {
          updateUser({
            ...currentUser,
            ...skillsData,
          });
        }

        // Notify parent
        onSkillsUpdate?.(result.data);

        toast.success("Skill removed", {
          id: loadingToast,
          description: `"${skill}" has been removed`,
        });
      } else {
        toast.error("Failed to remove skill", {
          id: loadingToast,
          description: result.error || "Please try again",
        });
      }
    } catch (error) {
      toast.error("Remove failed", {
        id: loadingToast,
        description: "An error occurred while removing skill",
      });
    }
  };

  const handleSkillsUpdate = (skills: string[], type: "offered" | "wanted") => {
    const updatedUser = {
      ...user,
      [type === "offered" ? "skills_offered" : "skills_wanted"]: skills,
    };
    onSkillsUpdate?.(updatedUser);
  };

  const handlePostClick = (post: Post) => {
    router.push(`/posts/${post.id}`);
  };

  const handleCreatePost = () => {
    router.push("/posts/create");
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

  const getLocationDisplay = (post: Post) => {
    if (post.is_remote) {
      return "Remote";
    }
    return post.location || "In-person";
  };

  const parsePostSkills = (skills: any): string[] => {
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

  return (
    <Tabs defaultValue="skills" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="skills">Skills</TabsTrigger>
        <TabsTrigger value="posts">Posts ({userPosts.length})</TabsTrigger>
      </TabsList>

      <TabsContent value="skills" className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Skills I Offer</CardTitle>
              {isOwnProfile && (
                <SkillsManager
                  skills={skillsOffered}
                  type="offered"
                  trigger={
                    <Button variant="outline" size="sm">
                      <Plus className="w-4 h-4 mr-1" />
                      Add
                    </Button>
                  }
                  onSkillsUpdate={(skills) =>
                    handleSkillsUpdate(skills, "offered")
                  }
                />
              )}
            </CardHeader>
            <CardContent>
              {skillsOffered.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {skillsOffered.map((skill) => (
                    <Badge
                      key={skill}
                      variant="secondary"
                      className="bg-green-100 text-green-800 hover:bg-green-100"
                    >
                      {skill}
                      {isOwnProfile && (
                        <button
                          className="ml-1 hover:text-green-600"
                          onClick={() => handleRemoveSkill(skill, "offered")}
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No skills offered yet.</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Skills I Want to Learn</CardTitle>
              {isOwnProfile && (
                <SkillsManager
                  skills={skillsWanted}
                  type="wanted"
                  trigger={
                    <Button variant="outline" size="sm">
                      <Plus className="w-4 h-4 mr-1" />
                      Add
                    </Button>
                  }
                  onSkillsUpdate={(skills) =>
                    handleSkillsUpdate(skills, "wanted")
                  }
                />
              )}
            </CardHeader>
            <CardContent>
              {skillsWanted.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {skillsWanted.map((skill) => (
                    <Badge
                      key={skill}
                      variant="secondary"
                      className="bg-blue-100 text-blue-800 hover:bg-blue-100"
                    >
                      {skill}
                      {isOwnProfile && (
                        <button
                          className="ml-1 hover:text-blue-600"
                          onClick={() => handleRemoveSkill(skill, "wanted")}
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">
                  No learning goals set yet.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="posts">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>My Posts</CardTitle>
            {isOwnProfile && (
              <Button onClick={handleCreatePost} size="sm">
                <Plus className="w-4 h-4 mr-1" />
                Create Post
              </Button>
            )}
          </CardHeader>
          <CardContent>
            {postsLoading ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Loading posts...</p>
              </div>
            ) : userPosts.length > 0 ? (
              <div className="space-y-4">
                {userPosts.map((post) => {
                  const postSkills = parsePostSkills(post.skills);

                  return (
                    <Card
                      key={post.id}
                      className="cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => handlePostClick(post)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg mb-1">
                              {post.title}
                            </h3>
                            <p className="text-muted-foreground text-sm line-clamp-2">
                              {post.description}
                            </p>
                          </div>
                          <Badge
                            variant="secondary"
                            className={cn(
                              "ml-2 flex-shrink-0",
                              post.type === "offer"
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-amber-100 text-amber-700"
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
                        </div>

                        <div className="flex flex-wrap gap-2 mb-3">
                          <Badge variant="outline" className="text-xs">
                            {post.experience_level}
                          </Badge>
                          {postSkills.slice(0, 2).map((skill, index) => (
                            <Badge
                              key={index}
                              variant="secondary"
                              className="text-xs"
                            >
                              {skill}
                            </Badge>
                          ))}
                          {postSkills.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{postSkills.length - 2}
                            </Badge>
                          )}
                        </div>

                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <div className="flex items-center">
                            <MapPin className="h-3 w-3 mr-1" />
                            {getLocationDisplay(post)}
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {formatTimeAgo(post.created_at)}
                          </div>
                          <Badge
                            variant={
                              post.status === "active" ? "default" : "secondary"
                            }
                            className="text-xs"
                          >
                            {post.status === "active" ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">
                  {isOwnProfile
                    ? "You haven't created any posts yet."
                    : "This user hasn't created any posts yet."}
                </p>
                {isOwnProfile && (
                  <Button onClick={handleCreatePost}>
                    <Plus className="w-4 h-4 mr-1" />
                    Create Your First Post
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
