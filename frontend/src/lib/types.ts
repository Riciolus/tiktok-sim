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
  tags: string[];
  createdAt: string; // ISO date string
}
