import { NextResponse } from 'next/server';
import { adminLogoutCookie, adminSessionCookie, authenticateAdmin, createAdminSession, isSameOriginRequest, verifyAdminSession } from '@/lib/wedding-admin';

export const runtime = 'nodejs';

export async function GET(request: Request) {
  const session = verifyAdminSession(request);
  return NextResponse.json(session ? { authenticated: true, username: session.username } : { authenticated: false }, {
    headers: { 'Cache-Control': 'no-store' }
  });
}

export async function POST(request: Request) {
  if (!isSameOriginRequest(request)) return NextResponse.json({ error: 'Yêu cầu không hợp lệ.' }, { status: 403 });
  try {
    const body = await request.json() as { username?: unknown; password?: unknown };
    if (typeof body.username !== 'string' || typeof body.password !== 'string' || body.username.length > 80 || body.password.length > 1024) {
      return NextResponse.json({ error: 'Vui lòng nhập tên đăng nhập và mật khẩu hợp lệ.' }, { status: 400 });
    }
    if (!process.env.WEDDING_ADMIN_SESSION_SECRET && (process.env.SUPABASE_SERVICE_ROLE_KEY || '').length < 32) {
      return NextResponse.json({ error: 'Máy chủ chưa cấu hình khóa phiên đăng nhập.' }, { status: 503 });
    }
    if (!await authenticateAdmin(body.username, body.password)) {
      return NextResponse.json({ error: 'Tên đăng nhập hoặc mật khẩu chưa đúng.' }, { status: 401 });
    }
    const response = NextResponse.json({ authenticated: true, username: body.username.trim() }, { headers: { 'Cache-Control': 'no-store' } });
    response.headers.set('Set-Cookie', adminSessionCookie(createAdminSession(body.username.trim())));
    return response;
  } catch (error) {
    console.error('Wedding admin login failed:', error);
    return NextResponse.json({ error: 'Chưa thể đăng nhập. Hãy kiểm tra cấu hình máy chủ.' }, { status: 503 });
  }
}

export async function DELETE(request: Request) {
  if (!isSameOriginRequest(request)) return NextResponse.json({ error: 'Yêu cầu không hợp lệ.' }, { status: 403 });
  const response = NextResponse.json({ authenticated: false }, { headers: { 'Cache-Control': 'no-store' } });
  response.headers.set('Set-Cookie', adminLogoutCookie());
  return response;
}
