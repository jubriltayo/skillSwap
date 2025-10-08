import { Button } from "@/components/ui/button";
import { PostCard } from "@/components/posts/post-card";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import type { Post } from "@/lib/types";
import { EnhancedLoading } from "@/components/loading/enhanced-loading";

interface FeaturedSkillsSectionProps {
  posts: Post[];
  loading?: boolean;
  error?: string | null;
}

export function FeaturedSkillsSection({
  posts,
  loading = false,
  error = null,
}: FeaturedSkillsSectionProps) {
  if (loading) {
    return (
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Featured Skills
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Discover the most popular skills being shared in our community
            </p>
          </div>
          <EnhancedLoading variant="card" count={3} />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Featured Skills
          </h2>
          <p className="text-red-500 mb-4">Error loading posts: {error}</p>
          <Link href="/posts">
            <Button variant="outline" size="lg">
              Browse All Skills
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>
    );
  }

  if (!posts || posts.length === 0) {
    return (
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Featured Skills
          </h2>
          <p className="text-muted-foreground mb-8">
            No featured skills available at the moment.
          </p>
          <Link href="/posts">
            <Button variant="outline" size="lg">
              Browse All Skills
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 px-4 bg-muted/30">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Featured Skills
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover the most popular skills being shared in our community
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>

        <div className="text-center">
          <Link href="/posts">
            <Button variant="outline" size="lg">
              View All Skills
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
