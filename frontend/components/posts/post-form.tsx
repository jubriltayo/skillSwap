"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { X, Plus } from "lucide-react";
import { PostService } from "@/lib/services/posts";
import { toast } from "sonner";
import type { Post, CreatePostData } from "@/lib/types";

const SKILL_CATEGORIES = [
  "Web Development",
  "Mobile Development",
  "Data Science",
  "Design",
  "Marketing",
  "Business",
  "Languages",
  "Music",
  "Other",
];

const POPULAR_SKILLS = [
  "React",
  "TypeScript",
  "Python",
  "Node.js",
  "UI/UX Design",
  "Figma",
  "SEO",
  "Content Writing",
  "Spanish",
  "Guitar",
  "Photography",
  "Video Editing",
];

interface PostFormProps {
  mode: "create" | "edit";
  initialData?: Partial<Post>;
  postId?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function PostForm({
  mode,
  initialData,
  postId,
  onSuccess,
  onCancel,
}: PostFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [type, setType] = useState<"offer" | "request">(
    initialData?.type || "offer"
  );
  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(
    initialData?.description || ""
  );
  const [category, setCategory] = useState(initialData?.category || "");
  const [experienceLevel, setExperienceLevel] = useState<
    "beginner" | "intermediate" | "advanced"
  >(initialData?.experience_level || "intermediate");
  const [skills, setSkills] = useState<string[]>(
    Array.isArray(initialData?.skills)
      ? initialData.skills
      : typeof initialData?.skills === "string"
      ? JSON.parse(initialData.skills)
      : []
  );
  const [skillInput, setSkillInput] = useState("");
  const [location, setLocation] = useState(initialData?.location || "");
  const [isRemote, setIsRemote] = useState(initialData?.is_remote ?? true);
  const [status, setStatus] = useState<"active" | "inactive">(
    initialData?.status || "active"
  );

  const handleAddSkill = (skill: string) => {
    const trimmedSkill = skill.trim();
    if (trimmedSkill && !skills.includes(trimmedSkill)) {
      setSkills([...skills, trimmedSkill]);
      setSkillInput("");
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter((skill) => skill !== skillToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isFormValid) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    const loadingToast = toast.loading(
      mode === "create" ? "Creating post..." : "Updating post..."
    );

    try {
      const postData: CreatePostData = {
        type,
        title: title.trim(),
        description: description.trim(),
        skills,
        category: category || undefined,
        experience_level: experienceLevel,
        location: location.trim() || undefined,
        is_remote: isRemote,
        status,
      };

      let result;
      if (mode === "create") {
        result = await PostService.createPost(postData);
      } else {
        const updateData = { ...postData, user_id: initialData?.user_id };
        result = await PostService.updatePost(postId!, updateData);
      }

      if (result.success) {
        toast.success(
          mode === "create"
            ? "Post Created Successfully! 🎉"
            : "Post Updated Successfully! 🎉",
          {
            id: loadingToast,
            description:
              mode === "create"
                ? "Your skill exchange post is now live"
                : "Your changes have been saved",
          }
        );
        onSuccess?.();
      } else {
        toast.error(mode === "create" ? "Create Failed" : "Update Failed", {
          id: loadingToast,
          description: result.error || "Please try again",
        });
      }
    } catch {
      toast.error("Something Went Wrong", {
        id: loadingToast,
        description: "An unexpected error occurred",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid =
    title.trim() && description.trim() && category && skills.length > 0;

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>
            {mode === "create" ? "Create New Post" : "Edit Post"}
          </CardTitle>
          <CardDescription>
            {mode === "create"
              ? "Share a skill you can offer or request help learning something new"
              : "Update the information about your skill exchange"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Post Type */}
          <div className="space-y-2">
            <Label>Post Type</Label>
            <div className="flex gap-4">
              <Button
                type="button"
                variant={type === "offer" ? "default" : "outline"}
                className={
                  type === "offer" ? "bg-green-600 hover:bg-green-700" : ""
                }
                onClick={() => setType("offer")}
                disabled={isSubmitting}
              >
                Offering a Skill
              </Button>
              <Button
                type="button"
                variant={type === "request" ? "default" : "outline"}
                className={
                  type === "request" ? "bg-blue-600 hover:bg-blue-700" : ""
                }
                onClick={() => setType("request")}
                disabled={isSubmitting}
              >
                Seeking to Learn
              </Button>
            </div>
          </div>

          {/* Status - Only show in edit mode */}
          {mode === "edit" && (
            <div className="space-y-2">
              <Label>Post Status</Label>
              <div className="flex gap-4">
                <Button
                  type="button"
                  variant={status === "active" ? "default" : "outline"}
                  onClick={() => setStatus("active")}
                  disabled={isSubmitting}
                >
                  Active
                </Button>
                <Button
                  type="button"
                  variant={status === "inactive" ? "default" : "outline"}
                  onClick={() => setStatus("inactive")}
                  disabled={isSubmitting}
                >
                  Inactive
                </Button>
              </div>
            </div>
          )}

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              placeholder="e.g., Expert React Developer Available for Mentoring"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              disabled={isSubmitting}
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              placeholder="Describe what you're offering or looking for in detail..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
              required
              disabled={isSubmitting}
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category">Category *</Label>
            <Select
              value={category}
              onValueChange={setCategory}
              required
              disabled={isSubmitting}
            >
              <SelectTrigger id="category">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {SKILL_CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Skills */}
          <div className="space-y-2">
            <Label htmlFor="skills">Skills * (Add at least one)</Label>
            <div className="flex gap-2">
              <Input
                id="skills"
                placeholder="Type a skill and press Enter"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddSkill(skillInput);
                  }
                }}
                disabled={isSubmitting}
              />
              <Button
                type="button"
                onClick={() => handleAddSkill(skillInput)}
                size="icon"
                disabled={isSubmitting || !skillInput.trim()}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {skills.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {skills.map((skill) => (
                  <Badge
                    key={skill}
                    variant="secondary"
                    className="pl-3 pr-1 py-1"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      className="ml-2 hover:bg-muted rounded-full p-0.5"
                      disabled={isSubmitting}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
            <div className="mt-3">
              <p className="text-sm text-muted-foreground mb-2">
                Popular skills:
              </p>
              <div className="flex flex-wrap gap-2">
                {POPULAR_SKILLS.filter((skill) => !skills.includes(skill)).map(
                  (skill) => (
                    <Badge
                      key={skill}
                      variant="outline"
                      className="cursor-pointer hover:bg-muted transition-colors"
                      onClick={() => !isSubmitting && handleAddSkill(skill)}
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      {skill}
                    </Badge>
                  )
                )}
              </div>
            </div>
          </div>

          {/* Experience Level */}
          <div className="space-y-2">
            <Label htmlFor="level">Experience Level</Label>
            <Select
              value={experienceLevel}
              onValueChange={(
                value: "beginner" | "intermediate" | "advanced"
              ) => setExperienceLevel(value)}
              disabled={isSubmitting}
            >
              <SelectTrigger id="level">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location">
              Location {!isRemote && "(Required for in-person)"}
            </Label>
            <Input
              id="location"
              placeholder={
                isRemote
                  ? "e.g., San Francisco, CA (optional for remote)"
                  : "e.g., San Francisco, CA (required for in-person)"
              }
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              disabled={isSubmitting}
              required={!isRemote}
            />
            {isRemote && (
              <p className="text-xs text-muted-foreground">
                Location is optional since you&apos;re offering remote sessions
              </p>
            )}
            {!isRemote && (
              <p className="text-xs text-muted-foreground">
                Location is required for in-person sessions
              </p>
            )}
          </div>

          {/* Remote */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="remote"
              checked={isRemote}
              onChange={(e) => setIsRemote(e.target.checked)}
              className="h-4 w-4 rounded border-input"
              disabled={isSubmitting}
            />
            <Label htmlFor="remote" className="cursor-pointer">
              Available for remote collaboration
            </Label>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-4 mt-6">
        <Button
          type="submit"
          disabled={!isFormValid || isSubmitting}
          className="flex-1"
          size="lg"
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              {mode === "create" ? "Creating Post..." : "Updating Post..."}
            </>
          ) : mode === "create" ? (
            "Create Post"
          ) : (
            "Update Post"
          )}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
