import { NextResponse } from 'next/server';
import { lookupWeddingInvitation, supabaseServiceRequest } from '@/lib/wedding-invitations';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const body = await request.json() as { code?: unknown; inviteName?: unknown; side?: unknown };
    if (typeof body.code !== 'string' || typeof body.inviteName !== 'string' || typeof body.side !== 'string') {
      return NextResponse.json({ error: 'Thiếu thông tin xác thực link mời.' }, { status: 400 });
    }
    const invitation = await lookupWeddingInvitation(body.code, body.inviteName, body.side);
    if (!invitation) return NextResponse.json({ error: 'Tên và mã mời không khớp.' }, { status: 403 });

    const query = new URLSearchParams({
      select: 'status',
      invite_key: `eq.${invitation.invite_key}`,
      status: 'not.is.null',
      wish: 'is.null',
      order: 'created_at.desc',
      limit: '1'
    });
    const response = await supabaseServiceRequest(`wedding_guestbook?${query}`);
    if (!response.ok) throw new Error(`RSVP lookup failed (${response.status})`);
    const [latest] = await response.json() as Array<{ status: string }>;
    return NextResponse.json({ status: latest?.status || '' }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    console.error('Wedding RSVP status lookup failed:', error);
    return NextResponse.json({ error: 'Chưa tải được trạng thái xác nhận.' }, { status: 502 });
  }
}
