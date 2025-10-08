"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { PostForm } from "@/components/posts/post-form";
import { PostService } from "@/lib/services/posts";
import { useAuth } from "@/lib/contexts/auth-context";
import { EnhancedLoading } from "@/components/loading/enhanced-loading";
import type { Post } from "@/lib/types/database";
import { toast } from "sonner";

export default function EditPostPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();

  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  const postId = params.id as string;

  // Load post data
  useEffect(() => {
    const loadPost = async () => {
      try {
        setLoading(true);
        const result = await PostService.getPost(postId);

        if (result.success && result.data) {
          const postData = result.data;

          // Check if user owns this post
          if (user?.id !== postData.user_id) {
            toast.error("You can only edit your own posts");
            router.push(`/posts/${postId}`);
            return;
          }

          setPost(postData);
        } else {
          toast.error("Post not found");
          router.push("/posts");
        }
      } catch {
        toast.error("Failed to load post");
        router.push("/posts");
      } finally {
        setLoading(false);
      }
    };

    if (postId && user) {
      loadPost();
    }
  }, [postId, user, router]);

  const handleSuccess = () => {
    router.push(`/posts/${postId}`);
  };

  const handleCancel = () => {
    router.push(`/posts/${postId}`);
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
    return null;
  }

  return (
    <AppShell>
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="mb-6">
          <Link href={`/posts/${postId}`}>
            <Button variant="ghost" size="sm" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Post
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-foreground">Edit Post</h1>
          <p className="text-muted-foreground mt-2">
            Update your skill exchange post
          </p>
        </div>

        <PostForm
          mode="edit"
          initialData={post}
          postId={postId}
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      </div>
    </AppShell>
  );
}
