import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { OWiLogo } from '@/components/ui/owi-logo'
import { CheckCircle2, Mail } from 'lucide-react'

export default function SignUpSuccessPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader className="text-center">
          <Link href="/" className="mx-auto mb-4 flex items-center gap-2">
            <OWiLogo className="h-10 w-10" />
            <span 
              className="text-2xl font-bold"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              OWi
            </span>
          </Link>
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-success/20">
            <CheckCircle2 className="h-8 w-8 text-success" />
          </div>
          <CardTitle>Check Your Email</CardTitle>
          <CardDescription>
            {"We've sent you a confirmation link"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <div className="rounded-lg bg-muted/50 p-4">
            <Mail className="mx-auto h-8 w-8 text-muted-foreground" />
            <p className="mt-2 text-sm text-muted-foreground">
              Click the link in your email to verify your account and start using OWi.
            </p>
          </div>
          
          <p className="text-xs text-muted-foreground">
            {"Didn't receive an email? Check your spam folder or try signing up again."}
          </p>

          <div className="flex flex-col gap-2">
            <Link href="/auth/login">
              <Button className="w-full bg-primary text-primary-foreground">
                Go to Login
              </Button>
            </Link>
            <Link href="/">
              <Button variant="outline" className="w-full bg-transparent">
                Back to Home
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
