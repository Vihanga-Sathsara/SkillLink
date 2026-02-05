import { addDoc, collection, getDocs, query, where,doc, updateDoc } from "firebase/firestore"
import { db } from "./firebase"

export const saveVerificationData = async (uid: string, documentURL: string) => {
    await addDoc(collection(db, "verifications"), {
        uid,
        documentURL,
        verified: "not verified",
        createdAt: new Date()
    })
}

export const getVerificationDataByUserId = async (uid: string) => {
    const q = query(collection(db, "verifications"), where("uid", "==", uid))
    const verificationSnapshot = await getDocs(q)
    const verifications = verificationSnapshot.docs.map((doc: { id: any; data: () => any }) => ({ id: doc.id, ...doc.data() }))
    return verifications
}

export const updateVerificationStatus = async (verificationId: string, status: string) => {
   await updateDoc(doc(db, "verifications", verificationId), { verified: status })
}