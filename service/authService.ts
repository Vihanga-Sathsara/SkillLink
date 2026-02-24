import { createUserWithEmailAndPassword, updateProfile, GoogleAuthProvider, signInWithCredential, signInWithEmailAndPassword, signOut } from "firebase/auth"
import { auth, db } from "./firebase"
import { doc, getDoc, setDoc, updateDoc, deleteDoc } from "firebase/firestore"
import { sendPasswordResetEmail } from "firebase/auth"


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
    try {
        await signOut(auth)
    } catch (error) {
        console.error("Error signing out: ", error)
        throw error
    }
}

export const getDetailsById = async (uid: string) => {
    const userDoc = await getDoc(doc(db, "users", uid))
    if (userDoc.exists()) {
        return userDoc.data()
    }
    return null
}

export const getUserRole = async (uid: string) => {
    const userDoc = await getDoc(doc(db, "users", uid))
    if (userDoc.exists()) {
        const data = userDoc.data()
        return data.role
    }
    return null
}

export const getDetails = async (uid: string) => {
    const userDoc = await getDoc(doc(db, "users", uid))
    if (userDoc.exists()) {
       const data = userDoc.data()
       return data
    }
    return null
} 

export const getFeedback = async (uid: string) => {
    const userDoc = await getDoc(doc(db, "users", uid))
    if (userDoc.exists()) {
        const data = userDoc.data()
        return data.feedback
    }
    return null
}

export const updateFeedback = async (uid: string, newFeedback: number) => {
    const userDocRef = doc(db, "users", uid)
    const userDoc = await getDoc(userDocRef)
    if (userDoc.exists()) {
        const currentFeedback = userDoc.data().feedback || 0
        const updatedFeedback = currentFeedback + newFeedback
        await updateDoc(userDocRef, { feedback: updatedFeedback })
        return updatedFeedback
    }
    return null
}

export const deleteUserAccount = async (uid: string) => {
    try {
        await deleteDoc(doc(db, "users", uid))
        await auth.currentUser?.delete()
        return true
    } catch (error) {
        console.error("Error deleting account: ", error)
        return false
    }
    
}

export const forgotPassword = async (email: string) => {
    if (!email) throw new Error("Email is required")
    try {
        await sendPasswordResetEmail(auth, email)
        return true
    } catch (error: any) {
        console.error("Error sending password reset email:", error)
        throw error
    }
}

export const googleLogin = async (idToken: string) => {
  try {
        const credentials = GoogleAuthProvider.credential(idToken);
        const userCred = await signInWithCredential(auth, credentials);
        const user = userCred.user;

        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    throw new Error("User not registered. Please register first.");
  }
  return { user , role: userSnap.data().role }
  } catch (error) {
    console.error("Error signing in with Google:", error)
    throw error
  }
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

