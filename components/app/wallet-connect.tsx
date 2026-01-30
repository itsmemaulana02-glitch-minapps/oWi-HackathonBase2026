'use client'

import { useAccount, useConnect, useDisconnect, useChainId, useSwitchChain } from 'wagmi'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Wallet, LogOut, Copy, ExternalLink, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'
import { useState } from 'react'
import { sepolia } from 'wagmi/chains'

export function WalletConnect() {
  const { address, isConnected, chain } = useAccount()
  const { connect, connectors, isPending } = useConnect()
  const { disconnect } = useDisconnect()
  const chainId = useChainId()
  const { switchChain } = useSwitchChain()
  const [isModalOpen, setIsModalOpen] = useState(false)

  const isWrongNetwork = isConnected && chainId !== sepolia.id

  const handleConnect = (connectorId: number) => {
    const connector = connectors[connectorId]
    if (connector) {
      connect({ connector }, {
        onSuccess: () => {
          setIsModalOpen(false)
          toast.success('Wallet connected successfully')
        },
        onError: (error) => {
          toast.error(error.message || 'Failed to connect wallet')
        }
      })
    }
  }

  const handleSwitchNetwork = () => {
    switchChain({ chainId: sepolia.id }, {
      onSuccess: () => {
        toast.success('Switched to Sepolia testnet')
      },
      onError: () => {
        toast.error('Failed to switch network')
      }
    })
  }

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address)
      toast.success('Address copied to clipboard')
    }
  }

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  const getConnectorIcon = (name: string) => {
    const lowerName = name.toLowerCase()
    if (lowerName.includes('metamask')) return '🦊'
    if (lowerName.includes('coinbase')) return '💰'
    if (lowerName.includes('injected') || lowerName.includes('browser')) return '🌐'
    return '👛'
  }

  const getConnectorLabel = (name: string) => {
    const lowerName = name.toLowerCase()
    if (lowerName.includes('injected')) return 'MetaMask / Browser Wallet'
    return name
  }

  if (!isConnected) {
    return (
      <>
        <Button 
          onClick={() => setIsModalOpen(true)}
          className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
          disabled={isPending}
        >
          <Wallet className="h-4 w-4" />
          {isPending ? 'Connecting...' : 'Connect Wallet'}
        </Button>

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Connect your wallet</DialogTitle>
              <DialogDescription>
                Choose a wallet to connect. We recommend using Sepolia testnet for demo purposes.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-3 py-4">
              {connectors.map((connector, index) => (
                <Button
                  key={connector.uid}
                  variant="outline"
                  className="w-full justify-start gap-3 h-14 bg-transparent"
                  onClick={() => handleConnect(index)}
                  disabled={isPending}
                >
                  <span className="text-xl">{getConnectorIcon(connector.name)}</span>
                  <div className="flex flex-col items-start">
                    <span className="font-medium">{getConnectorLabel(connector.name)}</span>
                    <span className="text-xs text-muted-foreground">
                      Click to connect
                    </span>
                  </div>
                </Button>
              ))}
            </div>
            <div className="rounded-lg bg-muted p-3 text-sm text-muted-foreground">
              <p className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                Demo Mode: Using Sepolia testnet
              </p>
              <p className="mt-1 text-xs">
                Get free Sepolia ETH from{' '}
                <a 
                  href="https://sepoliafaucet.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary underline"
                >
                  sepoliafaucet.com
                </a>
              </p>
            </div>
          </DialogContent>
        </Dialog>
      </>
    )
  }

  if (isWrongNetwork) {
    return (
      <Button 
        onClick={handleSwitchNetwork}
        variant="destructive"
        className="gap-2"
      >
        <AlertCircle className="h-4 w-4" />
        Switch to Sepolia
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2 bg-transparent">
          <div className="h-2 w-2 rounded-full bg-success" />
          {formatAddress(address!)}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">Connected</p>
            <p className="text-xs leading-none text-muted-foreground">
              {chain?.name || 'Sepolia'} Testnet
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={copyAddress} className="gap-2">
          <Copy className="h-4 w-4" />
          Copy Address
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <a 
            href={`https://sepolia.etherscan.io/address/${address}`}
            target="_blank"
            rel="noopener noreferrer"
            className="gap-2"
          >
            <ExternalLink className="h-4 w-4" />
            View on Etherscan
          </a>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={() => disconnect()} 
          className="gap-2 text-destructive focus:text-destructive"
        >
          <LogOut className="h-4 w-4" />
          Disconnect
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
