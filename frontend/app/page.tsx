"use client";

import { AppShell } from "@/components/layout/app-shell";
import { HeroSection } from "@/components/main/hero-section";
import { FeaturedSkillsSection } from "@/components/main/featured-skills-section";
import { HowItWorksSection } from "@/components/main/how-it-works-section";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { usePosts } from "@/lib/hooks/usePosts";
import { useAuth } from "@/lib/contexts/auth-context";

export default function HomePage() {
  const { isAuthenticated } = useAuth();
  const { posts, loading, error } = usePosts();

  const featuredPosts = posts
    .filter((post) => post.status === "active")
    .slice(0, 6);

  return (
    <AppShell>
      <HeroSection />
      <FeaturedSkillsSection
        posts={featuredPosts}
        loading={loading}
        error={error}
      />
      <HowItWorksSection />

      {/* CTA Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto text-center">
          {isAuthenticated ? (
            <>
              <h2 className="text-3xl font-bold text-foreground mb-4 text-balance">
                Ready to Make New Connections?
              </h2>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto text-pretty">
                Discover new people to learn from and share your expertise with.
                Expand your professional network today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/users">
                  <Button
                    size="lg"
                    className="bg-accent hover:bg-accent/90 text-accent-foreground transition-all duration-200 hover:scale-105"
                  >
                    Discover People
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/connections">
                  <Button
                    size="lg"
                    variant="outline"
                    className="transition-all duration-200 hover:scale-105"
                  >
                    View My Connections
                  </Button>
                </Link>
              </div>
            </>
          ) : (
            <>
              <h2 className="text-3xl font-bold text-foreground mb-4 text-balance">
                Ready to Start Your Skill Journey?
              </h2>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto text-pretty">
                Join thousands of professionals who are already growing their
                careers through skill exchange.
              </p>
              <Link href="/register">
                <Button
                  size="lg"
                  className="bg-accent hover:bg-accent/90 text-accent-foreground transition-all duration-200 hover:scale-105"
                >
                  Join SkillSwap Today
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </>
          )}
        </div>
      </section>
    </AppShell>
  );
}
