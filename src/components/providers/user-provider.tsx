"use client";

import { createContext, useContext } from "react";

export const UserContext = createContext<any>(null);

export function UserProvider({ children, user }: { children: React.ReactNode, user: any }) {
    return (
        <UserContext.Provider value={user}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    return useContext(UserContext);
}
