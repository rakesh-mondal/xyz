import { redirect } from "next/navigation"
import { cookies } from "next/headers"

export default function Home() {
  // Check if user is authenticated by looking for an auth token
  // This is a simplified example - in a real app, you would validate the token
  const cookieStore = cookies()
  const authToken = cookieStore.get("auth-token")

  // If no auth token exists, redirect to sign-in page
  if (!authToken) {
    redirect("/auth/signin")
  }

  // If authenticated, redirect to dashboard
  redirect("/dashboard")
}
