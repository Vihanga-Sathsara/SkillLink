import { auth } from "@/service/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { createContext, useEffect, useState } from "react";

interface AuthContextTypes {
    user: User | null;
    loading: boolean;
}

export const AuthContext = createContext<AuthContextTypes>({
    user: null,
    loading: true, 
})

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [initializing, setInitializing] = useState(true); 

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (usr) => {
            setUser(usr);
            setInitializing(false); 
        });
        return () => unsubscribe();
    }, []);

    return (
        <AuthContext.Provider value={{ user, loading: initializing }}>
            {children}
        </AuthContext.Provider>
    );
}