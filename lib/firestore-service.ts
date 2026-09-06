import { 
  collection, 
  doc, 
  setDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  where, 
  limit, 
  serverTimestamp 
} from 'firebase/firestore';
import { db } from './firebase';
import { Post, Friend, Group, Story, Message, ReactionType, Comment, AppNotification, ReportItem } from './types';

// Helper to remove any undefined fields before sending to Firestore
export function removeUndefinedFields<T extends Record<string, any>>(obj: T): T {
  if (obj === null || obj === undefined) return obj;
  if (Array.isArray(obj)) {
    return obj
      .filter((item) => item !== undefined)
      .map((item) =>
        typeof item === 'object' && item !== null && !(item instanceof Date)
          ? removeUndefinedFields(item)
          : item
      ) as unknown as T;
  }
  const result: Record<string, any> = {};
  for (const [key, val] of Object.entries(obj)) {
    if (val === undefined) {
      continue;
    }
    if (val !== null && typeof val === 'object' && !(val instanceof Date)) {
      result[key] = removeUndefinedFields(val);
    } else {
      result[key] = val;
    }
  }
  return result as T;
}

// ================= USERS / FRIENDS ================= //
export function subscribeRealUsers(
  currentUserId: string,
  onUsersUpdate: (users: Friend[]) => void
) {
  const usersRef = collection(db, 'users');
  return onSnapshot(usersRef, (snapshot) => {
    const friends: Friend[] = [];
    snapshot.forEach((docSnap) => {
      if (docSnap.id !== currentUserId) {
        const data = docSnap.data();
        friends.push({
          id: docSnap.id,
          name: data.name || 'Usuário',
          avatar: data.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${docSnap.id}`,
          isOnline: Boolean(data.isOnline),
          lastSeen: data.isOnline ? 'Online agora' : data.lastSeen || 'Offline',
          mutualFriends: 0,
          statusMessage: data.bio || '',
        });
      }
    });
    // Sort online users first
    friends.sort((a, b) => (b.isOnline ? 1 : 0) - (a.isOnline ? 1 : 0));
    onUsersUpdate(friends);
  }, (error) => {
    console.warn('Real users subscription error:', error);
  });
}

function formatRelativeTime(createdAt?: number, fallback?: string): string {
  if (!createdAt) return fallback || 'Recentemente';
  const diff = Date.now() - createdAt;
  if (diff < 60000) return 'Agora mesmo';
  if (diff < 3600000) return `Há ${Math.floor(diff / 60000)} min`;
  if (diff < 86400000) return `Há ${Math.floor(diff / 3600000)} h`;
  return new Date(createdAt).toLocaleDateString([], { day: '2-digit', month: '2-digit' });
}

// ================= POSTS ================= //
export function subscribePosts(onPostsUpdate: (posts: Post[]) => void) {
  const postsRef = collection(db, 'posts');
  // Order by createdAt timestamp descending
  const q = query(postsRef, limit(50));

  return onSnapshot(q, (snapshot) => {
    const list: Post[] = [];
    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      list.push({
        id: docSnap.id,
        authorId: data.authorId || '',
        authorName: data.authorName || 'Membro',
        authorAvatar: data.authorAvatar || 'https://api.dicebear.com/7.x/bottts/svg?seed=avatar',
        timestamp: data.timestamp || formatRelativeTime(data.createdAt, 'Agora mesmo'),
        content: data.content || '',
        image: data.image,
        attachments: data.attachments || [],
        feeling: data.feeling,
        location: data.location,
        privacy: data.privacy || 'public',
        groupId: data.groupId,
        groupName: data.groupName,
        reactions: data.reactions || { like: 0, love: 0, haha: 0, wow: 0, sad: 0, angry: 0 },
        comments: data.comments || [],
        sharesCount: data.sharesCount || 0,
        createdAt: data.createdAt || Date.now(),
      } as any);
    });

    // Client sort descending by createdAt
    list.sort((a: any, b: any) => (b.createdAt || 0) - (a.createdAt || 0));
    onPostsUpdate(list);
  }, (error) => {
    console.warn('Posts subscription error:', error);
  });
}

export async function createPostInDb(post: Omit<Post, 'id'>) {
  const postsRef = collection(db, 'posts');
  const postData = removeUndefinedFields({
    ...post,
    createdAt: post.createdAt || Date.now(),
  });
  return await addDoc(postsRef, postData);
}

export async function updatePostReactionsInDb(
  postId: string,
  newReactions: Record<string, number>
) {
  const postRef = doc(db, 'posts', postId);
  return await updateDoc(postRef, {
    reactions: newReactions,
  });
}

export async function addCommentInDb(postId: string, comment: Comment, currentComments: Comment[]) {
  const postRef = doc(db, 'posts', postId);
  return await updateDoc(postRef, {
    comments: [comment, ...currentComments],
  });
}

export async function deletePostInDb(postId: string) {
  const postRef = doc(db, 'posts', postId);
  return await deleteDoc(postRef);
}

export async function incrementPostSharesInDb(postId: string, currentShares: number) {
  const postRef = doc(db, 'posts', postId);
  return await updateDoc(postRef, {
    sharesCount: currentShares + 1,
  });
}

// ================= GROUPS ================= //
export function subscribeGroups(currentUserId: string, onGroupsUpdate: (groups: Group[]) => void) {
  const groupsRef = collection(db, 'groups');
  return onSnapshot(groupsRef, (snapshot) => {
    const list: Group[] = [];
    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      const members = Array.isArray(data.members) ? data.members : [];
      list.push({
        id: docSnap.id,
        name: data.name || 'Comunidade',
        tagline: data.tagline || '',
        description: data.description || '',
        category: data.category || 'Geral',
        coverImage: data.coverImage || 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1000&auto=format&fit=crop&q=80',
        avatar: data.avatar || 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=200&auto=format&fit=crop&q=80',
        memberCount: Math.max(members.length, data.memberCount || 1),
        privacy: data.privacy || 'Público',
        isMember: members.includes(currentUserId),
        postsCount: data.postsCount || 0,
        rules: data.rules || [
          'Respeito mútuo entre todos os membros',
          'Compartilhe conteúdo relevante',
        ],
      });
    });
    onGroupsUpdate(list);
  }, (error) => {
    console.warn('Groups subscription error:', error);
  });
}

export async function createGroupInDb(group: Omit<Group, 'id' | 'postsCount'>, creatorId: string) {
  const groupsRef = collection(db, 'groups');
  return await addDoc(groupsRef, removeUndefinedFields({
    ...group,
    createdBy: creatorId,
    members: [creatorId],
    memberCount: 1,
    postsCount: 0,
    createdAt: Date.now(),
  }));
}

export async function toggleGroupMemberInDb(
  groupId: string,
  userId: string,
  currentIsMember: boolean,
  currentMembers: string[] = []
) {
  const groupRef = doc(db, 'groups', groupId);
  const nextMembers = currentIsMember
    ? currentMembers.filter((m) => m !== userId)
    : Array.from(new Set([...currentMembers, userId]));

  return await updateDoc(groupRef, {
    members: nextMembers,
    memberCount: Math.max(1, nextMembers.length),
  });
}

export async function setGroupMembersInDb(groupId: string, members: string[]) {
  const groupRef = doc(db, 'groups', groupId);
  return await updateDoc(groupRef, {
    members,
    memberCount: members.length,
  });
}

// ================= STORIES ================= //
export function subscribeStories(onStoriesUpdate: (stories: Story[]) => void) {
  const storiesRef = collection(db, 'stories');
  const q = query(storiesRef, limit(30));

  return onSnapshot(q, (snapshot) => {
    const list: Story[] = [];
    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      list.push({
        id: docSnap.id,
        userId: data.userId || '',
        userName: data.userName || 'Membro',
        userAvatar: data.userAvatar || 'https://api.dicebear.com/7.x/bottts/svg?seed=avatar',
        mediaUrl: data.mediaUrl || '',
        timestamp: data.timestamp || 'Recentemente',
        isViewed: false,
        caption: data.caption,
      });
    });
    onStoriesUpdate(list);
  }, (error) => {
    console.warn('Stories subscription error:', error);
  });
}

export async function createStoryInDb(story: Omit<Story, 'id'>) {
  const storiesRef = collection(db, 'stories');
  return await addDoc(storiesRef, removeUndefinedFields({
    ...story,
    createdAt: Date.now(),
  }));
}

// ================= MESSAGES (REAL-TIME CHAT) ================= //
export function getChatId(userA: string, userB: string): string {
  return [userA, userB].sort().join('_');
}

export function subscribeAllUserMessages(
  currentUserId: string,
  onMessagesUpdate: (messagesMap: Record<string, Message[]>) => void
) {
  const messagesRef = collection(db, 'messages');
  const q = query(messagesRef, limit(300));

  return onSnapshot(q, (snapshot) => {
    const map: Record<string, Message[]> = {};
    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      if (data.senderId === currentUserId || data.receiverId === currentUserId) {
        const otherId = data.senderId === currentUserId ? data.receiverId : data.senderId;
        if (!map[otherId]) map[otherId] = [];
        map[otherId].push({
          id: docSnap.id,
          senderId: data.senderId,
          receiverId: data.receiverId,
          text: data.text,
          timestamp: data.timestamp,
          attachments: data.attachments || [],
          isRead: data.isRead,
          createdAt: data.createdAt || 0,
        } as any);
      }
    });

    Object.keys(map).forEach((k) => {
      map[k].sort((a: any, b: any) => (a.createdAt || 0) - (b.createdAt || 0));
    });

    onMessagesUpdate(map);
  }, (error) => {
    console.warn('All messages subscription error:', error);
  });
}

export function subscribeUserMessages(
  chatId: string,
  onMessagesUpdate: (msgs: Message[]) => void
) {
  const messagesRef = collection(db, 'messages');
  const q = query(messagesRef, where('chatId', '==', chatId), limit(100));

  return onSnapshot(q, (snapshot) => {
    const list: Message[] = [];
    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      list.push({
        id: docSnap.id,
        senderId: data.senderId,
        receiverId: data.receiverId,
        text: data.text,
        timestamp: data.timestamp,
        attachments: data.attachments || [],
        isRead: data.isRead,
        createdAt: data.createdAt || 0,
      } as any);
    });

    list.sort((a: any, b: any) => (a.createdAt || 0) - (b.createdAt || 0));
    onMessagesUpdate(list);
  }, (error) => {
    console.warn('Messages subscription error:', error);
  });
}

export async function sendMessageInDb(message: {
  senderId: string;
  receiverId: string;
  text: string;
  timestamp: string;
  attachments?: any[];
}) {
  const messagesRef = collection(db, 'messages');
  const chatId = getChatId(message.senderId, message.receiverId);

  return await addDoc(messagesRef, removeUndefinedFields({
    chatId,
    senderId: message.senderId,
    receiverId: message.receiverId,
    text: message.text,
    timestamp: message.timestamp,
    attachments: message.attachments || [],
    createdAt: Date.now(),
    isRead: false,
  }));
}

// ================= NOTIFICAÇÕES ================= //
export function subscribeUserNotifications(
  recipientId: string,
  onNotificationsUpdate: (notifs: AppNotification[]) => void
) {
  const notifsRef = collection(db, 'notifications');
  const q = query(notifsRef, where('recipientId', '==', recipientId), limit(50));

  return onSnapshot(q, (snapshot) => {
    const list: AppNotification[] = [];
    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      list.push({
        id: docSnap.id,
        recipientId: data.recipientId,
        senderId: data.senderId,
        senderName: data.senderName,
        senderAvatar: data.senderAvatar,
        type: data.type || 'system',
        title: data.title || 'Notificação',
        content: data.content || '',
        timestamp: data.timestamp || 'Recentemente',
        createdAt: data.createdAt || 0,
        isRead: Boolean(data.isRead),
        targetId: data.targetId,
        targetType: data.targetType,
      });
    });

    // Client-side sort by createdAt desc
    list.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
    onNotificationsUpdate(list);
  }, (error) => {
    console.warn('Notifications subscription error:', error);
  });
}

export async function createNotificationInDb(notif: Omit<AppNotification, 'id'>) {
  const notifsRef = collection(db, 'notifications');
  return await addDoc(notifsRef, removeUndefinedFields({
    ...notif,
    createdAt: notif.createdAt || Date.now(),
    isRead: false,
  }));
}

export async function markNotificationAsReadInDb(notificationId: string) {
  const notifRef = doc(db, 'notifications', notificationId);
  return await updateDoc(notifRef, {
    isRead: true,
  });
}

export async function markAllNotificationsAsReadInDb(notificationIds: string[]) {
  const promises = notificationIds.map((id) => {
    const notifRef = doc(db, 'notifications', id);
    return updateDoc(notifRef, { isRead: true });
  });
  return await Promise.all(promises);
}

export async function deleteNotificationInDb(notificationId: string) {
  const notifRef = doc(db, 'notifications', notificationId);
  return await deleteDoc(notifRef);
}

// ================= DENÚNCIAS (REPORTS) ================= //
export async function createReportInDb(report: Omit<ReportItem, 'id'>) {
  const reportsRef = collection(db, 'reports');
  const docRef = await addDoc(reportsRef, removeUndefinedFields({
    ...report,
    status: report.status || 'pending',
    createdAt: Date.now(),
  }));

  // Também criar automaticamente uma notificação do sistema para o usuário que denunciou
  await createNotificationInDb({
    recipientId: report.reporterId,
    type: 'system',
    title: 'Denúncia recebida',
    content: `Sua denúncia sobre ${report.reportedItemType === 'post' ? 'a publicação' : report.reportedItemType === 'comment' ? 'o comentário' : 'o conteúdo'} foi registrada sob análise da moderação.`,
    timestamp: 'Agora',
    createdAt: Date.now(),
    isRead: false,
    targetId: report.reportedItemId,
    targetType: report.reportedItemType,
  });

  return docRef;
}

export function subscribeUserReports(
  reporterId: string,
  onReportsUpdate: (reports: ReportItem[]) => void
) {
  const reportsRef = collection(db, 'reports');
  const q = query(reportsRef, where('reporterId', '==', reporterId), limit(50));

  return onSnapshot(q, (snapshot) => {
    const list: ReportItem[] = [];
    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      list.push({
        id: docSnap.id,
        reporterId: data.reporterId,
        reporterName: data.reporterName,
        reportedItemId: data.reportedItemId,
        reportedItemType: data.reportedItemType,
        targetAuthorName: data.targetAuthorName,
        targetAuthorAvatar: data.targetAuthorAvatar,
        itemContentSnippet: data.itemContentSnippet,
        category: data.category,
        categoryLabel: data.categoryLabel,
        details: data.details,
        hideFromUser: data.hideFromUser,
        status: data.status || 'pending',
        createdAt: data.createdAt || 0,
      });
    });

    list.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
    onReportsUpdate(list);
  }, (error) => {
    console.warn('Reports subscription error:', error);
  });
}
