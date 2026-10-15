import { NextResponse } from 'next/server';
import { isSameOriginRequest, verifyAdminSession } from '@/lib/wedding-admin';
import { supabaseServiceRequest } from '@/lib/wedding-invitations';

export const runtime = 'nodejs';

function validId(id: unknown): id is string {
  return typeof id === 'string' && /^[0-9a-f-]{36}$/i.test(id);
}

async function requireAdmin(request: Request) {
  if (!isSameOriginRequest(request)) return NextResponse.json({ error: 'Yêu cầu không hợp lệ.' }, { status: 403 });
  if (!verifyAdminSession(request)) return NextResponse.json({ error: 'Vui lòng đăng nhập lại để duyệt lời chúc.' }, { status: 401 });
  return null;
}

export async function PATCH(request: Request) {
  const denied = await requireAdmin(request);
  if (denied) return denied;

  try {
    const body = await request.json() as { id?: unknown };
    if (!validId(body.id)) return NextResponse.json({ error: 'Mã lời chúc không hợp lệ.' }, { status: 400 });
    const query = new URLSearchParams({ id: `eq.${body.id}`, wish: 'not.is.null', is_visible: 'eq.false', select: 'id' });
    const response = await supabaseServiceRequest(`wedding_guestbook?${query}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Prefer: 'return=representation' },
      body: JSON.stringify({ is_visible: true })
    });
    if (!response.ok) {
      console.error('Could not approve wedding wish:', response.status, await response.text());
      return NextResponse.json({ error: 'Chưa duyệt được lời chúc.' }, { status: 502 });
    }
    const [approved] = await response.json() as Array<{ id: string }>;
    if (!approved) return NextResponse.json({ error: 'Lời chúc không tồn tại hoặc đã được xử lý.' }, { status: 404 });
    return NextResponse.json({ approved: true }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    console.error('Wedding wish approval failed:', error);
    return NextResponse.json({ error: 'Lỗi máy chủ khi duyệt lời chúc.' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const denied = await requireAdmin(request);
  if (denied) return denied;

  try {
    const body = await request.json() as { id?: unknown };
    if (!validId(body.id)) return NextResponse.json({ error: 'Mã lời chúc không hợp lệ.' }, { status: 400 });
    const query = new URLSearchParams({ id: `eq.${body.id}`, wish: 'not.is.null', is_visible: 'eq.false', select: 'id' });
    const response = await supabaseServiceRequest(`wedding_guestbook?${query}`, {
      method: 'DELETE',
      headers: { Prefer: 'return=representation' }
    });
    if (!response.ok) {
      console.error('Could not reject wedding wish:', response.status, await response.text());
      return NextResponse.json({ error: 'Chưa xoá được lời chúc chờ duyệt.' }, { status: 502 });
    }
    const [deleted] = await response.json() as Array<{ id: string }>;
    if (!deleted) return NextResponse.json({ error: 'Lời chúc không tồn tại hoặc đã được xử lý.' }, { status: 404 });
    return NextResponse.json({ deleted: true }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    console.error('Wedding pending wish deletion failed:', error);
    return NextResponse.json({ error: 'Lỗi máy chủ khi xoá lời chúc.' }, { status: 500 });
  }
}
