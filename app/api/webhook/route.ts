import { NextRequest, NextResponse } from 'next/server';

// Webhook endpoint for Base Mini App events
// This endpoint receives events from the Base app about your mini app
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Log the webhook event for debugging
        console.log('Base Mini App Webhook Event:', body);

        // Handle different event types
        const { type, data } = body;

        switch (type) {
            case 'miniapp.installed':
                // Handle when a user installs your mini app
                console.log('Mini app installed:', data);
                break;

            case 'miniapp.uninstalled':
                // Handle when a user uninstalls your mini app
                console.log('Mini app uninstalled:', data);
                break;

            case 'miniapp.launched':
                // Handle when a user launches your mini app
                console.log('Mini app launched:', data);
                break;

            default:
                console.log('Unknown event type:', type);
        }

        // Respond with success
        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        console.error('Webhook error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// Health check endpoint
export async function GET() {
    return NextResponse.json({
        status: 'ok',
        message: 'Base Mini App webhook endpoint is ready',
    });
}
