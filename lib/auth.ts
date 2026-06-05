import { auth, googleProvider } from './firebase'
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type User,
} from 'firebase/auth'

export const signInWithGoogle = () => signInWithPopup(auth, googleProvider)
export const signInWithEmail  = (email: string, password: string) =>
  signInWithEmailAndPassword(auth, email, password)
export const signUpWithEmail  = (email: string, password: string) =>
  createUserWithEmailAndPassword(auth, email, password)
export const logout       = () => signOut(auth)
export const onAuthChange = (callback: (user: User | null) => void) =>
  onAuthStateChanged(auth, callback)
