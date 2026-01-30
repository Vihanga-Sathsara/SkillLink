import { createUserWithEmailAndPassword, updateProfile, GoogleAuthProvider, signInWithCredential, signInWithPopup, signInWithEmailAndPassword } from "firebase/auth"
import { auth, db } from "./firebase"
import { doc, getDoc, setDoc } from "firebase/firestore"

export const registerUser = async (fullName: string, email: string, password: string, role: string) => {
    const userCredentials = await createUserWithEmailAndPassword(auth, email, password)
    await updateProfile(userCredentials.user, { displayName: fullName })
    await setDoc(doc(db, "users", userCredentials.user.uid), {
        fullName,
        email,
        role,
        createdAt: new Date()
    })
    return userCredentials.user
}

export const googleRegister = async (idToken: string, role: string) => {

  const credentials = GoogleAuthProvider.credential(idToken)
  // Firebase popup for web
  const userCredentials = await signInWithCredential(auth, credentials)
  const user = userCredentials.user

  await setDoc(doc(db, "users", user.uid), {
    fullName: user.displayName,
    email: user.email,
    role,
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