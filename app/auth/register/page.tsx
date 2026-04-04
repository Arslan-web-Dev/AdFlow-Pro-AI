'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { toast } from 'sonner'
import Link from 'next/link'

const USERNAME_RE = /^[a-z0-9_]{3,24}$/

export default function RegisterPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [username, setUsername] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const hasKeys = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_URL !== 'your_supabase_url_here'

    const handle = username.trim().toLowerCase()
    if (!USERNAME_RE.test(handle)) {
      toast.error('Username must be 3–24 characters: lowercase letters, numbers, or underscore.')
      setLoading(false)
      return
    }

    if (hasKeys) {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: name, username: handle },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      if (error) {
        toast.error(error.message)
        setLoading(false)
        return
      }
      toast.success('Account created! Check your email to verify.')
    } else {
      toast.info('Mock Auth: Supabase keys not set yet.')
      router.push('/dashboard')
    }

    setLoading(false)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/10 p-4">
      <Card className="w-full max-w-md shadow-xl border-border/80">
        <CardHeader className="space-y-3 px-8 pt-8 text-center pb-6">
          <CardTitle className="text-3xl font-black tracking-tight text-indigo-950 dark:text-indigo-100">Create Account</CardTitle>
          <CardDescription className="text-base text-muted-foreground font-medium">
            Join AdFlow Pro and start listing your ads today
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleRegister}>
          <CardContent className="space-y-5 px-8">
            <div className="space-y-2">
              <Label htmlFor="name" className="font-semibold">Full Name</Label>
              <Input id="name" type="text" placeholder="Jane Doe" required value={name} onChange={(e) => setName(e.target.value)} className="h-12 bg-muted/20 font-medium" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="username" className="font-semibold">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="jane_doe"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value.toLowerCase())}
                className="h-12 bg-muted/20 font-mono text-sm font-medium"
                autoComplete="username"
              />
              <p className="text-xs text-muted-foreground">Shown on your profile as @handle (a–z, 0–9, _).</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="font-semibold">Email</Label>
              <Input id="email" type="email" placeholder="m@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} className="h-12 bg-muted/20 font-medium" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="font-semibold">Password</Label>
              <Input id="password" type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} className="h-12 bg-muted/20" />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4 px-8 pb-8 pt-4">
            <Button type="submit" className="w-full h-12 text-base font-bold bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-500/20" disabled={loading}>
              {loading ? 'Creating Account...' : 'Create Account'}
            </Button>
            <p className="text-sm text-center text-muted-foreground font-medium">
              Already have an account?{' '}
              <Link href="/auth/login" className="font-bold text-indigo-600 hover:text-indigo-500 hover:underline">
                Sign In
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
