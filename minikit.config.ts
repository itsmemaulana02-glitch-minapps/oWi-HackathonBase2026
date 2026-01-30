// Base Mini App Configuration for OWi
// Learn more: https://docs.base.org/mini-apps/features/manifest

const ROOT_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://o-wi-hackathon-base2026.vercel.app';

export const minikitConfig = {
    accountAssociation: {
        // This will be populated after running the Base Build account association tool
        // Visit: https://www.base.dev/preview?tab=account
        "header": "",
        "payload": "",
        "signature": ""
    },
    miniapp: {
        version: "1",
        name: "OWi",
        subtitle: "AI Gold Autoswap Platform",
        description: "AI-powered gold savings platform with automated swaps between USDT and gold (XAUT) to protect against inflation",
        screenshotUrls: [
            `${ROOT_URL}/owi-screenshot.png`
        ],
        iconUrl: `${ROOT_URL}/owi-icon.png`,
        splashImageUrl: `${ROOT_URL}/owi-splash.png`,
        splashBackgroundColor: "#0A0A0F",
        homeUrl: ROOT_URL,
        webhookUrl: `${ROOT_URL}/api/webhook`,
        primaryCategory: "finance",
        tags: [
            "defi",
            "ai",
            "savings",
            "automation",
            "gold",
            "stablecoin"
        ],
        heroImageUrl: `${ROOT_URL}/owi-hero.png`,
        tagline: "Smart Gold Savings Powered by AI",
        ogTitle: "OWi - AI Gold Autoswap Platform",
        ogDescription: "Protect your savings from inflation with AI-powered automated swaps between USDT and gold",
        ogImageUrl: `${ROOT_URL}/owi-hero.png`,
    },
} as const;
