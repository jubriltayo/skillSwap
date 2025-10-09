"use client";

import { useRouter } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { PostForm } from "@/components/posts/post-form";
import { useAuth } from "@/lib/contexts/auth-context";

export default function CreatePostPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  // Redirect if not authenticated
  if (!isAuthenticated) {
    router.push("/login");
    return null;
  }

  const handleSuccess = () => {
    router.push("/posts");
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <AppShell>
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="mb-6">
          <Link href="/posts">
            <Button variant="ghost" size="sm" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Posts
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-foreground">
            Create New Post
          </h1>
          <p className="text-muted-foreground mt-2">
            Share a skill you can offer or request help learning something new
          </p>
        </div>

        <PostForm
          mode="create"
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      </div>
    </AppShell>
  );
}
