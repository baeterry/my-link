import {
  collection,
  doc,
  addDoc,
  getDocs,
  getDoc,
  setDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  deleteDoc,
  updateDoc,
  DocumentSnapshot,
  QueryDocumentSnapshot,
} from "firebase/firestore";
import { db } from "./firebase";
import { LinkItem, ProfileData, DEFAULT_PROFILE } from "@/types/profile";

/**
 * Firestore의 'user/{uid}/links' 서브컬렉션 참조 반환
 */
export const getUserLinksCollection = (uid: string) => {
  return collection(db, "user", uid, "links");
};

/**
 * Firestore의 'user/{uid}' 유저 문서 참조 반환
 */
export const getUserDocRef = (uid: string) => {
  return doc(db, "user", uid);
};

/**
 * Firestore 문서 데이터를 LinkItem 인터페이스로 변환
 */
export function mapDocToLink(docSnap: QueryDocumentSnapshot | DocumentSnapshot): LinkItem {
  const data = docSnap.data() || {};
  let createdAtMs: number | undefined;
  let updatedAtMs: number | undefined;

  if (data.createdAt) {
    if (typeof data.createdAt.toMillis === "function") {
      createdAtMs = data.createdAt.toMillis();
    } else if (data.createdAt instanceof Date) {
      createdAtMs = data.createdAt.getTime();
    } else if (typeof data.createdAt === "number") {
      createdAtMs = data.createdAt;
    }
  }

  if (data.updatedAt) {
    if (typeof data.updatedAt.toMillis === "function") {
      updatedAtMs = data.updatedAt.toMillis();
    } else if (data.updatedAt instanceof Date) {
      updatedAtMs = data.updatedAt.getTime();
    } else if (typeof data.updatedAt === "number") {
      updatedAtMs = data.updatedAt;
    }
  }

  return {
    id: docSnap.id,
    title: (data.title as string) || "",
    subtitle: (data.subtitle as string) || undefined,
    url: (data.url as string) || "",
    iconType: (data.iconType as LinkItem["iconType"]) || "link",
    badge: (data.badge as string) || undefined,
    badgeColor: (data.badgeColor as string) || undefined,
    createdAtMs,
    updatedAtMs,
  };
}

/**
 * user/{uid} 경로에서 유저 프로필 정보를 조회합니다.
 */
export async function getUserProfileFromFirestore(uid: string): Promise<ProfileData | null> {
  const userRef = getUserDocRef(uid);
  const snap = await getDoc(userRef);
  if (!snap.exists()) return null;

  const data = snap.data();
  return {
    username: (data.username as string) || (data.email as string)?.split("@")[0] || "user",
    displayName:
      (data.displayName as string) ||
      (data.email as string)?.split("@")[0] ||
      DEFAULT_PROFILE.displayName,
    badgeText: (data.badgeText as string) || DEFAULT_PROFILE.badgeText,
    avatarUrl: (data.avatarUrl as string) || DEFAULT_PROFILE.avatarUrl,
    bio: (data.bio as string) || DEFAULT_PROFILE.bio,
    socialLinks: (data.socialLinks as ProfileData["socialLinks"]) || DEFAULT_PROFILE.socialLinks,
    links: [],
    contactEmail: (data.contactEmail as string) || undefined,
  };
}

/**
 * user/{uid} 경로의 유저 프로필 정보를 업데이트합니다.
 */
export async function updateUserProfileInFirestore(
  uid: string,
  profile: Partial<ProfileData>
): Promise<void> {
  const userRef = getUserDocRef(uid);
  const updatePayload: Record<string, unknown> = {
    ...profile,
    updatedAt: serverTimestamp(),
  };
  await setDoc(userRef, updatePayload, { merge: true });
}

/**
 * 새 링크를 Firestore 'user/{uid}/links' 경로에 추가합니다.
 * createdAt, updatedAt은 serverTimestamp()로 최신순 정렬 기준이 됩니다.
 */
export async function addLinkToFirestore(
  uid: string,
  link: Omit<LinkItem, "id"> & { id?: string }
): Promise<LinkItem> {
  const colRef = getUserLinksCollection(uid);

  // Firestore는 undefined 값을 허용하지 않으므로 정의된 값만 전달
  const docData: Record<string, unknown> = {
    title: link.title.trim(),
    url: link.url.trim(),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  if (link.subtitle && link.subtitle.trim()) {
    docData.subtitle = link.subtitle.trim();
  }
  if (link.iconType) {
    docData.iconType = link.iconType;
  }
  if (link.badge && link.badge.trim()) {
    docData.badge = link.badge.trim();
  }
  if (link.badgeColor && link.badgeColor.trim()) {
    docData.badgeColor = link.badgeColor.trim();
  }

  const docRef = await addDoc(colRef, docData);

  return {
    id: docRef.id,
    title: link.title.trim(),
    subtitle: link.subtitle?.trim() || undefined,
    url: link.url.trim(),
    iconType: link.iconType || "link",
    badge: link.badge?.trim() || undefined,
    badgeColor: link.badgeColor?.trim() || undefined,
    createdAtMs: Date.now(),
    updatedAtMs: Date.now(),
  };
}

/**
 * Firestore 'user/{uid}/links' 경로에서 링크 목록을 불러옵니다.
 * createdAt 기준 최신순(desc) 정렬
 */
export async function getLinksFromFirestore(uid: string): Promise<LinkItem[]> {
  const colRef = getUserLinksCollection(uid);

  try {
    const q = query(colRef, orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);

    return snapshot.docs.map(mapDocToLink);
  } catch (err) {
    console.warn("orderBy('createdAt', 'desc') query failed, falling back to basic getDocs:", err);
    const snapshot = await getDocs(colRef);
    const list = snapshot.docs.map(mapDocToLink);
    // createdAt 없는 문서 대비 클라이언트 측 정렬
    return list.sort((a, b) => (b.createdAtMs || 0) - (a.createdAtMs || 0));
  }
}

/**
 * Firestore 'user/{uid}/links' 경로의 링크 목록을 실시간 구독(onSnapshot)합니다.
 * createdAt 기준 최신순(desc) 정렬하며, 새 링크 추가/수정/삭제 시 실시간 콜백이 트리거됩니다.
 */
export function subscribeLinksFromFirestore(
  uid: string,
  onUpdate: (links: LinkItem[]) => void,
  onError?: (error: Error) => void
): () => void {
  const colRef = getUserLinksCollection(uid);
  const q = query(colRef, orderBy("createdAt", "desc"));

  let isSubscribed = true;
  let activeUnsubscribe: (() => void) | null = null;

  try {
    activeUnsubscribe = onSnapshot(
      q,
      (snapshot) => {
        if (!isSubscribed) return;
        const links = snapshot.docs.map(mapDocToLink);
        onUpdate(links);
      },
      (err) => {
        if (!isSubscribed) return;
        console.warn("Firestore onSnapshot orderBy error, falling back to unsorted with client sort:", err);
        try {
          if (activeUnsubscribe) {
            activeUnsubscribe();
          }
          activeUnsubscribe = onSnapshot(
            colRef,
            (fallbackSnapshot) => {
              if (!isSubscribed) return;
              const links = fallbackSnapshot.docs.map(mapDocToLink);
              links.sort((a, b) => (b.createdAtMs || 0) - (a.createdAtMs || 0));
              onUpdate(links);
            },
            (fallbackErr) => {
              if (onError && isSubscribed) onError(fallbackErr);
            }
          );
        } catch (e: unknown) {
          if (onError && isSubscribed) onError(e as Error);
        }
      }
    );
  } catch (err: unknown) {
    console.error("Firestore 구독 실패:", err);
    if (onError) onError(err as Error);
  }

  return () => {
    isSubscribed = false;
    if (activeUnsubscribe) {
      activeUnsubscribe();
    }
  };
}

/**
 * Firestore 'user/{uid}/links' 경로에서 특정 링크를 삭제합니다.
 */
export async function deleteLinkFromFirestore(uid: string, id: string): Promise<void> {
  const docRef = doc(db, "user", uid, "links", id);
  await deleteDoc(docRef);
}

/**
 * Firestore 'user/{uid}/links' 경로에서 특정 링크를 수정합니다.
 */
export async function updateLinkInFirestore(
  uid: string,
  id: string,
  updatedData: Partial<Omit<LinkItem, "id">>
): Promise<void> {
  const docRef = doc(db, "user", uid, "links", id);
  const data: Record<string, unknown> = {
    updatedAt: serverTimestamp(),
  };

  if (updatedData.title !== undefined) {
    data.title = updatedData.title.trim();
  }
  if (updatedData.url !== undefined) {
    data.url = updatedData.url.trim();
  }
  if (updatedData.subtitle !== undefined) {
    data.subtitle = updatedData.subtitle.trim();
  }
  if (updatedData.iconType !== undefined) {
    data.iconType = updatedData.iconType;
  }
  if (updatedData.badge !== undefined) {
    data.badge = updatedData.badge.trim();
  }
  if (updatedData.badgeColor !== undefined) {
    data.badgeColor = updatedData.badgeColor.trim();
  }

  await updateDoc(docRef, data);
}
