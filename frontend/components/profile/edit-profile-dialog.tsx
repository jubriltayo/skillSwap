"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Camera, Loader2 } from "lucide-react";
import type { User } from "@/lib/types/database";
import { UserService } from "@/lib/services/users";
import { useAuth } from "@/lib/contexts/auth-context";
import { toast } from "sonner";
import { ModernAvatar } from "./modern-avatar";

interface EditProfileDialogProps {
  user: User;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onProfileUpdate?: (updatedUser: User) => void;
}

export function EditProfileDialog({
  user,
  open,
  onOpenChange,
  onProfileUpdate,
}: EditProfileDialogProps) {
  const { user: currentUser, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [currentAvatar, setCurrentAvatar] = useState(user.avatar_url);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: user.name,
    bio: user.bio || "",
    location: user.location || "",
    experience_level: user.experience_level || "beginner",
  });

  // Update current avatar when user prop changes
  useEffect(() => {
    setCurrentAvatar(user.avatar_url);
  }, [user.avatar_url]);

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Enhanced file validation
    const validTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
    ];
    const maxSize = 2 * 1024 * 1024; // 2MB

    if (!validTypes.includes(file.type)) {
      toast.error("Please select a valid image file (JPEG, PNG, GIF, or WebP)");
      return;
    }

    if (file.size > maxSize) {
      toast.error("Image must be smaller than 2MB");
      return;
    }

    setUploading(true);
    const uploadToast = toast.loading("Uploading photo...");

    try {
      const result = await UserService.updateAvatar(user.id, file);

      if (result.success && result.data) {
        const newAvatarUrl = result.data.avatar_url;
        const updatedUser = result.data;

        if (newAvatarUrl) {
          // Update local state
          setCurrentAvatar(newAvatarUrl);

          if (currentUser?.id === user.id && updateUser) {
            updateUser(updatedUser);
          }

          onProfileUpdate?.(updatedUser);
          toast.success("Photo updated successfully!", { id: uploadToast });
        } else {
          toast.error("Upload succeeded but no avatar URL returned", {
            id: uploadToast,
          });
        }
      } else {
        toast.error(result.error || "Failed to upload photo", {
          id: uploadToast,
        });
      }
    } catch (error: any) {
      toast.error("Failed to upload photo. Please try again.", {
        id: uploadToast,
      });
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const updateData = {
        name: formData.name,
        bio: formData.bio,
        location: formData.location,
        experience_level: formData.experience_level,
      };

      const result = await UserService.updateUser(user.id, updateData);

      if (result.success) {
        if (currentUser?.id === user.id) {
          updateUser({ ...currentUser, ...updateData });
        }

        onProfileUpdate?.(result.data?.data || result.data);
        onOpenChange(false);
        toast.success("Profile updated successfully!");
      } else {
        toast.error(result.error || "Failed to update profile");
      }
    } catch (error: any) {
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>
            Update your profile information and avatar.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-6 py-4">
            {/* Avatar Section */}
            <div className="flex items-center gap-4">
              <ModernAvatar
                src={currentAvatar}
                alt={user.name}
                name={user.name}
                size="xl"
                className="w-20 h-20"
              />

              <div className="space-y-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  accept="image/*"
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading || loading}
                >
                  {uploading ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Camera className="w-4 h-4 mr-2" />
                  )}
                  {uploading ? "Uploading..." : "Change Photo"}
                </Button>
                <p className="text-xs text-muted-foreground">
                  JPEG, PNG, GIF, WebP • Max 2MB
                </p>
              </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  disabled={loading}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  placeholder="Tell others about yourself..."
                  value={formData.bio}
                  onChange={(e) => handleInputChange("bio", e.target.value)}
                  disabled={loading}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  placeholder="City, Country"
                  value={formData.location}
                  onChange={(e) =>
                    handleInputChange("location", e.target.value)
                  }
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="experience_level">Experience Level</Label>
                <Select
                  value={formData.experience_level}
                  onValueChange={(value) =>
                    handleInputChange("experience_level", value)
                  }
                  disabled={loading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select experience level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                    <SelectItem value="expert">Expert</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading || uploading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading || uploading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
