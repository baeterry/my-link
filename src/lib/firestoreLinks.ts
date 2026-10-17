import {
  collection,
  doc,
  addDoc,
  getDocs,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  deleteDoc,
} from "firebase/firestore";
import { db } from "./firebase";
import { LinkItem } from "@/types/profile";

export const FIRESTORE_LINKS_COLLECTION_PATH = "users/anonymous/links";

/**
 * Firestore의 'users/anonymous/links' 서브컬렉션 참조 반환
 */
export const getAnonymousLinksCollection = () => {
  return collection(db, "users", "anonymous", "links");
};

/**
 * Firestore 문서 데이터를 LinkItem 인터페이스로 변환
 */
export function mapDocToLink(docSnap: any): LinkItem & { createdAtMs?: number } {
  const data = docSnap.data();
  let createdAtMs: number | undefined;

  if (data.createdAt) {
    if (typeof data.createdAt.toMillis === "function") {
      createdAtMs = data.createdAt.toMillis();
    } else if (data.createdAt instanceof Date) {
      createdAtMs = data.createdAt.getTime();
    } else if (typeof data.createdAt === "number") {
      createdAtMs = data.createdAt;
    }
  }

  return {
    id: docSnap.id,
    title: data.title || "",
    subtitle: data.subtitle || undefined,
    url: data.url || "",
    iconType: data.iconType || "link",
    badge: data.badge || undefined,
    badgeColor: data.badgeColor || undefined,
    createdAtMs,
  };
}

/**
 * 새 링크를 Firestore 'users/anonymous/links' 경로에 추가합니다.
 * createdAt, updatedAt은 serverTimestamp()로 최신순 정렬 기준이 됩니다.
 */
export async function addLinkToFirestore(
  link: Omit<LinkItem, "id"> & { id?: string }
): Promise<LinkItem> {
  const colRef = getAnonymousLinksCollection();

  // Firestore는 undefined 값을 허용하지 않으므로 정의된 값만 전달
  const docData: Record<string, any> = {
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
  };
}

/**
 * Firestore 'users/anonymous/links' 경로에서 링크 목록을 불러옵니다.
 * createdAt 기준 최신순(desc) 정렬
 */
export async function getLinksFromFirestore(): Promise<LinkItem[]> {
  const colRef = getAnonymousLinksCollection();

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
 * Firestore 'users/anonymous/links' 경로의 링크 목록을 실시간 구독(onSnapshot)합니다.
 * createdAt 기준 최신순(desc) 정렬하며, 새 링크 추가/수정/삭제 시 실시간 콜백이 트리거됩니다.
 */
export function subscribeLinksFromFirestore(
  onUpdate: (links: LinkItem[]) => void,
  onError?: (error: Error) => void
): () => void {
  const colRef = getAnonymousLinksCollection();
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
        // 만약 인덱스 미생성 등으로 orderBy 실패 시 기본 쿼리로 폴백 구독 시도
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
        } catch (e: any) {
          if (onError && isSubscribed) onError(e);
        }
      }
    );
  } catch (err: any) {
    console.error("Firestore 구독 실패:", err);
    if (onError) onError(err);
  }

  return () => {
    isSubscribed = false;
    if (activeUnsubscribe) {
      activeUnsubscribe();
    }
  };
}

/**
 * Firestore 'users/anonymous/links' 경로에서 특정 링크를 삭제합니다.
 */
export async function deleteLinkFromFirestore(id: string): Promise<void> {
  const docRef = doc(db, "users", "anonymous", "links", id);
  await deleteDoc(docRef);
}

