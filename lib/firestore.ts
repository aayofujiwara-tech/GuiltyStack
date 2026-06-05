import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  query,
  orderBy,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore'
import { db } from './firebase'
import { Content, ContentStatus } from './types'

function contentsRef(userId: string) {
  return collection(db, 'users', userId, 'contents')
}

function contentDoc(userId: string, contentId: string) {
  return doc(db, 'users', userId, 'contents', contentId)
}

function toContent(id: string, data: Record<string, unknown>): Content {
  const toDate = (v: unknown): string => {
    if (!v) return ''
    if (v instanceof Timestamp) return v.toDate().toISOString().split('T')[0]
    return String(v)
  }
  return {
    id,
    user_id:          String(data.user_id ?? ''),
    title:            String(data.title ?? ''),
    type:             data.type as Content['type'],
    price:            Number(data.price ?? 0),
    purchased_at:     toDate(data.purchased_at),
    release_date:     toDate(data.release_date),
    freshness_source: (data.freshness_source as Content['freshness_source']) ?? 'manual',
    platform:         data.platform ? String(data.platform) : null,
    cover_image_url:  data.cover_image_url ? String(data.cover_image_url) : null,
    status:           (data.status as ContentStatus) ?? 'unplayed',
    tags:             Array.isArray(data.tags) ? data.tags as string[] : null,
    created_at:       toDate(data.created_at),
    updated_at:       toDate(data.updated_at),
  }
}

export async function fetchContents(userId: string): Promise<Content[]> {
  const q = query(contentsRef(userId), orderBy('created_at', 'desc'))
  const snap = await getDocs(q)
  return snap.docs.map((d) => toContent(d.id, d.data() as Record<string, unknown>))
}

export async function addContent(
  userId: string,
  payload: Omit<Content, 'id' | 'user_id' | 'created_at' | 'updated_at'>
) {
  await addDoc(contentsRef(userId), {
    ...payload,
    user_id:    userId,
    created_at: serverTimestamp(),
    updated_at: serverTimestamp(),
  })
}

export async function updateContentStatus(
  userId: string,
  contentId: string,
  status: ContentStatus
) {
  await updateDoc(contentDoc(userId, contentId), {
    status,
    updated_at: serverTimestamp(),
  })
}

export async function deleteContent(userId: string, contentId: string) {
  await deleteDoc(contentDoc(userId, contentId))
}
