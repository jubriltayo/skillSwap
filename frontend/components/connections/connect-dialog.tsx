"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2 } from "lucide-react";
import type { User } from "@/lib/types/database";
import { useConnections } from "@/lib/contexts/connections-context";

interface ConnectDialogProps {
  user: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  postId?: string;
}

export function ConnectDialog({
  user,
  open,
  onOpenChange,
  postId,
}: ConnectDialogProps) {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { sendRequest } = useConnections();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);

    try {
      const result = await sendRequest(postId || user.id, message);

      if (result.success) {
        setMessage("");
        onOpenChange(false);
      } else {
        console.error("Failed to send connection request:", result.error);
        // You might want to show an error toast here
      }
    } catch (error) {
      console.error("Error sending connection request:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Connect with {user.name}</DialogTitle>{" "}
          <DialogDescription>
            Send a connection request to start building your professional
            relationship.
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center gap-4 py-4">
          <Avatar className="w-16 h-16">
            <AvatarImage
              src={user.avatar_url || "/placeholder.svg"}
              alt={user.name}
            />{" "}
            <AvatarFallback>
              {user.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold text-lg">{user.name}</h3>{" "}
            <p className="text-muted-foreground">@{user.username}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="message">Personal Message (Optional)</Label>
              <Textarea
                id="message"
                placeholder="Hi! I'd love to connect and learn more about your experience with..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                disabled={loading}
                rows={4}
              />
            </div>
          </div>

          <DialogFooter className="mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Send Request
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
