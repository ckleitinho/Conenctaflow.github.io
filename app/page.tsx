'use client';

import React, { useState, useEffect } from 'react';
import { 
  ActiveTab, 
  Friend, 
  Group, 
  Message, 
  Post, 
  ReactionType, 
  Story,
  User,
  Attachment,
  AppNotification,
  ReportItem,
  Comment
} from '@/lib/types';
import { 
  INITIAL_GROUPS 
} from '@/lib/initial-data';
import { 
  auth, 
  onAuthStateChanged, 
  syncUserDocument, 
  logoutUser, 
  updateUserProfile 
} from '@/lib/firebase';
import { 
  subscribePosts, 
  createPostInDb, 
  updatePostReactionsInDb, 
  addCommentInDb, 
  deletePostInDb, 
  incrementPostSharesInDb, 
  subscribeGroups, 
  createGroupInDb, 
  toggleGroupMemberInDb, 
  subscribeStories, 
  createStoryInDb, 
  subscribeRealUsers, 
  subscribeAllUserMessages, 
  sendMessageInDb,
  subscribeUserNotifications,
  createNotificationInDb,
  markNotificationAsReadInDb,
  markAllNotificationsAsReadInDb,
  deleteNotificationInDb,
  createReportInDb,
  subscribeUserReports
} from '@/lib/firestore-service';
import { AuthScreen } from '@/components/AuthScreen';
import { EditProfileModal } from '@/components/EditProfileModal';
import { Navbar } from '@/components/Navbar';
import { SidebarLeft } from '@/components/SidebarLeft';
import { SidebarRight } from '@/components/SidebarRight';
import { StoriesBar } from '@/components/StoriesBar';
import { CreatePostBox } from '@/components/CreatePostBox';
import { PostCard } from '@/components/PostCard';
import { ChatView } from '@/components/ChatView';
import { GroupsView } from '@/components/GroupsView';
import { VideoHubView } from '@/components/VideoHubView';
import { VideoCallModal } from '@/components/VideoCallModal';
import { FloatingChatWindow } from '@/components/FloatingChatWindow';
import { ReportModal } from '@/components/ReportModal';
import { ReportsHistoryModal } from '@/components/ReportsHistoryModal';
import { Users, Loader2, MessageSquarePlus } from 'lucide-react';

export default function ConectaFlowHome() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('feed');

  // Auth State
  const [authLoading, setAuthLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<(User & { isAnonymous?: boolean; email?: string | null }) | null>(null);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);

  // Firestore Real-Time Data States
  const [posts, setPosts] = useState<Post[]>([]);
  const [stories, setStories] = useState<Story[]>([]);
  const [groups, setGroups] = useState<Group[]>(INITIAL_GROUPS);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [messages, setMessages] = useState<Record<string, Message[]>>({});
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [userReports, setUserReports] = useState<ReportItem[]>([]);
  const [hiddenPostIds, setHiddenPostIds] = useState<string[]>([]);

  // UI Filters & Modals
  const [searchQuery, setSearchQuery] = useState('');
  const [feedFilter, setFeedFilter] = useState<'all' | 'friends' | 'media'>('all');
  const [isQuickPostOpen, setIsQuickPostOpen] = useState(false);
  const [floatingChatFriend, setFloatingChatFriend] = useState<Friend | null>(null);
  const [activeChatFriendId, setActiveChatFriendId] = useState<string>('');

  // Report Modals
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isReportsHistoryOpen, setIsReportsHistoryOpen] = useState(false);
  const [reportedItem, setReportedItem] = useState<{
    id: string;
    type: 'post' | 'comment' | 'user' | 'group';
    authorName?: string;
    authorAvatar?: string;
    contentSnippet?: string;
  } | null>(null);

  // Video Call State
  const [videoCallState, setVideoCallState] = useState<{
    isOpen: boolean;
    partner: Friend | null;
    isIncoming: boolean;
    isGroupCall: boolean;
    groupName?: string;
  }>({
    isOpen: false,
    partner: null,
    isIncoming: false,
    isGroupCall: false,
  });

  // 1. Listen to Auth State
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const profile = await syncUserDocument(user);
          setCurrentUser({
            id: profile.id,
            name: profile.name,
            username: profile.username,
            avatar: profile.avatar,
            coverImage: profile.coverImage,
            bio: profile.bio,
            isAnonymous: profile.isAnonymous,
            email: profile.email,
            friendsCount: profile.friendsCount || 0,
            work: profile.bio,
            location: 'Brasil',
          });
        } catch (err) {
          console.error('Error syncing user document:', err);
          // Fallback user object
          setCurrentUser({
            id: user.uid,
            name: user.displayName || `Usuário #${user.uid.slice(-4)}`,
            username: `user.${user.uid.slice(0, 5)}`,
            avatar: user.photoURL || `https://api.dicebear.com/7.x/bottts/svg?seed=${user.uid}`,
            bio: user.isAnonymous ? 'Modo Anônimo' : 'Membro ConectaFlow',
            isAnonymous: user.isAnonymous,
            email: user.email,
            friendsCount: 0,
            work: 'ConectaFlow Member',
            location: 'Brasil',
          });
        }
      } else {
        setCurrentUser(null);
      }
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // 2. Real-Time Subscriptions when User is Authenticated
  useEffect(() => {
    if (!currentUser) return;

    // Subscribe to Posts
    const unsubPosts = subscribePosts((livePosts) => {
      setPosts((prev) => {
        // Retain optimistic local posts that have not yet been synced by Firestore
        const optimisticLocal = prev.filter(
          (p) =>
            p.id.startsWith('temp-') &&
            !livePosts.some(
              (lp) =>
                lp.authorId === p.authorId &&
                lp.content === p.content &&
                Math.abs((lp.createdAt || 0) - (p.createdAt || 0)) < 20000
            )
        );
        return [...optimisticLocal, ...livePosts];
      });
    });

    // Subscribe to Stories
    const unsubStories = subscribeStories((liveStories) => {
      setStories(liveStories);
    });

    // Subscribe to Groups
    const unsubGroups = subscribeGroups(currentUser.id, (liveGroups) => {
      if (liveGroups.length > 0) {
        setGroups(liveGroups);
      } else {
        setGroups(INITIAL_GROUPS);
      }
    });

    // Subscribe to Registered Real Users (Friends)
    const unsubUsers = subscribeRealUsers(currentUser.id, (liveUsers) => {
      setFriends(liveUsers);
      if (liveUsers.length > 0 && !activeChatFriendId) {
        setActiveChatFriendId(liveUsers[0].id);
      }
    });

    // Subscribe to Real-Time Messages
    const unsubMessages = subscribeAllUserMessages(currentUser.id, (messagesMap) => {
      setMessages(messagesMap);
    });

    // Subscribe to Real-Time Notifications
    const unsubNotifs = subscribeUserNotifications(currentUser.id, (liveNotifs) => {
      setNotifications(liveNotifs);
    });

    // Subscribe to Real-Time Reports
    const unsubReports = subscribeUserReports(currentUser.id, (liveReports) => {
      setUserReports(liveReports);
    });

    return () => {
      unsubPosts();
      unsubStories();
      unsubGroups();
      unsubUsers();
      unsubMessages();
      unsubNotifs();
      unsubReports();
    };
  }, [currentUser?.id]);

  // Auth Action Handlers
  const handleLogout = async () => {
    if (currentUser) {
      await logoutUser(currentUser.id);
    } else {
      await logoutUser();
    }
  };

  const handleSaveProfile = async (newName: string, newAvatar: string, newBio?: string) => {
    if (!currentUser) return;
    await updateUserProfile(currentUser.id, {
      name: newName,
      avatar: newAvatar,
      bio: newBio,
    });
    setCurrentUser((prev) =>
      prev
        ? {
            ...prev,
            name: newName,
            avatar: newAvatar,
            bio: newBio,
            work: newBio,
          }
        : null
    );
  };

  // Publish Post to Firestore
  const handlePublishPost = async (postData: {
    content: string;
    image?: string;
    attachments?: Attachment[];
    feeling?: string;
    location?: string;
    privacy: 'public' | 'friends' | 'only_me';
    groupId?: string;
    groupName?: string;
  }) => {
    if (!currentUser) return;

    const tempId = `temp-${Date.now()}`;
    const newPost: Post = {
      id: tempId,
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorAvatar: currentUser.avatar,
      timestamp: 'Agora mesmo',
      content: postData.content || '',
      privacy: postData.privacy || 'public',
      reactions: { like: 1, love: 0, haha: 0, wow: 0, sad: 0, angry: 0 },
      userReaction: 'like',
      comments: [],
      sharesCount: 0,
      createdAt: Date.now(),
      attachments: postData.attachments && postData.attachments.length > 0 ? postData.attachments : [],
      ...(postData.image ? { image: postData.image } : {}),
      ...(postData.feeling ? { feeling: postData.feeling } : {}),
      ...(postData.location ? { location: postData.location } : {}),
      ...(postData.groupId ? { groupId: postData.groupId } : {}),
      ...(postData.groupName ? { groupName: postData.groupName } : {}),
    };

    // Instant optimistic UI addition
    setPosts((prev) => [newPost, ...prev.filter((p) => p.id !== tempId)]);

    try {
      const dbPayload: Record<string, any> = {
        authorId: newPost.authorId,
        authorName: newPost.authorName,
        authorAvatar: newPost.authorAvatar,
        timestamp: newPost.timestamp,
        content: newPost.content,
        privacy: newPost.privacy,
        reactions: newPost.reactions,
        userReaction: newPost.userReaction,
        comments: newPost.comments,
        sharesCount: newPost.sharesCount,
        createdAt: newPost.createdAt,
        attachments: newPost.attachments || [],
      };

      if (newPost.image) dbPayload.image = newPost.image;
      if (newPost.feeling) dbPayload.feeling = newPost.feeling;
      if (newPost.location) dbPayload.location = newPost.location;
      if (newPost.groupId) dbPayload.groupId = newPost.groupId;
      if (newPost.groupName) dbPayload.groupName = newPost.groupName;

      const docRef = await createPostInDb(dbPayload as any);

      if (docRef?.id) {
        setPosts((prev) =>
          prev.map((p) => (p.id === tempId ? { ...p, id: docRef.id } : p))
        );
      }
    } catch (err) {
      console.error('Error creating post in Firestore:', err);
    }
  };

  // Post Reactions
  const handleReactPost = async (postId: string, reaction: ReactionType | null) => {
    const post = posts.find((p) => p.id === postId);
    if (!post) return;

    const currentReaction = post.userReaction;
    const newReactions = { ...post.reactions };

    if (currentReaction) {
      newReactions[currentReaction] = Math.max(0, newReactions[currentReaction] - 1);
    }
    if (reaction) {
      newReactions[reaction] = (newReactions[reaction] || 0) + 1;
    }

    // Optimistic update in state
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? {
              ...p,
              userReaction: reaction,
              reactions: newReactions,
            }
          : p
      )
    );

    try {
      await updatePostReactionsInDb(postId, newReactions);
      // Criar notificação para o autor da postagem (se não for o próprio usuário)
      if (reaction && post.authorId && post.authorId !== currentUser?.id) {
        await createNotificationInDb({
          recipientId: post.authorId,
          senderId: currentUser?.id,
          senderName: currentUser?.name,
          senderAvatar: currentUser?.avatar,
          type: 'like',
          title: 'Nova reação',
          content: `reagiu com ${reaction} à sua publicação: "${post.content.slice(0, 45)}..."`,
          timestamp: 'Agora',
          createdAt: Date.now(),
          isRead: false,
          targetId: post.id,
          targetType: 'post',
        });
      }
    } catch (err) {
      console.error('Error updating reaction:', err);
    }
  };

  // Add Comment
  const handleAddComment = async (postId: string, text: string) => {
    if (!currentUser) return;
    const post = posts.find((p) => p.id === postId);
    if (!post) return;

    const newComment = {
      id: `c-${Date.now()}`,
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorAvatar: currentUser.avatar,
      text,
      timestamp: 'Agora mesmo',
      likes: 0,
    };

    // Optimistic update
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? {
              ...p,
              comments: [newComment, ...p.comments],
            }
          : p
      )
    );

    try {
      await addCommentInDb(postId, newComment, post.comments);
      // Criar notificação para o autor da postagem (se não for o próprio autor)
      if (post.authorId && post.authorId !== currentUser.id) {
        await createNotificationInDb({
          recipientId: post.authorId,
          senderId: currentUser.id,
          senderName: currentUser.name,
          senderAvatar: currentUser.avatar,
          type: 'comment',
          title: 'Novo comentário',
          content: `comentou em sua publicação: "${text.slice(0, 50)}"`,
          timestamp: 'Agora',
          createdAt: Date.now(),
          isRead: false,
          targetId: post.id,
          targetType: 'post',
        });
      }
    } catch (err) {
      console.error('Error adding comment to Firestore:', err);
    }
  };

  // Delete Post
  const handleDeletePost = async (postId: string) => {
    setPosts((prev) => prev.filter((p) => p.id !== postId));
    try {
      await deletePostInDb(postId);
    } catch (err) {
      console.error('Error deleting post in Firestore:', err);
    }
  };

  // Share Post
  const handleSharePost = async (postId: string) => {
    const post = posts.find((p) => p.id === postId);
    if (!post) return;

    setPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, sharesCount: p.sharesCount + 1 } : p))
    );

    try {
      await incrementPostSharesInDb(postId, post.sharesCount);
    } catch (err) {
      console.error('Error sharing post:', err);
    }
  };

  // Add Story
  const handleAddStory = async (mediaUrl: string, caption: string) => {
    if (!currentUser) return;

    const newStory: Omit<Story, 'id'> = {
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      mediaUrl,
      caption: caption || undefined,
      timestamp: 'Agora mesmo',
      isViewed: false,
    };

    try {
      await createStoryInDb(newStory);
    } catch (err) {
      console.error('Error creating story:', err);
    }
  };

  // Send Story Reply
  const handleSendStoryReply = async (recipientUserId: string, replyText: string) => {
    await handleSendMessage(recipientUserId, `[Resposta ao Story]: ${replyText}`);
  };

  // Send Chat Message
  const handleSendMessage = async (
    recipientFriendId: string, 
    text: string, 
    attachments?: Attachment[]
  ) => {
    if (!currentUser || (!text.trim() && (!attachments || attachments.length === 0))) return;

    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Optimistic local state update
    const optimisticMsg: Message = {
      id: `tmp-${Date.now()}`,
      senderId: currentUser.id,
      receiverId: recipientFriendId,
      text: text.trim(),
      attachments: attachments || [],
      timestamp,
      isRead: true,
    };

    setMessages((prev) => ({
      ...prev,
      [recipientFriendId]: [...(prev[recipientFriendId] || []), optimisticMsg],
    }));

    try {
      await sendMessageInDb({
        senderId: currentUser.id,
        receiverId: recipientFriendId,
        text: text.trim(),
        timestamp,
        attachments: attachments || [],
      });

      // Criar notificação para o destinatário da mensagem
      await createNotificationInDb({
        recipientId: recipientFriendId,
        senderId: currentUser.id,
        senderName: currentUser.name,
        senderAvatar: currentUser.avatar,
        type: 'message',
        title: 'Nova mensagem',
        content: `enviou uma mensagem: "${text.trim() ? text.trim().slice(0, 40) : 'Enviou um anexo'}"`,
        timestamp: 'Agora',
        createdAt: Date.now(),
        isRead: false,
        targetId: recipientFriendId,
        targetType: 'message',
      });
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  // ================= NOTIFICAÇÕES & DENÚNCIAS HANDLERS ================= //
  const handleMarkNotificationAsRead = async (notifId: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notifId ? { ...n, isRead: true } : n))
    );
    try {
      await markNotificationAsReadInDb(notifId);
    } catch (err) {
      console.error('Error marking notification read:', err);
    }
  };

  const handleMarkAllNotificationsAsRead = async () => {
    const unreadIds = notifications.filter((n) => !n.isRead).map((n) => n.id);
    if (unreadIds.length === 0) return;

    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    try {
      await markAllNotificationsAsReadInDb(unreadIds);
    } catch (err) {
      console.error('Error marking all notifications read:', err);
    }
  };

  const handleDeleteNotification = async (notifId: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== notifId));
    try {
      await deleteNotificationInDb(notifId);
    } catch (err) {
      console.error('Error deleting notification:', err);
    }
  };

  const handleNotificationClick = (notif: AppNotification) => {
    if (notif.targetType === 'message' && notif.senderId) {
      const friend = friends.find((f) => f.id === notif.senderId);
      if (friend) {
        handleOpenChatWithFriend(friend);
      } else {
        setActiveTab('messages');
      }
    } else if (notif.targetType === 'group') {
      setActiveTab('groups');
    } else if (notif.targetType === 'post') {
      setActiveTab('feed');
    }
  };

  const handleOpenReportPost = (post: Post) => {
    setReportedItem({
      id: post.id,
      type: 'post',
      authorName: post.authorName,
      authorAvatar: post.authorAvatar,
      contentSnippet: post.content ? post.content.slice(0, 120) : 'Publicação com anexo de mídia',
    });
    setIsReportModalOpen(true);
  };

  const handleOpenReportComment = (postId: string, comment: Comment) => {
    setReportedItem({
      id: comment.id,
      type: 'comment',
      authorName: comment.authorName,
      authorAvatar: comment.authorAvatar,
      contentSnippet: comment.text.slice(0, 120),
    });
    setIsReportModalOpen(true);
  };

  const handleSubmitReport = async (reportData: {
    reportedItemId: string;
    reportedItemType: 'post' | 'comment' | 'user' | 'group';
    targetAuthorName?: string;
    targetAuthorAvatar?: string;
    itemContentSnippet?: string;
    category: any;
    categoryLabel: string;
    details?: string;
    hideFromUser?: boolean;
  }) => {
    if (!currentUser) return;

    await createReportInDb({
      ...reportData,
      reporterId: currentUser.id,
      reporterName: currentUser.name,
      status: 'pending',
      createdAt: Date.now(),
    });

    if (reportData.hideFromUser && reportData.reportedItemType === 'post') {
      setHiddenPostIds((prev) => [...prev, reportData.reportedItemId]);
    }
  };

  // Video Call Controls
  const handleStartCallWithFriend = (friend: Friend) => {
    setVideoCallState({
      isOpen: true,
      partner: friend,
      isIncoming: false,
      isGroupCall: false,
    });
  };

  const handleStartInstantRoom = () => {
    setVideoCallState({
      isOpen: true,
      partner: null,
      isIncoming: false,
      isGroupCall: false,
    });
  };

  const handleStartGroupCall = (group: Group) => {
    setVideoCallState({
      isOpen: true,
      partner: null,
      isIncoming: false,
      isGroupCall: true,
      groupName: group.name,
    });
  };

  // Toggle Join Group
  const handleToggleJoinGroup = async (groupId: string) => {
    if (!currentUser) return;
    const group = groups.find((g) => g.id === groupId);
    if (!group) return;

    const nextIsMember = !group.isMember;

    setGroups((prev) =>
      prev.map((g) => {
        if (g.id === groupId) {
          return {
            ...g,
            isMember: nextIsMember,
            memberCount: nextIsMember ? g.memberCount + 1 : Math.max(1, g.memberCount - 1),
          };
        }
        return g;
      })
    );

    try {
      await toggleGroupMemberInDb(groupId, currentUser.id, group.isMember, []);
    } catch (err) {
      console.warn('Group update in Firestore note:', err);
    }
  };

  // Create Group
  const handleCreateGroup = async (newG: Omit<Group, 'id' | 'postsCount'>) => {
    if (!currentUser) return;

    try {
      await createGroupInDb(newG, currentUser.id);
    } catch (err) {
      console.error('Error creating group in Firestore:', err);
      // Fallback local addition
      const fallbackGroup: Group = {
        ...newG,
        id: `g-${Date.now()}`,
        postsCount: 0,
      };
      setGroups((prev) => [fallbackGroup, ...prev]);
    }
  };

  // Open floating chat
  const handleOpenChatWithFriend = (friend: Friend) => {
    setFloatingChatFriend(friend);
    setActiveChatFriendId(friend.id);
  };

  // Filter feed posts
  const filteredPosts = posts
    .filter((p) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          p.content.toLowerCase().includes(q) ||
          p.authorName.toLowerCase().includes(q) ||
          (p.groupName && p.groupName.toLowerCase().includes(q))
        );
      }
      return true;
    })
    .filter((p) => {
      if (!currentUser) return true;
      if (hiddenPostIds.includes(p.id)) return false;
      // 'only_me' posts are only visible to the author
      if (p.privacy === 'only_me' && p.authorId !== currentUser.id) return false;
      if (feedFilter === 'friends') {
        return p.privacy === 'friends' || p.authorId === currentUser.id;
      }
      if (feedFilter === 'media') {
        return Boolean(p.image) || (p.attachments && p.attachments.some((a) => a.type === 'image' || a.type === 'video'));
      }
      return true;
    });

  // Calculate total unread messages
  const totalUnreadCount = Object.values(messages).reduce(
    (acc, msgs) => acc + msgs.filter((m) => !m.isRead && m.receiverId === currentUser?.id).length,
    0
  );

  // Loading Screen
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#F0F2F5] flex flex-col items-center justify-center p-4">
        <div className="w-16 h-16 rounded-full bg-[#1877F2] flex items-center justify-center text-white text-2xl font-black shadow-lg mb-4 animate-bounce">
          CF
        </div>
        <div className="flex items-center gap-2 text-sm font-semibold text-[#1877F2]">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Iniciando ConectaFlow...</span>
        </div>
      </div>
    );
  }

  // Not Authenticated: Render Google & Anonymous Login
  if (!currentUser) {
    return <AuthScreen onLoginSuccess={() => setAuthLoading(true)} />;
  }

  return (
    <div className="min-h-screen bg-[#F0F2F5] text-[#050505] flex flex-col selection:bg-[#1877F2] selection:text-white">
      {/* Top Navbar with Real Auth Data, Notifications and Logout */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        unreadMessagesCount={totalUnreadCount}
        notifications={notifications}
        onOpenQuickPost={() => setIsQuickPostOpen(true)}
        onStartInstantCall={handleStartInstantRoom}
        onSelectFriendChat={handleOpenChatWithFriend}
        onMarkNotificationAsRead={handleMarkNotificationAsRead}
        onMarkAllNotificationsAsRead={handleMarkAllNotificationsAsRead}
        onDeleteNotification={handleDeleteNotification}
        onNotificationClick={handleNotificationClick}
        onOpenReportsHistory={() => setIsReportsHistoryOpen(true)}
        friends={friends}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onLogout={handleLogout}
        onEditProfile={() => setIsEditProfileOpen(true)}
      />

      {/* Main 3-Column Facebook Layout */}
      <div className="flex-1 flex justify-center w-full max-w-7xl mx-auto px-2 sm:px-4 py-3 gap-4">
        {/* Left Sidebar (Shortcuts & Joined Groups) */}
        <SidebarLeft
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          currentUser={currentUser}
          groups={groups}
          onSelectGroup={() => setActiveTab('groups')}
          onStartInstantCall={handleStartInstantRoom}
        />

        {/* Center Main Stage */}
        <main className="flex-1 max-w-2xl min-w-0 w-full">
          {/* 1. FEED VIEW */}
          {activeTab === 'feed' && (
            <div className="space-y-3 pb-16">
              {/* Stories Bar */}
              <StoriesBar
                stories={stories}
                currentUser={currentUser}
                onAddStory={handleAddStory}
                onSendStoryReply={handleSendStoryReply}
              />

              {/* Create Post Box */}
              <CreatePostBox
                currentUser={currentUser}
                groups={groups}
                onPublishPost={handlePublishPost}
                onStartInstantCall={handleStartInstantRoom}
                isOpenModal={isQuickPostOpen}
                onCloseModal={() => setIsQuickPostOpen(false)}
              />

              {/* Feed Filters */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 select-none">
                <button
                  onClick={() => setFeedFilter('all')}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    feedFilter === 'all'
                      ? 'bg-[#1877F2] text-white shadow-2xs'
                      : 'bg-white text-[#65676B] hover:bg-[#E4E6EB] border border-[#E4E6EB]'
                  }`}
                >
                  Todos
                </button>
                <button
                  onClick={() => setFeedFilter('friends')}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                    feedFilter === 'friends'
                      ? 'bg-[#1877F2] text-white shadow-2xs'
                      : 'bg-white text-[#65676B] hover:bg-[#E4E6EB] border border-[#E4E6EB]'
                  }`}
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>Amigos</span>
                </button>
                <button
                  onClick={() => setFeedFilter('media')}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                    feedFilter === 'media'
                      ? 'bg-[#1877F2] text-white shadow-2xs'
                      : 'bg-white text-[#65676B] hover:bg-[#E4E6EB] border border-[#E4E6EB]'
                  }`}
                >
                  <span>Fotos & Mídia</span>
                </button>
              </div>

              {/* Posts Feed from Firestore */}
              {filteredPosts.length > 0 ? (
                filteredPosts.map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    currentUser={currentUser}
                    onReact={handleReactPost}
                    onAddComment={handleAddComment}
                    onDeletePost={handleDeletePost}
                    onSharePost={handleSharePost}
                    onReportPost={handleOpenReportPost}
                    onReportComment={handleOpenReportComment}
                  />
                ))
              ) : (
                <div className="bg-white rounded-2xl border border-[#E4E6EB] p-8 text-center text-[#65676B] space-y-3">
                  <div className="w-12 h-12 rounded-full bg-[#E7F3FF] text-[#1877F2] flex items-center justify-center mx-auto">
                    <MessageSquarePlus className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-sm text-[#050505]">
                    Nenhuma publicação no feed ainda
                  </h3>
                  <p className="text-xs leading-relaxed max-w-sm mx-auto">
                    Compartilhe fotos, reflexões ou sentimentos com a comunidade usando o formulário acima!
                  </p>
                  <button
                    onClick={() => setIsQuickPostOpen(true)}
                    className="bg-[#1877F2] hover:bg-[#166FE5] text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors cursor-pointer shadow-xs"
                  >
                    Publicar agora no ConectaFlow
                  </button>
                </div>
              )}
            </div>
          )}

          {/* 2. GROUPS VIEW */}
          {activeTab === 'groups' && (
            <GroupsView
              groups={groups}
              posts={posts}
              currentUser={currentUser}
              onToggleJoinGroup={handleToggleJoinGroup}
              onCreateGroup={handleCreateGroup}
              onStartGroupVideoCall={handleStartGroupCall}
              onReactPost={handleReactPost}
              onAddComment={handleAddComment}
              onPublishGroupPost={handlePublishPost}
              onSharePost={handleSharePost}
              onReportPost={handleOpenReportPost}
              onReportComment={handleOpenReportComment}
            />
          )}

          {/* 3. MESSAGES VIEW (Messenger style) */}
          {activeTab === 'messages' && (
            <ChatView
              currentUser={currentUser}
              friends={friends}
              messages={messages}
              activeFriendId={activeChatFriendId}
              onSelectFriend={(id) => setActiveChatFriendId(id)}
              onSendMessage={handleSendMessage}
              onStartVideoCallWithFriend={handleStartCallWithFriend}
              onStartAudioCallWithFriend={handleStartCallWithFriend}
            />
          )}

          {/* 4. VIDEO CALLS HUB */}
          {activeTab === 'videos' && (
            <VideoHubView
              currentUser={currentUser}
              friends={friends}
              groups={groups}
              onStartCallWithFriend={handleStartCallWithFriend}
              onStartInstantRoom={handleStartInstantRoom}
              onStartGroupCall={handleStartGroupCall}
            />
          )}
        </main>

        {/* Right Sidebar (Real Online Contacts from Firestore) */}
        <SidebarRight
          friends={friends}
          onStartVideoCallWithFriend={handleStartCallWithFriend}
          onOpenChatWithFriend={handleOpenChatWithFriend}
        />
      </div>

      {/* Floating Messenger Window at Bottom-Right */}
      {floatingChatFriend && (
        <FloatingChatWindow
          friend={floatingChatFriend}
          currentUser={currentUser}
          messages={messages[floatingChatFriend.id] || []}
          onSendMessage={handleSendMessage}
          onClose={() => setFloatingChatFriend(null)}
          onStartVideoCall={handleStartCallWithFriend}
          onExpandToFullChat={() => {
            setActiveChatFriendId(floatingChatFriend.id);
            setActiveTab('messages');
            setFloatingChatFriend(null);
          }}
        />
      )}

      {/* WebRTC Real-Time Video Call Screen Modal */}
      <VideoCallModal
        isOpen={videoCallState.isOpen}
        onClose={() =>
          setVideoCallState({
            isOpen: false,
            partner: null,
            isIncoming: false,
            isGroupCall: false,
          })
        }
        partner={videoCallState.partner}
        currentUser={currentUser}
        isIncoming={videoCallState.isIncoming}
        isGroupCall={videoCallState.isGroupCall}
        groupName={videoCallState.groupName}
        onAcceptIncoming={() =>
          setVideoCallState((prev) => ({ ...prev, isIncoming: false }))
        }
      />

      {/* Edit Profile Modal */}
      <EditProfileModal
        currentUser={currentUser}
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
        onSave={handleSaveProfile}
      />

      {/* Report Modal */}
      {reportedItem && (
        <ReportModal
          isOpen={isReportModalOpen}
          onClose={() => {
            setIsReportModalOpen(false);
            setReportedItem(null);
          }}
          currentUser={currentUser}
          reportedItem={reportedItem}
          onSubmitReport={handleSubmitReport}
        />
      )}

      {/* Reports History & Safety Status Modal */}
      <ReportsHistoryModal
        isOpen={isReportsHistoryOpen}
        onClose={() => setIsReportsHistoryOpen(false)}
        reports={userReports}
      />
    </div>
  );
}
