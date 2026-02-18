import { addDoc, collection, getDocs } from "firebase/firestore"
import { db } from "./firebase"

export const createAdvertisement = async (advertisementUrl: string) => {
     await addDoc(collection(db, "advertisements"), {
        advertisementUrl,   
        createdAt: new Date()
    })
}

export const getAdvertisements = async () => {
    const advertisementsSnapshot = await getDocs(collection(db, "advertisements"))
    const advertisements = advertisementsSnapshot.docs.map((doc: { id: any; data: () => any }) => ({ id: doc.id, ...doc.data() }))
    return advertisements
}