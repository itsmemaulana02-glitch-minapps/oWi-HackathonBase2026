'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { useAccount } from 'wagmi'
import { Settings, Bell, Shield, Zap } from 'lucide-react'

export default function SettingsPage() {
  const { isConnected, address } = useAccount()

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Settings className="h-12 w-12 text-muted-foreground/50" />
        <h2 className="mt-4 text-xl font-semibold">Connect Your Wallet</h2>
        <p className="mt-2 text-muted-foreground">
          Connect your wallet to access settings
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 
          className="text-2xl font-bold md:text-3xl"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Settings
        </h1>
        <p className="mt-1 text-muted-foreground">
          Manage your account and preferences
        </p>
      </div>

      {/* Account Info */}
      <Card className="border-border/50 bg-card/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Account
          </CardTitle>
          <CardDescription>Your wallet and account information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between rounded-lg bg-muted/30 p-4">
            <div>
              <p className="text-sm font-medium">Connected Wallet</p>
              <p className="font-mono text-xs text-muted-foreground">{address}</p>
            </div>
            <Button variant="outline" size="sm">
              Copy
            </Button>
          </div>
          <div className="flex items-center justify-between rounded-lg bg-muted/30 p-4">
            <div>
              <p className="text-sm font-medium">Network</p>
              <p className="text-xs text-muted-foreground">Base Sepolia (Testnet)</p>
            </div>
            <div className="h-2 w-2 rounded-full bg-success" />
          </div>
        </CardContent>
      </Card>

      {/* AI Settings */}
      <Card className="border-border/50 bg-card/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            AI Settings
          </CardTitle>
          <CardDescription>Configure AI trading behavior</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Auto-Execute AI Decisions</Label>
              <p className="text-xs text-muted-foreground">
                Automatically execute swaps when AI recommends with high confidence
              </p>
            </div>
            <Switch disabled />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Minimum Confidence Threshold</Label>
              <p className="text-xs text-muted-foreground">
                Only auto-execute when AI confidence is above this level
              </p>
            </div>
            <span className="text-sm text-muted-foreground">85%</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Risk Level</Label>
              <p className="text-xs text-muted-foreground">
                Current strategy: Low Risk (USDT + XAUT only)
              </p>
            </div>
            <span className="text-sm font-medium text-success">Low</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Auto-execution coming soon. Currently all swaps require manual approval.
          </p>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card className="border-border/50 bg-card/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notifications
          </CardTitle>
          <CardDescription>Manage notification preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>AI Decision Alerts</Label>
              <p className="text-xs text-muted-foreground">
                Get notified when AI makes a new recommendation
              </p>
            </div>
            <Switch defaultChecked disabled />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Transaction Confirmations</Label>
              <p className="text-xs text-muted-foreground">
                Get notified when transactions are completed
              </p>
            </div>
            <Switch defaultChecked disabled />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Market Alerts</Label>
              <p className="text-xs text-muted-foreground">
                Get notified of significant market movements
              </p>
            </div>
            <Switch disabled />
          </div>
          <p className="text-xs text-muted-foreground">
            Notifications coming in future update.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
