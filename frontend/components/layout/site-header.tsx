"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useAuth } from "@/lib/contexts/auth-context";
import { ModernAvatar } from "@/components/profile/modern-avatar";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, LogOut, Settings, PlusCircle } from "lucide-react";
import Image from "next/image";

export function SiteHeader() {
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
        >
          <div className="w-16 h-16 relative">
            <Image
              src="/images/skillswap.png"
              alt="SkillSwap Logo"
              width={64}
              height={64}
              className="object-contain"
            />
          </div>
          <span className="font-bold text-xl text-foreground">SkillSwap</span>
        </Link>

        <nav className="hidden md:flex items-center space-x-6">
          <Link
            href="/posts"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Browse Skills
          </Link>
          <Link
            href="/users"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Find People
          </Link>
        </nav>

        <div className="flex items-center space-x-3">
          <ThemeToggle />

          {isAuthenticated && (
            <Link href="/posts/create">
              <Button size="sm" className="bg-primary hover:bg-primary/90">
                <PlusCircle className="mr-2 w-4 h-4" />
                Create Post
              </Button>
            </Link>
          )}

          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full p-0"
                >
                  <ModernAvatar
                    src={user?.avatar_url}
                    name={user?.name || "User"}
                    size="sm"
                    showOnlineStatus={true}
                    isOnline={true}
                  />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium">{user?.name}</p>
                    <p className="w-[200px] truncate text-sm text-muted-foreground">
                      @{user?.username}
                    </p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/connections">
                    <Settings className="mr-2 h-4 w-4" />
                    Connections
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link href="/login">
                <Button variant="outline" size="sm">
                  Login
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm" className="bg-primary hover:bg-primary/90">
                  Get Started
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
