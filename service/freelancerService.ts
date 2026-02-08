import { addDoc, collection, query, where, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore"
import { db } from "./firebase"


export const createFreelancerGig = async (gigTitle: string, gigDescription: string, price: number, category: string, deliveryTime: number, bannerImageUrl: string, userId: string) => {
    
    await addDoc(collection(db, "gigs"), {
        gigTitle,
        gigDescription,
        price,
        category,
        deliveryTime,
        bannerImageUrl,
        userId,
        views: 0,
        createdAt: new Date()
    })
}

export const getFreelancerGigsByUserId = async (userId: string) => {
    const q = query(collection(db, "gigs"), where("userId", "==", userId))
    const gigsSnapshot = await getDocs(q)
    const gigs = gigsSnapshot.docs.map((doc: { id: any; data: () => any }) => ({ id: doc.id, ...doc.data() }))
    return gigs
}

export const updateDetailsOfGig = async (gigId: string, updatedData: any) => {
    const gigRef = doc(db, "gigs", gigId)
    await updateDoc(gigRef, updatedData)
}

export const deleteGig = async (gigId: string) => {
    await deleteDoc(doc(db, "gigs", gigId))
}

export const getAllGigs = async () => {
    const gigsSnapshot = await getDocs(collection(db, "gigs"))
    const gigs = gigsSnapshot.docs.map((doc: { id: any; data: () => any }) => ({ id: doc.id, ...doc.data() }))
    return gigs
}

export const getGigsByCategory = async (category: string) => {
    const q = query(collection(db, "gigs"), where("category", "==", category))
    const gigsSnapshot = await getDocs(q)
    const gigs = gigsSnapshot.docs.map((doc: { id: any; data: () => any }) => ({ id: doc.id, ...doc.data() }))
    return gigs
}