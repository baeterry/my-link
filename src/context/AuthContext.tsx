"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  User,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signOut as firebaseSignOut,
  onAuthStateChanged,
} from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { ProfileData, DEFAULT_PROFILE } from "@/types/profile";

interface AuthContextType {
  user: User | null;
  userProfile: ProfileData | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  updateProfileData: (data: Partial<ProfileData>) => Promise<void>;
  refreshUserProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userProfile: null,
  loading: true,
  signInWithGoogle: async () => {},
  logout: async () => {},
  updateProfileData: async () => {},
  refreshUserProfile: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Firestore user/{uid} 경로에서 유저 정보 동기화
  const syncUserData = async (currentUser: User) => {
    try {
      const emailPrefix = currentUser.email ? currentUser.email.split("@")[0] : "user";
      const userDocRef = doc(db, "user", currentUser.uid);
      const userSnap = await getDoc(userDocRef);

      if (userSnap.exists()) {
        const data = userSnap.data();
        const profile: ProfileData = {
          username: (data.username as string) || emailPrefix,
          displayName: (data.displayName as string) || emailPrefix,
          badgeText: (data.badgeText as string) || "크리에이터",
          avatarUrl:
            (data.avatarUrl as string) ||
            currentUser.photoURL ||
            DEFAULT_PROFILE.avatarUrl,
          bio: (data.bio as string) || "반가워요! 나만의 마이링크 페이지입니다 ✨",
          socialLinks: (data.socialLinks as ProfileData["socialLinks"]) || DEFAULT_PROFILE.socialLinks,
          links: [],
          contactEmail: (data.contactEmail as string) || currentUser.email || "",
        };
        setUserProfile(profile);
      } else {
        // 최초 로그인 시 user/{uid} 문서 자동 생성: 디스플레이 네임은 이메일 앞부분 사용
        const initialProfile: ProfileData = {
          username: emailPrefix,
          displayName: emailPrefix,
          badgeText: "크리에이터",
          avatarUrl:
            currentUser.photoURL ||
            DEFAULT_PROFILE.avatarUrl,
          bio: "반가워요! 나만의 마이링크 페이지입니다 ✨",
          socialLinks: DEFAULT_PROFILE.socialLinks,
          links: [],
          contactEmail: currentUser.email || "",
        };

        await setDoc(userDocRef, {
          uid: currentUser.uid,
          email: currentUser.email,
          displayName: initialProfile.displayName,
          username: initialProfile.username,
          avatarUrl: initialProfile.avatarUrl,
          badgeText: initialProfile.badgeText,
          bio: initialProfile.bio,
          socialLinks: initialProfile.socialLinks,
          contactEmail: initialProfile.contactEmail,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });

        setUserProfile(initialProfile);
      }
    } catch (error) {
      console.error("Firestore user 문서 동기화 에러:", error);
      const emailPrefix = currentUser.email ? currentUser.email.split("@")[0] : "user";
      setUserProfile({
        ...DEFAULT_PROFILE,
        displayName: emailPrefix,
        avatarUrl: currentUser.photoURL || DEFAULT_PROFILE.avatarUrl,
        contactEmail: currentUser.email || DEFAULT_PROFILE.contactEmail,
        username: emailPrefix,
      });
    }
  };

  useEffect(() => {
    // 1. redirect 결과 확인 (모바일이나 팝업 차단 시 대비)
    getRedirectResult(auth)
      .then(async (result) => {
        if (result?.user) {
          setUser(result.user);
          await syncUserData(result.user);
        }
      })
      .catch((err) => {
        console.warn("getRedirectResult error:", err);
      });

    // 2. Auth 상태 리스너
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        await syncUserData(currentUser);
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });

    // 브라우저의 user activation(직접 클릭 제스처)을 보존하기 위해
    // 비동기 state 설정 없이 즉시 signInWithPopup을 호출합니다.
    try {
      const result = await signInWithPopup(auth, provider);
      if (result.user) {
        setUser(result.user);
        await syncUserData(result.user);
      }
    } catch (error: unknown) {
      const authError = error as { code?: string; message?: string };
      console.warn("signInWithPopup 실패 또는 차단:", authError?.code, authError?.message);

      // 팝업이 차단되거나 환경상 팝업이 로드되지 않을 경우 리다이렉트 방식으로 자동 폴백
      if (
        authError?.code === "auth/popup-blocked" ||
        authError?.code === "auth/popup-closed-by-user" ||
        authError?.code === "auth/cancelled-popup-request" ||
        authError?.code === "auth/internal-error"
      ) {
        try {
          console.log("리다이렉트 방식으로 재시도합니다...");
          await signInWithRedirect(auth, provider);
          return;
        } catch (redirectError) {
          console.error("리다이렉트 로그인 실패:", redirectError);
        }
      }
      throw error;
    }
  };

  const logout = async () => {
    try {
      await firebaseSignOut(auth);
      setUser(null);
      setUserProfile(null);
    } catch (error: unknown) {
      console.error("로그아웃 실패:", error);
      throw error;
    }
  };

  const updateProfileData = async (data: Partial<ProfileData>) => {
    if (!user) throw new Error("로그인이 필요합니다.");
    const userDocRef = doc(db, "user", user.uid);

    const updatePayload: Record<string, unknown> = {
      ...data,
      updatedAt: serverTimestamp(),
    };

    await setDoc(userDocRef, updatePayload, { merge: true });

    setUserProfile((prev) => (prev ? { ...prev, ...data } : null));
  };

  const refreshUserProfile = async () => {
    if (user) {
      await syncUserData(user);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userProfile,
        loading,
        signInWithGoogle,
        logout,
        updateProfileData,
        refreshUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
