
export interface User {
  id: string;
  name: string;
  handle: string; // @username
  avatar: string;
  bio?: string;
  friends: string[]; // Array of User IDs
  isCurrentUser?: boolean;
}

export interface Comment {
  id: string;
  authorId: string;
  text: string;
  createdAt: number;
}

export interface Post {
  id: string;
  authorId: string;
  imageUrl: string;
  caption: string;
  createdAt: number;
  remixes: Remix[];
  likes: number;
  isLiked?: boolean;
  isSaved?: boolean;
  comments: Comment[];
  generation: number; // 1 for original posts
}

export interface Remix {
  id: string;
  authorId: string;
  imageUrl: string;
  prompt: string; // The "idea" behind the remix
  createdAt: number;
  parentId: string; // ID of the post or remix it was based on
  generation: number; // parent.generation + 1
  
  // For Multimodal Blending
  secondaryImage?: string; 
  secondaryParentId?: string; // If the secondary image came from an internal post
}

export interface Draft {
  id: string;
  type: 'POST' | 'REMIX';
  data: {
    // For Post
    image?: string;
    caption?: string;
    
    // For Remix
    sourceId?: string; // Immediate parent ID
    rootPostId?: string; // The main thread ID
    sourceImage?: string; // The background image being remixed
    generatedImage?: string; // The result if saved after generation
    prompt?: string;
    
    // For Blending
    secondaryImage?: string;
    secondaryParentId?: string;
  };
  createdAt: number;
}

export enum AppView {
  AUTH = 'AUTH',
  FEED = 'FEED',
  TRENDING = 'TRENDING',
  CREATE_POST = 'CREATE_POST',
  THREAD = 'THREAD',
  PROFILE = 'PROFILE',
  COMMENTS = 'COMMENTS',
  LEADERBOARD = 'LEADERBOARD'
}

export interface NavigationState {
  view: AppView;
  activePostId?: string;
  activeProfileId?: string; // ID of the user profile we are viewing
}
