"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter } from "lucide-react"

interface SkillFilterBarProps {
  onSearchChange: (query: string) => void
  onTypeFilterChange: (type: string) => void
  onLevelFilterChange: (level: string) => void
  onActiveFilterChange: (active: string) => void
  searchQuery: string
  typeFilter: string
  levelFilter: string
  activeFilter: string
}

export function SkillFilterBar({
  onSearchChange,
  onTypeFilterChange,
  onLevelFilterChange,
  onActiveFilterChange,
  searchQuery,
  typeFilter,
  levelFilter,
  activeFilter,
}: SkillFilterBarProps) {
  return (
    <div className="mb-8 space-y-4">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search skills, technologies, or topics..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <Select value={typeFilter} onValueChange={onTypeFilterChange}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="offer">Offers</SelectItem>
            <SelectItem value="request">Requests</SelectItem>
          </SelectContent>
        </Select>
        <Select value={levelFilter} onValueChange={onLevelFilterChange}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Levels</SelectItem>
            <SelectItem value="beginner">Beginner</SelectItem>
            <SelectItem value="intermediate">Intermediate</SelectItem>
            <SelectItem value="advanced">Advanced</SelectItem>
          </SelectContent>
        </Select>
        <Select value={activeFilter} onValueChange={onActiveFilterChange}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
        <Button
          variant="outline"
          size="icon"
          className="hover:bg-primary hover:text-primary-foreground transition-colors bg-transparent"
        >
          <Filter className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
