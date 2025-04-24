"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"

// Update the AuthContextType to include user information
type AuthContextType = {
  isAuthenticated: boolean
  isLoading: boolean
  user: { name: string } | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  setUserData: (data: { name: string }) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [user, setUser] = useState<{ name: string } | null>(null)

  // Check for existing auth on mount
  useEffect(() => {
    const checkAuth = async () => {
      // In a real app, validate the token with your backend
      const hasToken = document.cookie.includes("auth-token")
      setIsAuthenticated(hasToken)

      // Try to get user data from localStorage
      if (hasToken) {
        try {
          const userData = localStorage.getItem("user_data")
          if (userData) {
            setUser(JSON.parse(userData))
          }
        } catch (e) {
          console.error("Failed to parse user data", e)
        }
      }

      setIsLoading(false)
    }

    checkAuth()
  }, [])

  const setUserData = (data: { name: string }) => {
    setUser(data)
    localStorage.setItem("user_data", JSON.stringify(data))
  }

  const login = async (email: string, password: string) => {
    // Simulate API call
    setIsLoading(true)

    // In a real app, this would be an API call to your auth endpoint
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Set a cookie to simulate authentication
    document.cookie = "auth-token=authenticated; path=/; max-age=3600"
    setIsAuthenticated(true)
    setIsLoading(false)
    return true
  }

  // Update the logout function to properly clear auth state and redirect
  const logout = () => {
    // Clear the auth cookie
    document.cookie = "auth-token=; path=/; max-age=0"
    setIsAuthenticated(false)
    setUser(null)
    localStorage.removeItem("user_data")

    // Add a small delay before redirecting to ensure state is updated
    setTimeout(() => {
      router.push("/auth/signin")
    }, 100)
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, user, login, logout, setUserData }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
