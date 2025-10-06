import { Search, Users, TrendingUp } from "lucide-react";

export function HowItWorksSection() {
  return (
    <section className="py-16 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            How SkillSwap Works
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Connect, learn, and grow in just three simple steps
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-primary/20 dark:bg-primary/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-3">
              1. Discover Skills
            </h3>
            <p className="text-muted-foreground">
              Browse through hundreds of skills offered by our community members
              or post what you&apos;re looking to learn.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-primary/20 dark:bg-primary/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-3">
              2. Connect
            </h3>
            <p className="text-muted-foreground">
              Send connection requests to people whose skills match your
              interests. Build your professional network.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-primary/20 dark:bg-primary/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-3">
              3. Grow Together
            </h3>
            <p className="text-muted-foreground">
              Exchange knowledge, learn new skills, and help others grow. Build
              lasting professional relationships.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
