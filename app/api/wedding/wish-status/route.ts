import { NextResponse } from 'next/server';
import { supabaseServiceRequest } from '@/lib/wedding-invitations';

export const runtime = 'nodejs';

export async function GET(request: Request) {
  const id = new URL(request.url).searchParams.get('id');
  if (!id || !/^[0-9a-f-]{36}$/i.test(id)) {
    return NextResponse.json({ error: 'Mã lời chúc không hợp lệ.' }, { status: 400, headers: { 'Cache-Control': 'no-store' } });
  }

  try {
    const query = new URLSearchParams({ select: 'is_visible', id: `eq.${id}`, wish: 'not.is.null', limit: '1' });
    const response = await supabaseServiceRequest(`wedding_guestbook?${query}`);
    if (!response.ok) {
      console.error('Could not check wedding wish approval:', response.status, await response.text());
      return NextResponse.json({ error: 'Chưa kiểm tra được trạng thái duyệt.' }, { status: 502, headers: { 'Cache-Control': 'no-store' } });
    }
    const [wish] = await response.json() as Array<{ is_visible: boolean }>;
    if (!wish) return NextResponse.json({ error: 'Không tìm thấy lời chúc.' }, { status: 404, headers: { 'Cache-Control': 'no-store' } });
    return NextResponse.json({ approved: wish.is_visible }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    console.error('Wedding wish approval status check failed:', error);
    return NextResponse.json({ error: 'Lỗi máy chủ khi kiểm tra trạng thái duyệt.' }, { status: 500, headers: { 'Cache-Control': 'no-store' } });
  }
}
