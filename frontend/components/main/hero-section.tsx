import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/lib/contexts/auth-context";

export function HeroSection() {
  const { isAuthenticated } = useAuth();

  return (
    <section className="py-20 px-4">
      <div className="container mx-auto text-center max-w-4xl">
        <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 text-balance">
          Exchange Skills, Build Connections
        </h1>
        <p className="text-xl text-muted-foreground mb-8 text-pretty max-w-2xl mx-auto">
          Connect with professionals to learn new skills and share your
          expertise. Build meaningful relationships while growing your career.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link href="/posts">
            <Button
              size="lg"
              className="bg-accent hover:bg-accent/90 text-accent-foreground"
            >
              Start Learning
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          {isAuthenticated ? (
            <Link href="/posts/create">
              <Button size="lg" variant="outline">
                Create Post
              </Button>
            </Link>
          ) : (
            <Link href="/register">
              <Button size="lg" variant="outline">
                Share Your Skills
              </Button>
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}