import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { 
  User, 
  onAuthStateChanged, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInAnonymously,
  updateProfile,
  sendEmailVerification
} from 'firebase/auth';
import { auth, db } from '../lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: () => Promise<void>;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  signUpWithEmail: (email: string, pass: string, name: string, photoURL?: string) => Promise<void>;
  signInDemoUser: (name: string, photoURL: string) => Promise<void>;
  logOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      try {
        if (currentUser) {
          // Ensure user doc exists
          const userRef = doc(db, 'users', currentUser.uid);
          const userSnap = await getDoc(userRef);
          if (!userSnap.exists()) {
            try {
              await setDoc(userRef, {
                email: currentUser.email || 'anonimo@radioamble.it',
                displayName: currentUser.displayName || 'Ascoltatore Amblè',
                photoURL: currentUser.photoURL || '',
                createdAt: new Date(),
                likes: []
              });
            } catch(e) { /* ignore permission error if any */ }
          }
        }
      } catch (err) {
        console.error("[Auth Init] Quietly caught Firestore read error on auth change:", err);
      } finally {
        setUser(currentUser);
        setLoading(false);
      }
    });
    return unsubscribe;
  }, []);

  const signIn = async () => {
    if (isAuthenticating) return;
    setIsAuthenticating(true);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error: any) {
      if (error.code !== 'auth/cancelled-popup-request' && error.code !== 'auth/popup-closed-by-user' && error.code !== 'auth/internal-error') {
        console.error("Auth error:", error);
      }
    } finally {
      setIsAuthenticating(false);
    }
  };

  const signInWithEmail = async (email: string, pass: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, pass);
    } catch (error) {
      console.error("Email login error:", error);
      throw error;
    }
  };

  const signUpWithEmail = async (email: string, pass: string, name: string, photoURL?: string) => {
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, pass);
      await updateProfile(cred.user, {
        displayName: name,
        photoURL: photoURL || ""
      });
      setUser({ ...auth.currentUser } as User);
      
      const userRef = doc(db, 'users', cred.user.uid);
      await setDoc(userRef, {
        email: email,
        displayName: name,
        photoURL: photoURL || "",
        createdAt: new Date(),
        likes: []
      });

      // Send registration confirmation/verification email
      try {
        await sendEmailVerification(cred.user);
      } catch (emailErr) {
        console.warn("Could not send verification email:", emailErr);
      }
    } catch (error) {
      console.error("Email signup error:", error);
      throw error;
    }
  };

  const signInDemoUser = async (name: string, photoURL: string) => {
    if (isAuthenticating) return;
    setIsAuthenticating(true);
    try {
      const cred = await signInAnonymously(auth);
      await updateProfile(cred.user, {
        displayName: name,
        photoURL: photoURL
      });
      setUser({ ...auth.currentUser } as User);
      
      const userRef = doc(db, 'users', cred.user.uid);
      await setDoc(userRef, {
        email: 'anonimo@radioamble.it',
        displayName: name,
        photoURL: photoURL,
        createdAt: new Date(),
        likes: []
      }, { merge: true });
    } catch (error) {
      console.error("Demo registration error:", error);
      throw error;
    } finally {
      setIsAuthenticating(false);
    }
  };

  const logOut = async () => {
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signInWithEmail, signUpWithEmail, signInDemoUser, logOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
