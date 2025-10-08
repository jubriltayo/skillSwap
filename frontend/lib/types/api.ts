import type { User, Connection } from "./database";

export interface BaseResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends BaseResponse<T[]> {
  meta?: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export interface AuthResponseData {
  user: User;
  token: string;
  token_type: string;
}

export interface ConnectionResponseData {
  sent: Connection[];
  received: Connection[];
}

export interface UserStats {
  connection_count: number;
}

export interface PostFilters {
  type?: "offer" | "request";
  experience_level?: "beginner" | "intermediate" | "advanced";
  skills?: string[];
  category?: string;
  location?: string;
  is_remote?: boolean;
  exclude_own?: boolean;
  sort?: string;
  direction?: "asc" | "desc";
  per_page?: number;
}

export interface UserSearchParams {
  q: string;
}

export interface SkillsUpdateData {
  skills_offered?: string[];
  skills_wanted?: string[];
}

export interface AvatarUpdateData {
  avatar_base64: string;
  file_type: string;
}
