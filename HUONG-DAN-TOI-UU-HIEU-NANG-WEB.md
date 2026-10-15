# Tối Ưu Hiệu Năng Web

- Bỏ `filter: blur(...)` khỏi hiệu ứng xuất hiện; chỉ dùng `opacity` và `transform`.
- Nếu cần `will-change`, chỉ bật tạm trong lúc animation chạy và gỡ khi animation kết thúc.
- Thêm `loading="lazy"` cho ảnh nằm phía dưới trang.
- Không gắn `will-change` cho hàng trăm hoặc hàng nghìn chữ.
