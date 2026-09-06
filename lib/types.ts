export type ReactionType = 'like' | 'love' | 'haha' | 'wow' | 'sad' | 'angry';

export interface User {
  id: string;
  name: string;
  username: string;
  avatar: string;
  coverImage?: string;
  bio?: string;
  location?: string;
  work?: string;
  friendsCount: number;
  isAnonymous?: boolean;
  email?: string | null;
}

export interface Friend {
  id: string;
  name: string;
  avatar: string;
  isOnline: boolean;
  lastSeen?: string;
  mutualFriends: number;
  statusMessage?: string;
}

export interface Comment {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  text: string;
  timestamp: string;
  likes: number;
  isLiked?: boolean;
}

export interface Attachment {
  id: string;
  name: string;
  url: string;
  type: 'image' | 'video' | 'audio' | 'document';
  size?: number;
  mimeType?: string;
  formattedSize?: string;
}

export interface Post {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  timestamp: string;
  content: string;
  image?: string;
  attachments?: Attachment[];
  feeling?: string;
  location?: string;
  taggedFriends?: string[];
  privacy: 'public' | 'friends' | 'only_me';
  groupId?: string;
  groupName?: string;
  reactions: {
    like: number;
    love: number;
    haha: number;
    wow: number;
    sad: number;
    angry: number;
  };
  userReaction?: ReactionType | null;
  comments: Comment[];
  sharesCount: number;
  isSaved?: boolean;
  createdAt?: number;
}

export interface Story {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  mediaUrl: string;
  timestamp: string;
  isViewed: boolean;
  caption?: string;
}

export interface Group {
  id: string;
  name: string;
  tagline: string;
  description: string;
  category: string;
  coverImage: string;
  avatar: string;
  memberCount: number;
  privacy: 'Público' | 'Privado';
  isMember: boolean;
  postsCount: number;
  rules?: string[];
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  text: string;
  timestamp: string;
  mediaUrl?: string;
  attachments?: Attachment[];
  isRead: boolean;
  isCallNotification?: boolean;
  callDuration?: string;
}

export interface CallState {
  isActive: boolean;
  partner: Friend | null;
  isIncoming: boolean;
  isGroupCall: boolean;
  groupName?: string;
  callType: 'video' | 'audio';
  isMuted: boolean;
  isCameraOff: boolean;
  isScreenSharing: boolean;
  callDuration: number;
  isMinimized: boolean;
}

export type ActiveTab = 'feed' | 'groups' | 'messages' | 'videos';

export type NotificationType = 
  | 'like' 
  | 'comment' 
  | 'friend_request' 
  | 'message' 
  | 'system' 
  | 'report_resolved';

export interface AppNotification {
  id: string;
  recipientId: string;
  senderId?: string;
  senderName?: string;
  senderAvatar?: string;
  type: NotificationType;
  title: string;
  content: string;
  timestamp: string;
  createdAt: number;
  isRead: boolean;
  targetId?: string;
  targetType?: 'post' | 'comment' | 'message' | 'group' | 'profile' | 'user' | 'report';
}

export type ReportCategory = 
  | 'spam' 
  | 'hate_speech' 
  | 'violence' 
  | 'harassment' 
  | 'fake_news' 
  | 'copyright' 
  | 'other';

export interface ReportItem {
  id: string;
  reporterId: string;
  reporterName: string;
  reportedItemId: string;
  reportedItemType: 'post' | 'comment' | 'user' | 'group';
  targetAuthorName?: string;
  targetAuthorAvatar?: string;
  itemContentSnippet?: string;
  category: ReportCategory;
  categoryLabel: string;
  details?: string;
  hideFromUser?: boolean;
  status: 'pending' | 'reviewed' | 'resolved' | 'dismissed';
  createdAt: number;
}
