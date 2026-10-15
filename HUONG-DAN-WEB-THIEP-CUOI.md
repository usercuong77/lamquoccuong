# Tài liệu vận hành website thiệp cưới

Tài liệu này mô tả cách website hiện hoạt động, các thành phần chính, luồng dữ liệu và cách chạy/bảo trì. Khi thay đổi mã hoặc cấu hình Supabase, hãy cập nhật tài liệu này nếu hành vi thực tế thay đổi.

## 1. Tổng quan

- Website dùng Next.js làm máy chủ và phục vụ các trang HTML/CSS/JavaScript tĩnh trong `public/`.
- Thiệp cưới chính là `public/thiepcuoi/index.html`.
- Các trang quản trị là `public/thiepcuoi/tao-link.html` và `public/thiepcuoi/thong-ke.html`.
- Các API Next.js trong `app/api/wedding/` xác thực link mời, xử lý phản hồi và chỉ cho tài khoản quản trị truy cập dữ liệu riêng tư.
- Supabase lưu RSVP, lời chúc, danh sách link mời và quyền mở album.
- Đẩy commit lên nhánh `main` sẽ để Netlify tự build/deploy theo cấu hình repository. Không cần chạy Netlify CLI cho luồng deploy thông thường.

## 2. Đường dẫn trang

Các rewrite trong `next.config.mjs` trỏ về thiệp chính tại `public/thiepcuoi/index.html`:

- `/thiepcuoi`, `/thiepmoinhatrai`, `/thiepmoinhagai`
- `/thiepcuoi/nhatrai`, `/thiepcuoi/nhagai`
- Trang phát hành link: `/thiepcuoi/tao-link.html`
- Trang thống kê: `/thiepcuoi/thong-ke.html`

`public/thiepcuoi/thiepcuoi.html` là một bản HTML riêng/phiên bản cũ; các rewrite nêu trên không dùng file đó làm thiệp chính. Khi kiểm tra thay đổi thiệp trên production, ưu tiên kiểm tra `index.html` qua các URL rewrite.

## 3. Phát hành và xác thực link mời

1. Quản trị viên đăng nhập trang tạo link bằng tài khoản được lưu dưới dạng hash trong `private/admin-credentials.txt`.
2. Trình duyệt gửi tên khách, phía khách và định dạng link tới `POST /api/wedding/invitations`.
3. Máy chủ tạo mã ngẫu nhiên `k` và `invite_key` riêng cho từng link. Cùng tên khách phát hành nhiều lần sẽ tạo các link độc lập, không ghi đè mã cũ.
4. Supabase lưu hash SHA-256 của mã để xác thực và bản mã hóa AES-GCM để trang quản trị có thể dựng lại URL đầy đủ trong danh sách link.
5. URL dùng `to` làm tên khách và `k` làm mã xác thực. Link cũ không có `k` vẫn xem được thiệp nhưng không được tính là link chính thức.
6. API xác thực cả mã lẫn tên/nhà khách trước khi cấp `invite_key` cho trình duyệt. Mã và tên hợp lệ chứng minh người đang dùng có link, không chứng minh danh tính ngoài đời; khách vẫn có thể chuyển tiếp link.

Các API chính:

- `POST /api/wedding/resolve`: xác thực link khi thiệp được mở.
- `GET/POST/DELETE /api/wedding/invitations`: liệt kê, phát hành và xóa link; yêu cầu phiên quản trị với thao tác nhạy cảm.
- `POST /api/wedding/album-access`: thu hồi quyền mở album của một link; không xóa link, RSVP hay lời chúc.

Xóa link mời làm mã đó không còn xác thực được. Lịch sử RSVP/lời chúc hiện có được lưu ở bảng guestbook riêng và không tự xóa theo.

**Lưu ý khi xoay Supabase service key:** khóa mã hóa hiện được suy ra từ service key. Đổi key không làm hash mã mời mất hiệu lực xác thực, nhưng có thể khiến trang quản trị không giải mã được URL đầy đủ của các link đã phát hành trước đó. Trước khi xoay key, hãy lưu lại danh sách URL đã phát hành hoặc chủ động thiết kế cơ chế khóa mã hóa ổn định riêng.

## 4. RSVP

- RSVP chính thức chỉ được gửi qua `POST /api/wedding/respond` với mã link hợp lệ.
- Cơ sở dữ liệu dùng hàm `save_wedding_rsvp` để cập nhật lựa chọn mới nhất theo `invite_key`, thay vì tạo nhiều RSVP trùng cho cùng link.
- Trang thống kê gộp theo link mời, tính số khách tham dự/vắng mặt và cho phép lọc/tìm kiếm.
- `POST /api/wedding/rsvp-status` đọc lựa chọn gần nhất sau khi máy chủ đã xác thực link.

## 5. Lời chúc và duyệt

- Lời chúc từ link chính thức được lưu với `invite_key`, `invite_name` và `is_visible=true`; lời chúc xuất hiện trên thiệp.
- Lời chúc không có mã hợp lệ vẫn được nhận nhưng lưu `is_visible=false`, không có `invite_key`, và chưa xuất hiện công khai.
- Sau khi gửi lời chúc không chính thức, người gửi thấy thông báo cố định **Lời Chúc Đang Chờ Duyệt**. Mã lời chúc được lưu trong `localStorage` của trình duyệt để biết lời chúc nào cần kiểm tra.
- Quản trị viên duyệt hoặc xóa lời chúc ở mục **Lời chúc chờ duyệt** trên trang thống kê. Duyệt đặt `is_visible=true`; xóa sẽ xóa bản ghi chờ duyệt.
- Khi khách đã được duyệt bấm xem album, trang kiểm tra trạng thái của đúng lời chúc qua `GET /api/wedding/wish-status`. Khách không có link chính thức vẫn không được mở album và thấy thông báo **Album chỉ mở bằng link mời chính thức nhé.**
- Nếu chưa được duyệt, bấm album tiếp tục mở lời nhắc gửi lời chúc như trước.

Trang thống kê gọi API có xác thực quản trị để tải RSVP, lời chúc đã duyệt và lời chúc chờ duyệt. Khi đăng nhập, trang kiểm tra thay đổi mới mỗi 30 giây khi tab đang hiển thị; thông báo có thể gồm RSVP mới, thay đổi RSVP, lời chúc mới hoặc lời chúc mới chờ duyệt.

## 6. Album và quyền truy cập

- Bảng `wedding_album_unlocks` lưu quyền mở album cho `invite_key` của link chính thức.
- Trigger `mark_wedding_album_unlocked` tạo quyền khi lời chúc chính thức được lưu hiển thị. Lời chúc chờ duyệt không tự mở album.
- Khi mở album, trang kiểm tra Supabase lại để nhận biết quyền vừa bị thu hồi; quản trị viên có thể thu hồi quyền từ danh sách link.
- Thu hồi chỉ xóa dòng quyền tương ứng trong `wedding_album_unlocks`. Nó không xóa URL hay ảnh đã tải/xem trước đó.
- **Giới hạn quan trọng:** khóa album hiện là luồng kiểm soát trong giao diện. Nếu ảnh được phục vụ như tài nguyên tĩnh/công khai, người biết URL ảnh có thể truy cập trực tiếp; đây không phải DRM hay cơ chế bảo vệ nội dung tuyệt đối.

## 7. Đăng nhập quản trị

- Trang tạo link và trang thống kê dùng chung một tài khoản từ `private/admin-credentials.txt`.
- Định dạng mỗi dòng: `username|scrypt|salt_hex|hash_hex`. Script không lưu mật khẩu rõ.
- `npm run admin:set-credentials` tạo/đổi username và mật khẩu. Có thể chạy mục tương ứng trong `quan-ly-thiep-cuoi.bat`.
- Phiên đăng nhập là cookie HTTP-only, SameSite Strict, Secure trên production và hết hạn sau 8 giờ. Đăng xuất xóa cookie.
- File hash phải được deploy cùng ứng dụng để server production xác thực được tài khoản. Đừng đưa mật khẩu rõ vào Git. Giữ repository riêng tư và chọn mật khẩu khó đoán vì hash trong repository có thể bị đem đi thử đoán ngoại tuyến.
- Next.js được cấu hình include file này trong output tracing để môi trường deploy có thể đọc file.

## 8. Supabase và cấu hình môi trường

Biến môi trường server-side:

- `SUPABASE_URL`: URL của project.
- `SUPABASE_SERVICE_ROLE_KEY`: secret key `sb_secret_...` hoặc service-role JWT cũ. Chỉ dùng ở server/API, tuyệt đối không đưa vào HTML, JavaScript phía trình duyệt hay biến `NEXT_PUBLIC_*`.
- `WEDDING_ADMIN_SESSION_SECRET`: chuỗi ngẫu nhiên tối thiểu 32 ký tự dùng ký cookie quản trị. Nếu bỏ trống, mã hiện tại dùng service key làm khóa phiên; production nên cấu hình biến riêng này để việc xoay service key không làm mất hiệu lực mọi phiên đăng nhập.

Local dùng `.env.local`, file này đã được `.gitignore` loại khỏi Git. `.env.example` chỉ là mẫu, không chứa secret thật. Script cấu hình local nằm ở `scripts/configure-wedding-local.mjs`.

### Các bảng/hàm chính

- `wedding_guestbook`: RSVP và lời chúc; có `invite_key`, `invite_name`, `is_visible`, `status`, `wish`, `created_at`.
- `wedding_invitations`: danh sách link, tên hiển thị, phía khách, mã hash, bản mã hóa để dựng lại URL, trạng thái hoạt động.
- `wedding_album_unlocks`: quyền mở album theo `invite_key`.
- `save_wedding_rsvp(...)`: upsert RSVP mới nhất cho mỗi link.
- `mark_wedding_album_unlocked()`: trigger chỉ mở album cho lời chúc chính thức đã hiển thị.
- `is_wedding_album_unlocked(...)`: kiểm tra quyền mở album từ thiệp.

### Chạy SQL

- Database mới: chạy `public/thiepcuoi/supabase-guestbook-setup.sql`, sau đó chạy `public/thiepcuoi/supabase-invitation-codes-migration.sql`.
- Nếu cần cập nhật RSVP cũ, chạy `public/thiepcuoi/supabase-rsvp-upsert-migration.sql` theo hướng dẫn hiện hành.
- Database đã tồn tại: chạy lại bản mới nhất `public/thiepcuoi/supabase-invitation-codes-migration.sql` sau thay đổi quyền/API. Migration được viết để chạy lại an toàn trong phạm vi các lệnh `IF NOT EXISTS`/`CREATE OR REPLACE` đang dùng.
- Hướng dẫn chi tiết cho bước cấu hình link nằm trong `public/thiepcuoi/INVITATION-CODES-SETUP.md`.

## 9. Chạy local và kiểm tra

Yêu cầu Node.js phù hợp Next.js 16 (Node.js 20.9 trở lên) và các package đã cài.

```powershell
npm install
npm run admin:set-credentials
npm run dev
```

Hoặc mở `quan-ly-thiep-cuoi.bat` để dùng menu quản lý, cấu hình Supabase local, mở migration/hướng dẫn và chạy website. Sau khi đổi `.env.local`, hãy khởi động lại server local.

Các lệnh kiểm tra trước khi push:

```powershell
npm run lint
npx tsc --noEmit
npm run build
```

Kiểm tra thêm `git status` để chắc `.env.local` không xuất hiện trong thay đổi và không commit file build/cache.

## 10. Deploy và xử lý sự cố

- Deploy thông thường: commit và push lên `main`; Netlify tự nhận commit và build. Không chạy `netlify deploy` thủ công song song.
- Nếu deploy báo thiếu đăng nhập: xác nhận `private/admin-credentials.txt` đã được commit và Netlify có đủ biến môi trường server.
- Nếu API báo lỗi Supabase hoặc trang thống kê không tải dữ liệu: kiểm tra URL/secret key trong môi trường tương ứng và chạy migration mới nhất trong Supabase SQL Editor.
- Nếu không tạo được link: kiểm tra migration invitation-codes đã chạy, key là secret/service-role chứ không phải publishable key, và phiên đăng nhập chưa hết hạn.
- Nếu không thấy lời chúc: kiểm tra `is_visible`, trạng thái API `/api/wedding/stats?dataset=wishes`/`pendingWishes`, quyền `service_role` và migration.
- Nếu album không mở sau lời chúc chính thức: kiểm tra trigger và quyền đọc hàm `is_wedding_album_unlocked`; link phải xác thực chính thức.
- Không dán secret key hoặc mật khẩu vào log, GitHub issue, ảnh chụp màn hình hay chat.
