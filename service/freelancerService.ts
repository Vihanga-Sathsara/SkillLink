import { addDoc, collection, query, where, getDocs } from "firebase/firestore"
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