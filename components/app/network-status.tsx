'use client'

import { useAccount, useBalance, useChainId } from 'wagmi'
import { sepolia } from 'wagmi/chains'
import { AlertCircle, CheckCircle, ExternalLink, Wifi } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'

export function NetworkStatus() {
  const { address, isConnected } = useAccount()
  const chainId = useChainId()
  const { data: balance } = useBalance({ address })

  const isCorrectNetwork = chainId === sepolia.id
  const hasBalance = balance && Number(balance.formatted) > 0

  if (!isConnected) {
    return (
      <Alert className="border-yellow-500/50 bg-yellow-500/10">
        <Wifi className="h-4 w-4 text-yellow-500" />
        <AlertTitle className="text-yellow-500">Demo Mode</AlertTitle>
        <AlertDescription className="text-yellow-500/80">
          Connect your wallet to interact with the Sepolia testnet demo.
        </AlertDescription>
      </Alert>
    )
  }

  if (!isCorrectNetwork) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Wrong Network</AlertTitle>
        <AlertDescription>
          Please switch to Sepolia testnet to use the demo. Click the network switch button in your wallet.
        </AlertDescription>
      </Alert>
    )
  }

  if (!hasBalance) {
    return (
      <Alert className="border-blue-500/50 bg-blue-500/10">
        <AlertCircle className="h-4 w-4 text-blue-500" />
        <AlertTitle className="text-blue-500">Get Test ETH</AlertTitle>
        <AlertDescription className="text-blue-500/80">
          You need Sepolia ETH for gas fees.{' '}
          <Button variant="link" className="h-auto p-0 text-blue-400" asChild>
            <a 
              href="https://sepoliafaucet.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1"
            >
              Get free test ETH <ExternalLink className="h-3 w-3" />
            </a>
          </Button>
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <Alert className="border-success/50 bg-success/10">
      <CheckCircle className="h-4 w-4 text-success" />
      <AlertTitle className="text-success">Connected to Sepolia</AlertTitle>
      <AlertDescription className="text-success/80">
        Balance: {Number(balance.formatted).toFixed(4)} ETH
      </AlertDescription>
    </Alert>
  )
}
