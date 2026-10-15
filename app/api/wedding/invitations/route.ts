import { NextResponse } from 'next/server';
import { createInvitationCode, createInviteKey, decryptInvitationCode, encryptInvitationCode, hashInvitationCode, supabaseServiceRequest, type WeddingSide } from '@/lib/wedding-invitations';
import { isSameOriginRequest, verifyAdminSession } from '@/lib/wedding-admin';

export const runtime = 'nodejs';

type GuestInput = { name?: unknown };

export async function GET(request: Request) {
  if (!verifyAdminSession(request)) return NextResponse.json({ error: 'Vui lòng đăng nhập để xem link đã phát hành.' }, { status: 401 });

  try {
    const query = new URLSearchParams({
      select: 'id,invite_key,code_ciphertext,display_name,side,is_active,created_at,base_url,link_format',
      order: 'created_at.desc',
      limit: '1000'
    });
    const response = await supabaseServiceRequest(`wedding_invitations?${query}`);
    if (!response.ok) {
      console.error('Could not load wedding invitations:', response.status, await response.text());
      return NextResponse.json({ error: 'Chưa tải được danh sách link. Có thể bạn cần chạy migration Supabase mới.' }, { status: 502 });
    }
    const rows = await response.json() as Array<{
      id: string; invite_key: string; code_ciphertext: string | null; display_name: string;
      side: WeddingSide; is_active: boolean; created_at: string; base_url: string | null; link_format: string | null;
    }>;
    const unlockResponse = await supabaseServiceRequest('wedding_album_unlocks?select=invite_key');
    if (!unlockResponse.ok) {
      console.error('Could not load wedding album access:', unlockResponse.status, await unlockResponse.text());
      return NextResponse.json({ error: 'Chưa tải được trạng thái mở album. Hãy chạy migration Supabase mới.' }, { status: 502 });
    }
    const unlockedKeys = new Set((await unlockResponse.json() as Array<{ invite_key: string }>).map(row => row.invite_key));
    const invitations = rows.map(row => {
      let code: string | null = null;
      try { if (row.code_ciphertext) code = decryptInvitationCode(row.code_ciphertext); } catch (error) {
        console.error('Could not decrypt an issued wedding link:', row.id, error);
      }
      return { id: row.id, inviteKey: row.invite_key, name: row.display_name, side: row.side, isActive: row.is_active, albumUnlocked: unlockedKeys.has(row.invite_key), createdAt: row.created_at, code, baseUrl: row.base_url, linkFormat: row.link_format };
    });
    return NextResponse.json({ invitations }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    console.error('Wedding invitation list failed:', error);
    return NextResponse.json({ error: 'Lỗi máy chủ khi tải danh sách link.' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  if (!isSameOriginRequest(request)) return NextResponse.json({ error: 'Yêu cầu không hợp lệ.' }, { status: 403 });
  if (!verifyAdminSession(request)) return NextResponse.json({ error: 'Vui lòng đăng nhập lại để xoá link.' }, { status: 401 });

  try {
    const body = await request.json() as { id?: unknown };
    if (typeof body.id !== 'string' || !/^[0-9a-f-]{36}$/i.test(body.id)) {
      return NextResponse.json({ error: 'Mã link không hợp lệ.' }, { status: 400 });
    }
    const response = await supabaseServiceRequest(`wedding_invitations?id=eq.${encodeURIComponent(body.id)}&select=id`, {
      method: 'DELETE',
      headers: { Prefer: 'return=representation' }
    });
    if (!response.ok) {
      console.error('Could not delete wedding invitation:', response.status, await response.text());
      return NextResponse.json({ error: 'Chưa xoá được link.' }, { status: 502 });
    }
    const deleted = await response.json() as Array<{ id: string }>;
    if (!deleted.length) return NextResponse.json({ error: 'Link không tồn tại hoặc đã được xoá.' }, { status: 404 });
    return NextResponse.json({ deleted: true }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    console.error('Wedding invitation deletion failed:', error);
    return NextResponse.json({ error: 'Lỗi máy chủ khi xoá link.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!isSameOriginRequest(request)) return NextResponse.json({ error: 'Yêu cầu không hợp lệ.' }, { status: 403 });
  if (!verifyAdminSession(request)) return NextResponse.json({ error: 'Vui lòng đăng nhập lại để phát hành link.' }, { status: 401 });

  try {
    const body = await request.json() as { side?: unknown; guests?: unknown; baseUrl?: unknown; linkFormat?: unknown };
    const side = body.side;
    if (side !== 'Nhà Trai' && side !== 'Nhà Gái') {
      return NextResponse.json({ error: 'Phía khách mời không hợp lệ.' }, { status: 400 });
    }
    if (!Array.isArray(body.guests) || body.guests.length < 1 || body.guests.length > 200) {
      return NextResponse.json({ error: 'Danh sách phải có từ 1 đến 200 khách.' }, { status: 400 });
    }
    const baseUrl = body.baseUrl === 'http://localhost:3000' ? body.baseUrl : 'https://lamquoccuong.com';
    const linkFormat = body.linkFormat === 'telex' || body.linkFormat === 'slug' || body.linkFormat === 'original' ? body.linkFormat : 'telex';

    const guests = (body.guests as GuestInput[]).map(guest => typeof guest.name === 'string' ? guest.name.trim() : '');
    if (guests.some(name => name.length < 1 || name.length > 120)) {
      return NextResponse.json({ error: 'Tên khách phải dài từ 1 đến 120 ký tự.' }, { status: 400 });
    }

    const issued = guests.map(name => {
      const code = createInvitationCode();
      return { name, code, invite_key: createInviteKey() };
    });
    const rows = issued.map(invitation => ({
      invite_key: invitation.invite_key,
      code_hash: hashInvitationCode(invitation.code),
      code_ciphertext: encryptInvitationCode(invitation.code),
      base_url: baseUrl,
      link_format: linkFormat,
      display_name: invitation.name,
      side,
      is_active: true
    }));
    const response = await supabaseServiceRequest('wedding_invitations?select=id,invite_key,display_name,side,created_at', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Prefer: 'return=representation' },
      body: JSON.stringify(rows)
    });
    if (!response.ok) {
      console.error('Could not issue wedding invitations:', response.status, await response.text());
      return NextResponse.json({ error: 'Chưa tạo được link. Kiểm tra migration Supabase và cấu hình máy chủ.' }, { status: 502 });
    }

    const saved = await response.json() as Array<{ id: string; invite_key: string; display_name: string; side: WeddingSide; created_at: string }>;
    if (saved.length !== issued.length) {
      return NextResponse.json({ error: 'Máy chủ tạo thiếu link, vui lòng kiểm tra danh sách trước khi thử lại.' }, { status: 502 });
    }
    const issuedByKey = new Map<string, (typeof issued)[number]>(issued.map(item => [item.invite_key, item]));
    const invitations = saved.map(row => ({
      name: row.display_name,
      side: row.side,
      inviteKey: row.invite_key,
      id: row.id,
      createdAt: row.created_at,
      code: issuedByKey.get(row.invite_key)?.code
    }));
    if (invitations.some(invitation => !invitation.code)) {
      return NextResponse.json({ error: 'Không ghép được mã với khách, hãy kiểm tra dữ liệu trước khi phát hành.' }, { status: 502 });
    }
    return NextResponse.json({ invitations }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    console.error('Wedding invitation creation failed:', error);
    return NextResponse.json({ error: 'Lỗi máy chủ khi tạo link mời.' }, { status: 500 });
  }
}
