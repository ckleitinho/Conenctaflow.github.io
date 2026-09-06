import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInAnonymously, 
  signOut as fbSignOut, 
  updateProfile as fbUpdateProfile,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  serverTimestamp,
  getDocFromServer 
} from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

// Initialize Firebase App
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Auth
export const auth = getAuth(app);

// Initialize Firestore with custom firestoreDatabaseId if configured
export const db = getFirestore(
  app, 
  firebaseConfig.firestoreDatabaseId && firebaseConfig.firestoreDatabaseId !== '' 
    ? firebaseConfig.firestoreDatabaseId 
    : '(default)'
);

// Validate Connection to Firestore on startup
async function testConnection() {
  if (typeof window === 'undefined') return;
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn("ConectaFlow: Firestore client appears offline. Please check your network connection.");
    }
  }
}
testConnection();

// Auth Providers
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

export interface AppUserProfile {
  id: string;
  name: string;
  username: string;
  email?: string | null;
  avatar: string;
  coverImage?: string;
  bio?: string;
  isOnline: boolean;
  lastSeen?: string;
  isAnonymous: boolean;
  friendsCount: number;
  createdAt?: any;
}

// Generate guest avatar based on seed
export function generateGuestAvatar(seed: string): string {
  return `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(seed)}&backgroundColor=1877f2,0084ff,18acfe`;
}

// Ensure user document exists in Firestore
export async function syncUserDocument(user: FirebaseUser, customName?: string): Promise<AppUserProfile> {
  const userRef = doc(db, 'users', user.uid);
  const userSnap = await getDoc(userRef);

  const fallbackName = customName || user.displayName || `Visitante #${user.uid.slice(-4).toUpperCase()}`;
  const fallbackAvatar = user.photoURL || generateGuestAvatar(user.uid);
  const username = fallbackName.toLowerCase().replace(/\s+/g, '.').replace(/[^a-z0-9.]/g, '') || `user.${user.uid.slice(0, 5)}`;

  if (userSnap.exists()) {
    const existing = userSnap.data() as AppUserProfile;
    // update presence to online
    await updateDoc(userRef, {
      isOnline: true,
      lastSeen: 'Online agora',
    });
    return {
      ...existing,
      id: user.uid,
      isOnline: true,
    };
  }

  const newProfile: AppUserProfile = {
    id: user.uid,
    name: fallbackName,
    username: username,
    email: user.email || null,
    avatar: fallbackAvatar,
    coverImage: 'https://images.unsplash.com/photo-1707343843437-caacff5cfa74?w=1200&auto=format&fit=crop&q=80',
    bio: user.isAnonymous 
      ? 'Entrei como anônimo no ConectaFlow! Pronto para conversar e fazer vídeo chamadas.' 
      : 'Conectado ao ConectaFlow! 🚀✨',
    isOnline: true,
    lastSeen: 'Online agora',
    isAnonymous: user.isAnonymous,
    friendsCount: 0,
    createdAt: serverTimestamp(),
  };

  await setDoc(userRef, newProfile);
  return newProfile;
}

// Sign In With Google
export async function loginWithGoogle(): Promise<AppUserProfile> {
  const result = await signInWithPopup(auth, googleProvider);
  return await syncUserDocument(result.user);
}

// Sign In Anonymously
export async function loginAnonymously(guestName?: string): Promise<AppUserProfile> {
  const result = await signInAnonymously(auth);
  if (guestName && guestName.trim()) {
    try {
      await fbUpdateProfile(result.user, {
        displayName: guestName.trim(),
      });
    } catch (e) {
      console.warn('Could not update anonymous display name on auth profile:', e);
    }
  }
  return await syncUserDocument(result.user, guestName);
}

// Sign Out
export async function logoutUser(userId?: string): Promise<void> {
  if (userId) {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        isOnline: false,
        lastSeen: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      });
    } catch (e) {
      console.warn('Could not update offline status:', e);
    }
  }
  await fbSignOut(auth);
}

// Update User Profile
export async function updateUserProfile(
  userId: string, 
  data: { name?: string; avatar?: string; bio?: string }
): Promise<void> {
  const userRef = doc(db, 'users', userId);
  await updateDoc(userRef, {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export { onAuthStateChanged };
