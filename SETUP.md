# OWi - AI Gold Autoswap Platform

## Quick Start Guide for Local Development & Demo

### Prerequisites

- Node.js 18+ (recommended: 20+)
- npm or yarn or pnpm
- MetaMask browser extension (or any Web3 wallet)
- Sepolia testnet ETH (for demo)

---

## 1. Clone & Install

```bash
# Clone the repository
git clone <your-repo-url>
cd owi-app

# Install dependencies
npm install
# or
yarn install
# or
pnpm install
```

---

## 2. Environment Setup

Copy the example environment file:

```bash
cp .env.example .env.local
```

### Required Environment Variables

#### Supabase Setup

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Create a new project
3. Go to Settings > API
4. Copy `Project URL` and `anon/public` key

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...
```

#### WalletConnect (Optional but recommended)

1. Go to [WalletConnect Cloud](https://cloud.walletconnect.com)
2. Create a new project (free)
3. Copy the Project ID

```env
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your-project-id
```

#### RPC URLs (Optional)

Get free API keys from [Alchemy](https://www.alchemy.com) or [Infura](https://infura.io):

```env
NEXT_PUBLIC_SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/your-key
```

---

## 3. Database Setup

Run the SQL scripts in your Supabase SQL Editor:

1. Go to Supabase Dashboard > SQL Editor
2. Run `scripts/001_create_tables.sql`
3. Run `scripts/002_create_triggers.sql`

---

## 4. Run the Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 5. Demo Wallet Setup

### Getting Sepolia Test ETH

1. Install MetaMask extension
2. Add Sepolia testnet:
   - Network Name: Sepolia
   - RPC URL: https://sepolia.infura.io/v3/YOUR_KEY
   - Chain ID: 11155111
   - Currency Symbol: ETH
   - Block Explorer: https://sepolia.etherscan.io

3. Get free test ETH from faucets:
   - [Alchemy Sepolia Faucet](https://sepoliafaucet.com)
   - [Infura Sepolia Faucet](https://www.infura.io/faucet/sepolia)
   - [Google Cloud Sepolia Faucet](https://cloud.google.com/application/web3/faucet/ethereum/sepolia)

---

## 6. Demo Flow for Judges

### Step 1: Connect Wallet
1. Click "Launch App" on the landing page
2. Click "Connect Wallet"
3. Select MetaMask (or preferred wallet)
4. Approve the connection
5. Make sure you're on Sepolia testnet

### Step 2: View Dashboard
- Portfolio overview with demo USDT and XAUT balances
- AI insights panel showing market analysis
- Quick actions for manual swaps

### Step 3: Test AI Decisions
1. Go to "AI Decisions" page
2. View pending AI swap recommendations
3. Approve or reject suggestions
4. Watch the swap execute (simulated)

### Step 4: Check History
- View all past transactions
- See AI-triggered vs manual swaps
- Export transaction history

### Step 5: Settings
- Configure AI risk tolerance
- Set auto-swap thresholds
- Manage notification preferences

---

## Project Structure

```
/
├── app/
│   ├── page.tsx              # Landing page
│   ├── app/                   # Main application
│   │   ├── page.tsx          # Dashboard
│   │   ├── decisions/        # AI decisions
│   │   ├── history/          # Transaction history
│   │   ├── portfolio/        # Portfolio view
│   │   └── settings/         # User settings
│   ├── auth/                  # Authentication pages
│   └── api/                   # API routes
├── components/
│   ├── app/                   # App components
│   ├── landing/               # Landing page components
│   └── ui/                    # UI components (shadcn)
├── lib/
│   ├── wagmi.ts              # Wallet configuration
│   ├── supabase/             # Supabase clients
│   └── types.ts              # TypeScript types
└── scripts/                   # Database migration scripts
```

---

## Troubleshooting

### "Connect Wallet" not working
- Make sure MetaMask is installed
- Check if you're on Sepolia testnet
- Try refreshing the page

### "Wrong Network" error
- Click "Switch to Sepolia" button
- Or manually switch in MetaMask

### Database errors
- Verify Supabase credentials in `.env.local`
- Make sure SQL scripts have been run

### AI features not working
- The app uses demo/simulated AI decisions
- Real AI integration requires API keys

---

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS v4 + shadcn/ui
- **Database**: Supabase (PostgreSQL)
- **Blockchain**: wagmi v3 + WalletConnect
- **AI**: Vercel AI SDK (simulated for demo)

---

## Support

For issues or questions:
- Open an issue on GitHub
- Contact the team at support@owi.app

---

## License

MIT License - See LICENSE file for details
