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
        projectUrl: "",
        paymentUri: "",
        paymentStatus: false,
        createdAt: new Date()
      }  
    )
}

export const getRequestsForClient = async (clientId: string) => {
    const q = query(collection(db, "project_requests"), where("clientId", "==", clientId))
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
}

export const getRequestsForFreelancer = async (freelancerId: string) => {
    const q = query(collection(db, "project_requests"), where("freelancerId", "==", freelancerId))
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
}

export const getRequestsByStatus = async (clientId: string, status: string) => {
    const q = query(collection(db, "project_requests"), where("clientId", "==", clientId), where("status", "==", status))
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
}

export const getProjectsByStatus = async (freelancerId: string, status: string) => {
    const q = query(collection(db, "project_requests"), where("freelancerId", "==", freelancerId), where("status", "==", status))
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
}

export const updateRequestStatus = async (requestId: string, newStatus: string) => {
    const requestRef = doc(db, "project_requests", requestId)
    await updateDoc(requestRef, { status: newStatus })
    return true
}

export const submitProjectURL = async (requestId: string, projectUrl: string) => {
    const requestRef = doc(db, "project_requests", requestId)
    await updateDoc(requestRef, { projectUrl })
    return true
}

export const submitPaymentSlip = async (requestId: string, paymentUrl: string) => {
    const requestRef = doc(db, "project_requests", requestId)
    await updateDoc(requestRef, { paymentUrl })
    return true
}

export const updatePaymentStatus = async (requestId: string, paymentStatus: boolean) => {
    const requestRef = doc(db, "project_requests", requestId)
    await updateDoc(requestRef, { paymentStatus })
    return true
}

export const completeProjectCount = async (uid: string) => {
    const q = query(collection(db, "project_requests"), where("freelancerId", "==", uid), where("status", "==", "completed"))
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.length
}

export const pendingProjectCount = async (uid: string) => {
    const q = query(collection(db, "project_requests"), where("freelancerId", "==", uid), where("status", "==", "pending"))
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.length
}

export const rejectedProjectCount = async (uid: string) => {
    const q = query(collection(db, "project_requests"), where("freelancerId", "==", uid), where("status", "==", "rejected"))
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.length
}

export const completeProjectCountUsingGigId = async (uid: string, gigId: string) => {
    const q = query(collection(db, "project_requests"), where("freelancerId", "==", uid), where("gigId", "==", gigId), where("status", "==", "completed"))
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.length
}

export const getTotalEarnings = async (uid: string) => {
    const q = query(collection(db, "project_requests"), where("freelancerId", "==", uid), where("status", "==", "completed"))
    const querySnapshot = await getDocs(q)
    let totalEarnings = 0
    querySnapshot.docs.forEach(doc => {
        const data = doc.data()
        totalEarnings += data.budget || 0
    }
    )
    return totalEarnings
}