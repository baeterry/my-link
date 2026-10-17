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
 * 새 링크를 Firestore 'users/anonymous/links' 경로에 추가합니다.
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
 */
export async function getLinksFromFirestore(): Promise<LinkItem[]> {
  const colRef = getAnonymousLinksCollection();

  try {
    const q = query(colRef, orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      return snapshot.docs.map((docSnap) => {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          title: data.title || "",
          subtitle: data.subtitle || undefined,
          url: data.url || "",
          iconType: data.iconType || "link",
          badge: data.badge || undefined,
          badgeColor: data.badgeColor || undefined,
        };
      });
    }
  } catch (err) {
    console.warn("orderBy query failed, falling back to basic getDocs:", err);
    const snapshot = await getDocs(colRef);
    return snapshot.docs.map((docSnap) => {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        title: data.title || "",
        subtitle: data.subtitle || undefined,
        url: data.url || "",
        iconType: data.iconType || "link",
        badge: data.badge || undefined,
        badgeColor: data.badgeColor || undefined,
      };
    });
  }

  return [];
}

/**
 * Firestore 'users/anonymous/links' 경로의 링크 목록을 실시간 구독(onSnapshot)합니다.
 */
export function subscribeLinksFromFirestore(
  onUpdate: (links: LinkItem[]) => void,
  onError?: (error: Error) => void
): () => void {
  const colRef = getAnonymousLinksCollection();
  const q = query(colRef, orderBy("createdAt", "desc"));

  return onSnapshot(
    q,
    (snapshot) => {
      const links: LinkItem[] = snapshot.docs.map((docSnap) => {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          title: data.title || "",
          subtitle: data.subtitle || undefined,
          url: data.url || "",
          iconType: data.iconType || "link",
          badge: data.badge || undefined,
          badgeColor: data.badgeColor || undefined,
        };
      });
      onUpdate(links);
    },
    (err) => {
      console.warn("Firestore onSnapshot error:", err);
      // 색인 미생성 등으로 orderBy 실패 시 기본 쿼리로 폴백 구독 시도
      try {
        return onSnapshot(
          colRef,
          (fallbackSnapshot) => {
            const links: LinkItem[] = fallbackSnapshot.docs.map((docSnap) => {
              const data = docSnap.data();
              return {
                id: docSnap.id,
                title: data.title || "",
                subtitle: data.subtitle || undefined,
                url: data.url || "",
                iconType: data.iconType || "link",
                badge: data.badge || undefined,
                badgeColor: data.badgeColor || undefined,
              };
            });
            onUpdate(links);
          },
          (fallbackErr) => {
            if (onError) onError(fallbackErr);
          }
        );
      } catch (e: any) {
        if (onError) onError(e);
      }
    }
  );
}

/**
 * Firestore 'users/anonymous/links' 경로에서 특정 링크를 삭제합니다.
 */
export async function deleteLinkFromFirestore(id: string): Promise<void> {
  const docRef = doc(db, "users", "anonymous", "links", id);
  await deleteDoc(docRef);
}
