export interface User {
  id: string;
  email: string;
  username: string;
  name: string;
  avatar_url?: string;
  bio?: string;
  location?: string;
  skills_offered: string[];
  skills_wanted: string[];
  experience_level: string | null;
  created_at: string;
  updated_at: string;
  posts_count?: number;
  accepted_connections_count?: number;
}

export interface Post {
  id: string;
  user_id: string;
  type: "offer" | "request";
  title: string;
  description: string;
  skills: string[];
  category?: string;
  experience_level: "beginner" | "intermediate" | "advanced";
  location?: string;
  is_remote: boolean;
  status: "active" | "inactive";
  created_at: string;
  updated_at: string;
  user?: User;
  connection_status?: string;
}

export interface Connection {
  id: string;
  sender_id: string;
  receiver_id: string;
  post_id: string;
  message?: string;
  status: "pending" | "accepted" | "rejected";
  created_at: string;
  updated_at: string;
  sender?: User;
  receiver?: User;
  post?: Post;
}
