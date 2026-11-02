import { NextResponse } from 'next/server';
import { isSameOriginRequest } from '@/lib/wedding-admin';
import {
  lookupWeddingInvitation,
  supabaseServiceRequest,
  verifyAlbumAccessToken,
  createAlbumAccessToken
} from '@/lib/wedding-invitations';

export const runtime = 'nodejs';

// Danh sách ảnh cưới chỉ trả về cho khách đã xác thực gửi lời chúc
const WEDDING_ALBUM_PHOTOS = [
  {
    src: '/thiepcuoi/anime-wedding-moment.svg',
    alt: 'Minh họa anime khoảnh khắc ngày cưới',
    caption: 'Khoảnh khắc ngày vui - Hạnh phúc đong đầy trong từng nụ cười và ánh mắt trao nhau.'
  },
  {
    src: '/thiepcuoi/anime-wedding-lotus.svg',
    alt: 'Minh họa anime cô dâu chú rể bên hoa sen',
    caption: 'Bên nhau ngày cưới - Tình yêu thanh tao, bền chặt như đóa sen hồng giữa mùa hạ.'
  },
  {
    src: '/thiepcuoi/anime-groom.svg',
    alt: 'Minh họa anime chú rể Quốc Cường',
    caption: 'Chú rể Quốc Cường - ánh mắt tràn ngập niềm vui ngày chung đôi.'
  },
  {
    src: '/thiepcuoi/anime-bride.svg',
    alt: 'Minh họa anime cô dâu Kim Liên',
    caption: 'Cô dâu Kim Liên - nét duyên dịu dàng, nụ cười hạnh phúc.'
  }
];

async function handleAlbumAccess(params: {
  token?: unknown;
  code?: unknown;
  inviteName?: unknown;
  side?: unknown;
}) {
  let authorized = false;
  let subject = 'anonymous-wisher';

  // 1. Kiểm tra Token mã hóa (chỉ cấp cho link mời chính thức đã gửi lời chúc)
  if (typeof params.token === 'string' && params.token.trim()) {
    const verifiedSub = verifyAlbumAccessToken(params.token.trim());
    if (verifiedSub && /^[0-9a-f-]{36}$/i.test(verifiedSub)) {
      authorized = true;
      subject = verifiedSub;
    }
  }

  // 2. Nếu chưa có token, kiểm tra bằng mã thiệp chính thức đã từng gửi lời chúc trong Supabase chưa
  if (!authorized && typeof params.code === 'string' && typeof params.inviteName === 'string' && typeof params.side === 'string') {
    try {
      const invitation = await lookupWeddingInvitation(params.code, params.inviteName, params.side);
      if (invitation) {
        const rpcResponse = await supabaseServiceRequest('rpc/is_wedding_album_unlocked', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ p_invite_key: invitation.invite_key })
        });
        if (rpcResponse.ok) {
          const isUnlocked = await rpcResponse.json();
          if (isUnlocked === true) {
            authorized = true;
            subject = invitation.invite_key;
          }
        }
      }
    } catch (dbError) {
      console.warn('Could not check Supabase album unlock status:', dbError);
    }
  }

  // 3. Nếu chưa hợp lệ -> Chặn 403 Forbidden!
  if (!authorized) {
    return NextResponse.json({
      unlocked: false,
      error: 'Bạn cần gửi lời chúc trước khi xem album ảnh cưới nhé!',
      firewall: '[SECURITY] Client-side bypass blocked. Photo payload not transferred.',
      troll: '👋 Dân IT với nhau, đừng F12 nữa bạn ơi! Hãy gửi một lời chúc thật lòng nhé ❤️'
    }, {
      status: 403,
      headers: { 'Cache-Control': 'no-store' }
    });
  }

  // 4. Nếu hợp lệ -> Cấp token mới và gửi mảng ảnh
  const freshToken = createAlbumAccessToken(subject);
  return NextResponse.json({
    unlocked: true,
    photos: WEDDING_ALBUM_PHOTOS,
    token: freshToken
  }, {
    headers: { 'Cache-Control': 'no-store' }
  });
}

export async function POST(request: Request) {
  if (!isSameOriginRequest(request)) {
    return NextResponse.json({ error: 'Yêu cầu không hợp lệ.' }, { status: 403 });
  }

  try {
    const body = await request.json().catch(() => ({})) as {
      token?: unknown;
      code?: unknown;
      inviteName?: unknown;
      side?: unknown;
    };
    return handleAlbumAccess(body);
  } catch (error) {
    console.error('Wedding album photo access error:', error);
    return NextResponse.json({ error: 'Lỗi máy chủ khi lấy dữ liệu album.' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  if (!isSameOriginRequest(request)) {
    return NextResponse.json({ error: 'Yêu cầu không hợp lệ.' }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(request.url);
    return handleAlbumAccess({
      token: searchParams.get('token') || undefined,
      code: searchParams.get('code') || undefined,
      inviteName: searchParams.get('to') || undefined,
      side: searchParams.get('side') || undefined
    });
  } catch (error) {
    console.error('Wedding album photo access error:', error);
    return NextResponse.json({ error: 'Lỗi máy chủ khi lấy dữ liệu album.' }, { status: 500 });
  }
}
