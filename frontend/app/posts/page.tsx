"use client";

import { useState, useEffect } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { PostCard } from "@/components/posts/post-card";
import { SkillFilterBar } from "@/components/posts/skill-filter-bar";
import { EnhancedLoading } from "@/components/loading/enhanced-loading";
import { usePosts } from "@/lib/hooks/usePosts";
import type { Post } from "@/lib/types";

export default function PostsPage() {
  const { posts, loading, error, fetchPosts } = usePosts();
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [filters, setFilters] = useState({
    searchQuery: "",
    typeFilter: "all",
    levelFilter: "all",
    activeFilter: "all",
  });

  // Safely parse skills - handle both array and JSON string
  const parseSkills = (skills: unknown): string[] => {
    if (Array.isArray(skills)) {
      return skills.filter(
        (skill): skill is string => typeof skill === "string"
      );
    }

    if (typeof skills === "string") {
      try {
        const parsed = JSON.parse(skills);
        return Array.isArray(parsed)
          ? parsed.filter((skill): skill is string => typeof skill === "string")
          : [];
      } catch {
        return [];
      }
    }

    return [];
  };

  // Apply filters whenever posts or filters change
  useEffect(() => {
    if (!posts) return;

    let filtered = [...posts];

    // Apply search filter
    if (filters.searchQuery) {
      filtered = filtered.filter((post) => {
        const skills = parseSkills(post.skills);
        return (
          post.title
            .toLowerCase()
            .includes(filters.searchQuery.toLowerCase()) ||
          post.description
            .toLowerCase()
            .includes(filters.searchQuery.toLowerCase()) ||
          skills.some((skill: string) =>
            skill.toLowerCase().includes(filters.searchQuery.toLowerCase())
          )
        );
      });
    }

    // Apply type filter
    if (filters.typeFilter !== "all") {
      filtered = filtered.filter((post) => post.type === filters.typeFilter);
    }

    // Apply level filter
    if (filters.levelFilter !== "all") {
      filtered = filtered.filter(
        (post) => post.experience_level === filters.levelFilter
      );
    }

    // Apply active filter
    if (filters.activeFilter !== "all") {
      filtered = filtered.filter((post) =>
        filters.activeFilter === "active"
          ? post.status === "active"
          : post.status === "inactive"
      );
    }

    setFilteredPosts(filtered);
  }, [posts, filters]);

  const handleFilterChange = (newFilters: Partial<typeof filters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  if (loading && posts.length === 0) {
    return (
      <AppShell>
        <div className="container mx-auto px-4 py-8">
          <EnhancedLoading variant="card" count={6} />
        </div>
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-red-500">
            Error loading posts: {error}
            <div className="mt-4">
              <Button onClick={() => fetchPosts()} variant="outline">
                Try Again
              </Button>
            </div>
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Browse All Skills
          </h1>
          <p className="text-muted-foreground">
            Discover skills offered by our community members or find people who
            can help you learn
          </p>
        </div>

        <SkillFilterBar
          onSearchChange={(query) => handleFilterChange({ searchQuery: query })}
          onTypeFilterChange={(type) =>
            handleFilterChange({ typeFilter: type })
          }
          onLevelFilterChange={(level) =>
            handleFilterChange({ levelFilter: level })
          }
          onActiveFilterChange={(active) =>
            handleFilterChange({ activeFilter: active })
          }
          searchQuery={filters.searchQuery}
          typeFilter={filters.typeFilter}
          levelFilter={filters.levelFilter}
          activeFilter={filters.activeFilter}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>

        {filteredPosts.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              No posts found matching your filters.
            </p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() =>
                setFilters({
                  searchQuery: "",
                  typeFilter: "all",
                  levelFilter: "all",
                  activeFilter: "all",
                })
              }
            >
              Clear Filters
            </Button>
          </div>
        )}

        {/* Note: Load More functionality would need pagination support in the API */}
        {/* For now, we show all posts since usePosts fetches all */}
        {posts.length > 0 && (
          <div className="text-center mt-12">
            <p className="text-muted-foreground">
              Showing {filteredPosts.length} of {posts.length} posts
            </p>
          </div>
        )}
      </div>
    </AppShell>
  );
}
