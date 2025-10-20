export interface User {
  id: string;
  username: string;
  avatar: string;
}

export interface VideoStats {
  likes: number;
  comments: number;
  shares: number;
  views: number;
}

export interface Video {
  id: string;
  filename: string;
  url: string;
  caption: string;
  uploader: User;
  stats: VideoStats;
  user_action: UserAction;
  tags: string[];
  createdAt: string; // ISO date string
}

interface UserAction {
  liked: boolean;
  bookmarked: boolean;
}

export interface Comment {
  id: string;
  video_id: string;
  content: string;
  created_at: string;
  author: {
    id: string;
    username: string;
    avatar: string;
  };
}
