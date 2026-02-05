import { createUserWithEmailAndPassword, updateProfile, GoogleAuthProvider, signInWithCredential, signInWithEmailAndPassword, signOut } from "firebase/auth"
import { auth, db } from "./firebase"
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore"

export const registerUser = async (fullName: string, email: string, password: string, role: string) => {
    const userCredentials = await createUserWithEmailAndPassword(auth, email, password)
    await updateProfile(userCredentials.user, { displayName: fullName })
    await setDoc(doc(db, "users", userCredentials.user.uid), {
        fullName,
        email,
        role,
        profileImage: "",
        bannerImage: "",
        feedback: 0,
        bio: "",
        country: "",
        address: "",
        createdAt: new Date()
    })
    return userCredentials.user
}

export const googleRegister = async (idToken: string, role: string) => {

  const credentials = GoogleAuthProvider.credential(idToken)
  
  const userCredentials = await signInWithCredential(auth, credentials)
  const user = userCredentials.user

  await setDoc(doc(db, "users", user.uid), {
    fullName: user.displayName,
    email: user.email,
    role,
    profileImage: "",
    bannerImage: "",
    feedback: 0,
    bio: "",
    country: "",
    address: "",
    createdAt: new Date()
  })
  return user
}

export const loginUser = async (email: string, password: string) => {
  const res = await signInWithEmailAndPassword(auth, email, password)
  if (res.user) {
    const userDetailsRef = doc(db, "users", res.user.uid)
    const userDetails = await getDoc(userDetailsRef)
    if (userDetails.exists()) {
      return userDetails.data().role
    }
  }
  return null
}

export const getUserDetails = async (uid: string) => {
    const userDoc = await getDoc(doc(db, "users", uid))
    if (userDoc.exists()) {
        return userDoc.data()
    }
    return null
}

export const updateDetails = async (user: any, updates: any) => {
  if (!user) throw new Error("User not logged in")
    if (updates.fullName) {
        await updateProfile(user, { displayName: updates.fullName })
    }
    await updateDoc(doc(db, "users", user.uid), updates)
}

export const logoutUser = async () => {
    await signOut(auth)
}