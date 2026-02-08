import { addDoc, collection, query, where, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore"
import { db } from "./firebase"


export const sendRequestToFreelancer = async (clientId: string, freelancerId: string, gigId: string, projectTitle: string, projectDescription: string, budget: number, deadline: string, attachmentURL: string) => {
    await addDoc(collection(db, "project_requests"), 
      {
        clientId,
        freelancerId,
        gigId,
        projectTitle,
        projectDescription,
        budget,
        deadline,
        attachmentURL,
        status: "pending",
        createdAt: new Date()
      }  
    )
}