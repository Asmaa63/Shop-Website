import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  createdAt: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,

      login: async (email: string, password: string) => {
        try {
          // Call your API
          const response = await fetch("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
          });

          if (!response.ok) {
            throw new Error("Invalid credentials");
          }

          const data = await response.json();
          
          set({
            user: data.user,
            isAuthenticated: true,
          });
        } catch (error) {
          console.error("Login error:", error);
          throw error;
        }
      },

      loginWithGoogle: async () => {
        try {
          // Implement Google OAuth
          // This will be handled by NextAuth
          const response = await fetch("/api/auth/google");
          const data = await response.json();
          
          set({
            user: data.user,
            isAuthenticated: true,
          });
        } catch (error) {
          console.error("Google login error:", error);
          throw error;
        }
      },

      register: async (data: RegisterData) => {
        try {
          const response = await fetch("/api/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
          });

          if (!response.ok) {
            throw new Error("Registration failed");
          }

          const result = await response.json();
          
          set({
            user: result.user,
            isAuthenticated: true,
          });
        } catch (error) {
          console.error("Registration error:", error);
          throw error;
        }
      },

      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
        });
        // Clear session
        fetch("/api/auth/logout", { method: "POST" });
      },

      updateProfile: async (data: Partial<User>) => {
        try {
          const currentUser = get().user;
          if (!currentUser) throw new Error("No user logged in");

          const response = await fetch("/api/auth/profile", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
          });

          if (!response.ok) {
            throw new Error("Update failed");
          }

          const updatedUser = await response.json();
          
          set({
            user: { ...currentUser, ...updatedUser },
          });
        } catch (error) {
          console.error("Profile update error:", error);
          throw error;
        }
      },
    }),
    {
      name: "auth-storage",
    }
  )
);