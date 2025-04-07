"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Sun, Lock } from "lucide-react"
import Link from "next/link"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle login logic here
    console.log({ email, password, rememberMe })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2">
            <Sun className="h-10 w-10 text-yellow-500" />
            <h1 className="text-3xl font-bold text-green-800">Ofgen</h1>
          </div>
        </div>

        <Card className="border-green-100 shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Welcome back</CardTitle>
            <CardDescription className="text-center">Enter your credentials to access your account</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="border-green-200 focus-visible:ring-green-500"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link href="/forgot-password" className="text-sm text-green-600 hover:text-green-800">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="border-green-200 focus-visible:ring-green-500"
                  />
                  <Lock className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                />
                <Label
                  htmlFor="remember"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Remember me
                </Label>
              </div>
              <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
                Sign in
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" className="border-green-200">
                Google
              </Button>
              <Button variant="outline" className="border-green-200">
                Microsoft
              </Button>
            </div>
            <div className="text-center text-sm">
              Don't have an account?{" "}
              <Link href="/signup" className="text-green-600 hover:text-green-800 font-medium">
                Sign up
              </Link>
            </div>
          </CardFooter>
        </Card>

        <p className="mt-8 text-center text-sm text-muted-foreground">
          Powering a sustainable future with solar solutions
        </p>
      </div>
    </div>
  )
}

