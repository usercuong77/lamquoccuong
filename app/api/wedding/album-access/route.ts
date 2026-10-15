import { NextResponse } from 'next/server';
import { isSameOriginRequest, verifyAdminSession } from '@/lib/wedding-admin';
import { supabaseServiceRequest } from '@/lib/wedding-invitations';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  if (!isSameOriginRequest(request)) return NextResponse.json({ error: 'Yêu cầu không hợp lệ.' }, { status: 403 });
  if (!verifyAdminSession(request)) return NextResponse.json({ error: 'Vui lòng đăng nhập lại để quản lý quyền album.' }, { status: 401 });

  try {
    const body = await request.json() as { id?: unknown };
    if (typeof body.id !== 'string' || !/^[0-9a-f-]{36}$/i.test(body.id)) {
      return NextResponse.json({ error: 'Mã link không hợp lệ.' }, { status: 400 });
    }

    const invitationQuery = new URLSearchParams({ select: 'invite_key', id: `eq.${body.id}`, limit: '1' });
    const invitationResponse = await supabaseServiceRequest(`wedding_invitations?${invitationQuery}`);
    if (!invitationResponse.ok) throw new Error(`Invitation lookup failed (${invitationResponse.status})`);
    const [invitation] = await invitationResponse.json() as Array<{ invite_key: string }>;
    if (!invitation) return NextResponse.json({ error: 'Link không tồn tại hoặc đã bị thu hồi.' }, { status: 404 });

    const unlockQuery = new URLSearchParams({ invite_key: `eq.${invitation.invite_key}` });
    const revokeResponse = await supabaseServiceRequest(`wedding_album_unlocks?${unlockQuery}`, {
      method: 'DELETE',
      headers: { Prefer: 'return=minimal' }
    });
    if (!revokeResponse.ok) {
      console.error('Could not revoke wedding album access:', revokeResponse.status, await revokeResponse.text());
      return NextResponse.json({ error: 'Chưa thu hồi được quyền album. Kiểm tra migration Supabase.' }, { status: 502 });
    }

    return NextResponse.json({ revoked: true }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    console.error('Wedding album access revocation failed:', error);
    return NextResponse.json({ error: 'Lỗi máy chủ khi thu hồi quyền album.' }, { status: 500 });
  }
}
