"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { signIn as signInAuth, signOut as signOutAuth, useSession } from "next-auth/react";

interface User {
  id: string;
  name?: string | null;
  email?: string | null;
}

interface AuthContextType {
  user: User | null;
  status: "loading" | "authenticated" | "unauthenticated";
  signIn: (credentials: { email: string; password: string }) => Promise<boolean>;
  signUp: (credentials: { name: string; email: string; password: string }) => Promise<boolean>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { data: session, status: sessionStatus } = useSession();
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState<"loading" | "authenticated" | "unauthenticated">("loading");

  useEffect(() => {
    if (sessionStatus === "loading") {
      setStatus("loading");
    } else if (session?.user) {
      setUser({
        id: session.user.id as string,
        name: session.user.name,
        email: session.user.email,
      });
      setStatus("authenticated");
    } else {
      setUser(null);
      setStatus("unauthenticated");
    }
  }, [session, sessionStatus]);

  const signIn = async (credentials: { email: string; password: string }): Promise<boolean> => {
    try {
      const result = await signInAuth("credentials", {
        ...credentials,
        redirect: false,
      });

      if (result?.error) {
        console.error("Sign in error:", result.error);
        return false;
      }

      return true;
    } catch (error) {
      console.error("Sign in error:", error);
      return false;
    }
  };

  const signUp = async (credentials: { name: string; email: string; password: string }): Promise<boolean> => {
    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const data = await response.json();
        console.error("Registration error:", data.error);
        return false;
      }

      // After successful registration, sign in
      return await signIn({ email: credentials.email, password: credentials.password });
    } catch (error) {
      console.error("Registration error:", error);
      return false;
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      await signOutAuth({ redirect: false });
      router.push("/login");
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  const value = {
    user,
    status,
    signIn,
    signUp,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
} 