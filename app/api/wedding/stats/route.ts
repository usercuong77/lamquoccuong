import { NextResponse } from 'next/server';
import { verifyAdminSession } from '@/lib/wedding-admin';
import { supabaseServiceRequest } from '@/lib/wedding-invitations';

export const runtime = 'nodejs';

type Dataset = 'responses' | 'wishes' | 'pendingWishes' | 'updates';

async function readDataset(dataset: Dataset, since: string | null) {
  const rows: unknown[] = [];
  let offset = 0;
  const pageSize = dataset === 'updates' ? 100 : 1000;
  const selectWithInviteName = 'id,name,invite_name,side,status,wish,invite_key,is_visible,created_at';
  const selectWithoutInviteName = 'id,name,side,status,wish,invite_key,is_visible,created_at';

  while (true) {
    const query = new URLSearchParams({
      select: selectWithInviteName,
      order: dataset === 'updates' ? 'created_at.asc' : 'created_at.desc',
      limit: String(pageSize),
      offset: String(offset)
    });
    if (dataset === 'responses' || dataset === 'wishes') query.set('is_visible', 'eq.true');
    if (dataset === 'responses') query.set('wish', 'is.null');
    if (dataset === 'wishes' || dataset === 'pendingWishes') query.set('wish', 'not.is.null');
    if (dataset === 'pendingWishes') query.set('is_visible', 'eq.false');
    if (dataset === 'updates' && since) query.set('created_at', `gt.${since}`);

    let response = await supabaseServiceRequest(`wedding_guestbook?${query}`);
    if (!response.ok && /invite_name|column/i.test(await response.clone().text())) {
      query.set('select', selectWithoutInviteName);
      response = await supabaseServiceRequest(`wedding_guestbook?${query}`);
    }
    if (!response.ok) {
      const details = await response.json().catch(() => null) as { code?: string } | null;
      if (details?.code === '42501') {
        throw new Error('Supabase đã kết nối nhưng thiếu quyền đọc bảng lời chúc/RSVP. Hãy chạy lại supabase-invitation-codes-migration.sql trong SQL Editor.');
      }
      throw new Error(`Supabase trả lỗi HTTP ${response.status} khi tải thống kê.`);
    }

    const batch = await response.json() as unknown[];
    rows.push(...batch);
    if (dataset === 'updates' || batch.length < pageSize) break;
    offset += pageSize;
  }
  return rows;
}

export async function GET(request: Request) {
  if (!verifyAdminSession(request)) {
    return NextResponse.json({ error: 'Vui lòng đăng nhập để xem thống kê.' }, { status: 401, headers: { 'Cache-Control': 'no-store' } });
  }

  const url = new URL(request.url);
  const dataset = url.searchParams.get('dataset');
  if (dataset !== 'responses' && dataset !== 'wishes' && dataset !== 'pendingWishes' && dataset !== 'updates') {
    return NextResponse.json({ error: 'Loại dữ liệu thống kê không hợp lệ.' }, { status: 400 });
  }
  const since = dataset === 'updates' ? url.searchParams.get('since') : null;
  if (since && Number.isNaN(Date.parse(since))) {
    return NextResponse.json({ error: 'Mốc thời gian không hợp lệ.' }, { status: 400 });
  }

  try {
    const rows = await readDataset(dataset, since);
    return NextResponse.json(rows, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    console.error('Wedding dashboard data query failed:', error);
    const message = error instanceof Error ? error.message : 'Chưa tải được dữ liệu thống kê.';
    return NextResponse.json({ error: message }, { status: 502, headers: { 'Cache-Control': 'no-store' } });
  }
}
