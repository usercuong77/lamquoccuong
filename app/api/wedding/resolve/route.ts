import { NextResponse } from 'next/server';
import { lookupWeddingInvitation } from '@/lib/wedding-invitations';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const body = await request.json() as { code?: unknown; name?: unknown; side?: unknown };
    if (typeof body.code !== 'string' || typeof body.name !== 'string' || typeof body.side !== 'string') {
      return NextResponse.json({ error: 'Link mời không hợp lệ.' }, { status: 400 });
    }
    const invitation = await lookupWeddingInvitation(body.code, body.name, body.side);
    if (!invitation) return NextResponse.json({ error: 'Tên và mã mời không khớp.' }, { status: 403 });
    return NextResponse.json({ inviteKey: invitation.invite_key, displayName: invitation.display_name, side: invitation.side }, {
      headers: { 'Cache-Control': 'no-store' }
    });
  } catch (error) {
    console.error('Wedding invitation validation failed:', error);
    return NextResponse.json({ error: 'Chưa xác thực được link mời.' }, { status: 503 });
  }
}
