"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { X, Plus, Loader2 } from "lucide-react";
import { UserService } from "@/lib/services/users";
import { useAuth } from "@/lib/contexts/auth-context";
import { toast } from "sonner";

interface SkillsManagerProps {
  skills: string[];
  type: "offered" | "wanted";
  trigger: React.ReactNode;
  onSkillsUpdate?: (skills: string[]) => void;
}

const POPULAR_SKILLS = [
  "React",
  "TypeScript",
  "JavaScript",
  "Python",
  "Node.js",
  "UI/UX Design",
  "Figma",
  "Machine Learning",
  "Data Science",
  "AWS",
  "Docker",
  "GraphQL",
  "Vue.js",
  "Angular",
  "PHP",
  "Java",
  "C++",
  "Swift",
  "Kotlin",
  "Flutter",
];

export function SkillsManager({
  skills,
  type,
  trigger,
  onSkillsUpdate,
}: SkillsManagerProps) {
  const { user: currentUser, updateUser } = useAuth();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newSkill, setNewSkill] = useState("");
  const [selectedSkills, setSelectedSkills] = useState<string[]>(skills);

  const handleAddSkill = () => {
    if (newSkill.trim() && !selectedSkills.includes(newSkill.trim())) {
      setSelectedSkills([...selectedSkills, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSelectedSkills(
      selectedSkills.filter((skill) => skill !== skillToRemove)
    );
  };

  const handleAddPopularSkill = (skill: string) => {
    if (!selectedSkills.includes(skill)) {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const handleSave = async () => {
    if (!currentUser?.id) {
      toast.error("Authentication Required", {
        description: "Please log in to update your skills",
        duration: 4000,
      });
      return;
    }

    setLoading(true);

    const loadingToast = toast.loading("Saving your skills...", {
      description: "Please wait while we update your profile",
    });

    try {
      const skillsData = {
        [type === "offered" ? "skills_offered" : "skills_wanted"]:
          selectedSkills,
      };

      const result = await UserService.updateUserSkills(
        currentUser.id,
        skillsData
      );

      if (result.success) {
        // Update auth context
        updateUser({
          ...currentUser,
          ...skillsData,
        });

        // Notify parent
        onSkillsUpdate?.(selectedSkills);

        // Close dialog
        setOpen(false);

        toast.success("Skills Updated Successfully! 🎉", {
          id: loadingToast,
          description: `You now have ${selectedSkills.length} ${
            type === "offered" ? "skills to offer" : "skills you want to learn"
          }`,
          duration: 5000,
        });
      } else {
        toast.error("Update Failed", {
          id: loadingToast,
          description:
            result.error ||
            "There was a problem saving your skills. Please try again.",
          duration: 6000,
        });
      }
    } catch {
      toast.error("Something Went Wrong", {
        id: loadingToast,
        description: "An unexpected error occurred. Please try again later.",
        duration: 6000,
      });
    } finally {
      setLoading(false);
    }
  };

  const availablePopularSkills = POPULAR_SKILLS.filter(
    (skill) => !selectedSkills.includes(skill)
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            Manage Skills {type === "offered" ? "I Offer" : "I Want to Learn"}
          </DialogTitle>
          <DialogDescription>
            {type === "offered"
              ? "Add skills you can teach or help others with."
              : "Add skills you want to learn from others."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Current Skills */}
          <div className="space-y-3">
            <Label>Current Skills</Label>
            <div className="flex flex-wrap gap-2 min-h-[40px] p-3 border rounded-md">
              {selectedSkills.length > 0 ? (
                selectedSkills.map((skill) => (
                  <Badge
                    key={skill}
                    variant="secondary"
                    className={
                      type === "offered"
                        ? "bg-green-100 text-green-800 hover:bg-green-100"
                        : "bg-blue-100 text-blue-800 hover:bg-blue-100"
                    }
                  >
                    {skill}
                    <button
                      onClick={() => handleRemoveSkill(skill)}
                      className="ml-1 hover:text-red-600 transition-colors"
                      disabled={loading}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))
              ) : (
                <span className="text-muted-foreground text-sm">
                  No skills added yet
                </span>
              )}
            </div>
          </div>

          {/* Add New Skill */}
          <div className="space-y-3">
            <Label htmlFor="new-skill">Add New Skill</Label>
            <div className="flex gap-2">
              <Input
                id="new-skill"
                placeholder="Enter a skill..."
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleAddSkill()}
                disabled={loading}
              />
              <Button
                onClick={handleAddSkill}
                disabled={!newSkill.trim() || loading}
                size="icon"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Popular Skills */}
          {availablePopularSkills.length > 0 && (
            <div className="space-y-3">
              <Label>Popular Skills</Label>
              <div className="flex flex-wrap gap-2">
                {availablePopularSkills.slice(0, 15).map((skill) => (
                  <Button
                    key={skill}
                    variant="outline"
                    size="sm"
                    onClick={() => handleAddPopularSkill(skill)}
                    className="h-8"
                    disabled={loading}
                  >
                    <Plus className="w-3 h-3 mr-1" />
                    {skill}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={loading || selectedSkills.length === 0}
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Skills
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
