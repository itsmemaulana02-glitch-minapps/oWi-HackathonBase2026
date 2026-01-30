import { NextResponse } from 'next/server';
import { minikitConfig } from '@/minikit.config';

// This route serves the Base Mini App manifest
// Required endpoint: /.well-known/farcaster.json
export async function GET() {
    return NextResponse.json(minikitConfig, {
        headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
        },
    });
}
