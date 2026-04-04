'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { CreditCard, Lock, ShieldCheck } from 'lucide-react'
import { toast } from 'sonner'

export default function PaymentPage() {
  const router = useRouter()
  const [isProcessing, setIsProcessing] = useState(false)

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false)
      toast.success('Payment successful! Your ad is now pending review.')
      router.push('/dashboard/ads')
    }, 2000)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight mb-2">Complete Payment</h1>
        <p className="text-muted-foreground text-lg">Enter your payment details to submit your ad for review.</p>
      </div>

      <div className="flex items-center gap-3 mb-8 px-2">
        <div className="flex-1 h-2.5 rounded-full shadow-inner bg-indigo-600" />
        <div className="flex-1 h-2.5 rounded-full shadow-inner bg-indigo-600" />
        <div className="flex-1 h-2.5 rounded-full shadow-inner bg-gradient-to-r from-indigo-500 to-purple-500" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <form onSubmit={handlePayment}>
            <Card className="border-border/80 shadow-md">
              <CardHeader className="bg-muted/10 border-b border-border/40 pb-6 mb-4">
                <CardTitle className="text-xl flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-indigo-500" /> Payment Details
                </CardTitle>
                <CardDescription>All transactions are secure and encrypted.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 px-6">
                <div className="space-y-3">
                  <Label className="font-semibold text-foreground/80">Cardholder Name</Label>
                  <Input required placeholder="Jane Doe" className="h-12 bg-muted/20 font-medium text-base" />
                </div>
                
                <div className="space-y-3">
                  <Label className="font-semibold text-foreground/80">Card Number</Label>
                  <div className="relative">
                    <CreditCard className="absolute left-4 top-3.5 h-5 w-5 text-muted-foreground" />
                    <Input required placeholder="0000 0000 0000 0000" className="pl-12 h-12 bg-muted/20 font-medium text-base font-mono" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label className="font-semibold text-foreground/80">Expiration Date</Label>
                    <Input required placeholder="MM/YY" className="h-12 bg-muted/20 font-medium text-base font-mono" />
                  </div>
                  <div className="space-y-3">
                    <Label className="font-semibold text-foreground/80">CVC</Label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-3.5 h-5 w-5 text-muted-foreground" />
                      <Input required type="password" placeholder="123" maxLength={4} className="pl-12 h-12 bg-muted/20 font-medium text-base font-mono tracking-widest" />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-6 pb-6 px-6 mt-4 bg-muted/5 border-t border-border/40 flex justify-end gap-4">
                <Button type="button" variant="ghost" className="h-12 px-6 font-medium" onClick={() => router.back()}>Back</Button>
                <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 h-12 px-10 font-bold shadow-md shadow-indigo-500/20" disabled={isProcessing}>
                  {isProcessing ? 'Processing securely...' : 'Pay $49.99 & Submit Ad'}
                </Button>
              </CardFooter>
            </Card>
          </form>
        </div>

        <div>
          <Card className="border-indigo-500/30 bg-indigo-50/50 dark:bg-indigo-950/20 shadow-sm sticky top-24 overflow-hidden rounded-xl">
            <div className="h-2 bg-gradient-to-r from-indigo-500 to-purple-500" />
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-bold">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5 text-sm font-medium px-6">
              <div className="flex justify-between items-center text-base">
                <span className="text-foreground/80">Premium Package</span>
                <span className="font-bold">$49.99</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Duration</span>
                <span>30 Days</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Featured Badge</span>
                <span className="text-indigo-600 dark:text-indigo-400 font-semibold">Included</span>
              </div>
              <div className="pt-4 border-t border-indigo-200 dark:border-indigo-800 flex justify-between font-extrabold text-xl lg:text-2xl mt-4">
                <span>Total</span>
                <span className="text-indigo-600 dark:text-indigo-400">$49.99</span>
              </div>
            </CardContent>
            <CardFooter className="flex-col items-center justify-center pt-4 pb-8 text-center space-y-3 bg-muted/10 mt-2">
              <div className="p-3 bg-green-100 dark:bg-green-900/40 rounded-full">
                <ShieldCheck className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <p className="text-xs text-muted-foreground font-semibold">Guaranteed Safe & Secure Checkout</p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
