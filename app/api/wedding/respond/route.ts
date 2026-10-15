import { NextResponse } from 'next/server';
import { isSameOriginRequest } from '@/lib/wedding-admin';
import { lookupWeddingInvitation, supabaseServiceRequest } from '@/lib/wedding-invitations';

export const runtime = 'nodejs';

type ResponseInput = {
  action?: unknown;
  code?: unknown;
  inviteName?: unknown;
  name?: unknown;
  side?: unknown;
  wish?: unknown;
  status?: unknown;
};

export async function POST(request: Request) {
  try {
    if (!isSameOriginRequest(request)) return NextResponse.json({ error: 'Yêu cầu không hợp lệ.' }, { status: 403 });
    const body = await request.json() as ResponseInput;
    if (typeof body.name !== 'string' || body.name.trim().length < 1 || body.name.trim().length > 80) {
      return NextResponse.json({ error: 'Tên người gửi phải dài từ 1 đến 80 ký tự.' }, { status: 400 });
    }

    if (body.action === 'rsvp') {
      if (typeof body.code !== 'string' || typeof body.inviteName !== 'string' || typeof body.side !== 'string') {
        return NextResponse.json({ error: 'RSVP chỉ dùng được từ link mời chính thức.' }, { status: 400 });
      }
      const invitation = await lookupWeddingInvitation(body.code, body.inviteName, body.side);
      if (!invitation) return NextResponse.json({ error: 'Tên và mã mời không khớp. Hãy mở đúng link được gửi cho bạn.' }, { status: 403 });
      if (body.status !== 'Sẽ tham dự' && body.status !== 'Bận việc tiếc quá') {
        return NextResponse.json({ error: 'Trạng thái xác nhận không hợp lệ.' }, { status: 400 });
      }
      const response = await supabaseServiceRequest('rpc/save_wedding_rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          p_invite_key: invitation.invite_key,
          p_name: body.name.trim(),
          p_invite_name: invitation.display_name,
          p_side: invitation.side,
          p_status: body.status
        })
      });
      if (!response.ok) {
        console.error('Could not save RSVP:', response.status, await response.text());
        return NextResponse.json({ error: 'Chưa lưu được xác nhận. Hãy kiểm tra cấu hình Supabase.' }, { status: 502 });
      }
      return NextResponse.json(await response.json(), { headers: { 'Cache-Control': 'no-store' } });
    }

    if (body.action === 'wish') {
      if (typeof body.side !== 'string' || !['Nhà Trai', 'Nhà Gái', 'Cả Hai'].includes(body.side)) {
        return NextResponse.json({ error: 'Thông tin phía khách mời không hợp lệ.' }, { status: 400 });
      }
      if (typeof body.wish !== 'string' || body.wish.trim().length < 1 || body.wish.trim().length > 1000) {
        return NextResponse.json({ error: 'Lời chúc phải dài từ 1 đến 1000 ký tự.' }, { status: 400 });
      }
      let invitation: Awaited<ReturnType<typeof lookupWeddingInvitation>> = null;
      if (typeof body.code === 'string' && typeof body.inviteName === 'string') {
        invitation = await lookupWeddingInvitation(body.code, body.inviteName, body.side);
      }
      const response = await supabaseServiceRequest('wedding_guestbook?select=id,name,side,wish,created_at', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Prefer: 'return=representation' },
        body: JSON.stringify({
          name: body.name.trim(),
          invite_name: invitation?.display_name || (typeof body.inviteName === 'string' ? body.inviteName.trim().slice(0, 120) : null),
          side: invitation?.side || body.side,
          status: null,
          wish: body.wish.trim(),
          invite_key: invitation?.invite_key || null,
          is_visible: Boolean(invitation)
        })
      });
      if (!response.ok) {
        console.error('Could not save wedding wish:', response.status, await response.text());
        return NextResponse.json({ error: 'Chưa gửi được lời chúc. Hãy kiểm tra migration Supabase.' }, { status: 502 });
      }
      const [savedWish] = await response.json();
      return NextResponse.json({ ...savedWish, pendingApproval: !invitation }, { headers: { 'Cache-Control': 'no-store' } });
    }

    return NextResponse.json({ error: 'Loại phản hồi không hợp lệ.' }, { status: 400 });
  } catch (error) {
    console.error('Wedding response failed:', error);
    return NextResponse.json({ error: 'Lỗi máy chủ khi lưu phản hồi.' }, { status: 500 });
  }
}
