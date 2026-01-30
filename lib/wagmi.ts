import { http, createConfig } from 'wagmi'
import { sepolia, mainnet } from 'wagmi/chains'
import { injected, coinbaseWallet } from 'wagmi/connectors'

export function getWagmiConfig() {
  return createConfig({
    chains: [sepolia, mainnet],
    connectors: [
      // MetaMask and other injected wallets (browser extension wallets)
      injected({
        shimDisconnect: true,
      }),
      // Coinbase Wallet
      coinbaseWallet({
        appName: 'OWi',
        preference: 'all',
      }),
    ],
    transports: {
      [sepolia.id]: http(
        process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL || 
        'https://ethereum-sepolia-rpc.publicnode.com'
      ),
      [mainnet.id]: http(
        process.env.NEXT_PUBLIC_MAINNET_RPC_URL ||
        'https://ethereum-rpc.publicnode.com'
      ),
    },
    ssr: true,
  })
}

export type WagmiConfig = ReturnType<typeof getWagmiConfig>
