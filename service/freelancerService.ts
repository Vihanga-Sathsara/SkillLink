import { addDoc, collection } from "firebase/firestore"
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
        createdAt: new Date()
    })
}