# 📋 COMPREHENSIVE ISSUES SPECIFICATION DOCUMENT (REFINED & CODE-AUDITED)

Tài liệu tổng hợp các Issue kỹ thuật đã qua **Audit Mã nguồn thực tế** cho cả **Backend (.NET 8)** và **Frontend (React Vite)** của hệ thống **AutoWash Pro**.

---

## 📌 ISSUE 1: [CUSTOMER] Cancellation Limits (Max 3), 2-Hour Cooldown & 1-Hour Pre-booking Cancel Deadline

### 🔹 BACKEND (BE)

#### 1. Mô tả (Description)
Xây dựng logic đếm số lần hủy đơn (`CancellationCount`) của khách hàng. Khi hủy lần thứ 3 (Max = 3), áp dụng hình phạt tạm khóa quyền đặt lịch trong **2 tiếng** (`CooldownUntil = UtcNow + 2 hours`). Đồng thời điều chỉnh quy định thời hạn hủy đơn: khách hàng chỉ được phép hủy đơn trước giờ hẹn tối thiểu **1 tiếng (60 phút)** (`scheduledTime - UtcNow >= 1 hour`). (Hiện tại code cũ đang hardcode 2 tiếng tại `BookingService.cs:638-639`).

#### 2. Tasklist
- [ ] Bổ sung trường `CancellationCount` (int, default = 0) và `CooldownUntil` (DateTime?, default = null) vào Entity `Customer`.
- [ ] Thêm Migration EF Core cho 2 cột mới trong `Customer`.
- [ ] Sửa `BookingService.CancelBookingAsync`: Đổi điều kiện kiểm tra từ `< 2 hours` thành `< 1 hour`. Nếu trễ hơn 60 phút $\rightarrow$ Quăng Exception `CANCEL_TOO_LATE`.
- [ ] Cập nhật logic khi hủy thành công: Tăng `CancellationCount += 1`. Nếu `CancellationCount >= 3` $\rightarrow$ Set `CooldownUntil = DateTime.UtcNow.AddHours(2)`.
- [ ] Sửa `BookingService.CreateBookingAsync`: Kiểm tra nếu `Customer.CooldownUntil > UtcNow` $\rightarrow$ Báo lỗi `BOOKING_COOLDOWN_ACTIVE`.
- [ ] Reset `CancellationCount = 0` khi đơn hàng rửa xe hoàn thành thành công (`Completed`).

#### 3. Endpoints
- `POST /api/bookings/{id}/cancel` — Hủy đơn đặt lịch (có kiểm tra hạn 1h & đếm lần hủy).

#### 4. Business Rules (Lưu ý)
- **BR-CANCEL-01**: Khách hàng chỉ được phép hủy đơn trước giờ hẹn ít nhất 60 phút.
- **BR-CANCEL-02**: Hủy tối đa 3 lần liên tiếp. Lần thứ 3 bị khóa đặt lịch 2 tiếng.
- **BR-CANCEL-03**: Khi hoàn thành 1 đơn rửa xe (`Completed`), reset số lần hủy về 0.

#### 5. File Structure (BE)
```
Application/
├── Interfaces/
│   └── IBookingService.cs
├── Services/
│   └── BookingService.cs
└── DTOs/
    └── CancelBookingResponseDto.cs

API/
└── Controllers/
    └── BookingsController.cs
```

---

### 1.5 CHỐT LƯU Ý NGHIỆP VỤ 2% MEMBER:
- **Phương án đề xuất**: Cập nhật `DiscountRate` của Hạng thẻ `Member` (mặc định) trong DB Seed Data từ **0% $\rightarrow$ 2.0%**.
- **Lợi ích**: Tận dụng $100\%$ thuộc tính `TierDiscount` hiện có trong `InvoiceResponseDto`, Backend tự động trừ 2% cho tất cả tài khoản Member mà không cần phải viết thêm logic tính toán đè bên ngoài hay thêm trường DTO mới!

---

## 📌 ISSUE 2: [CUSTOMER] License Plate Validation at `StepVehicleTime.jsx` (Pending 2h / Completed 1h)

### 🔹 BACKEND (BE)

#### 1. Mô tả (Description)
Cập nhật logic validate biển số xe. Hiện tại hệ thống đang áp dụng cùng 1 rule buffer 120 phút cho mọi trường hợp.
Cần cập nhật:
1. Đơn đang chờ (`Pending`): Khoảng cách tối thiểu giữa 2 lần đặt là **2 tiếng (120 phút)**.
2. Đơn đã hoàn thành (`Completed`): Giảm khoảng thời gian khóa biển số xuống **1 tiếng (60 phút)** để hỗ trợ việc test/demo đặt lại xe.

*Lưu ý: Tận dụng endpoint sẵn có `GET /api/bookings/available-slots?licensePlate=...` (`BookingsController.cs:196`).*

#### 2. Tasklist
- [ ] Cập nhật logic trong `BookingService.cs` (hàm check buffer biển số xe):
  - Đơn `Pending`: Giữ 120 phút.
  - Đơn `Completed`: Đổi thành 60 phút tính từ `CompletedAt` hoặc `ScheduledTime`.

#### 3. Endpoints
- `GET /api/bookings/available-slots?licensePlate={plate}` — Endpoint đã có sẵn.

---

### 🔸 FRONTEND (FE)

#### 1. Mô tả (Description)
Tại bước 2 [StepVehicleTime.jsx](file:///d:/FER202/SE1924/demo-fe-car-wash/src/components/booking/StepVehicleTime.jsx), bắt sự kiện khi người dùng vừa nhập hoặc chọn xong biển số xe (`onBlur` hoặc chọn từ dropdown xe đã lưu). Gọi ngay API `GET /api/bookings/available-slots` để kiểm tra. Nếu biển số xe bị khóa $\rightarrow$ Hiển thị thông báo lỗi màu đỏ ngay dưới ô nhập biển số và disable nút Tiếp tục.

#### 2. Tasklist
- [ ] Bổ sung trigger validate biển số ngay tại `StepVehicleTime.jsx`.
- [ ] Bắt lỗi vi phạm buffer $\rightarrow$ Hiển thị Inline Error màu đỏ bên dưới input biển số xe.

---

## 📌 ISSUE 3: [CUSTOMER] Targeted Promotion Notifications (Guest vs Tier Member)

### 🔹 BACKEND (BE)

#### 1. Mô tả (Description)
Xây dựng bảng & API quản lý Thông báo Ưu đãi/Khuyến mãi dành cho Khách hàng. Phân quyền hiển thị theo đối tượng (`TargetTier`: "ALL", "GUEST", "SILVER", "GOLD", "PLATINUM").

#### 2. Tasklist
- [ ] Bổ sung cột `TargetTier` (string) và `IsPublic` (bool) vào bảng `Promotions`.
- [ ] Tạo bảng `CustomerNotifications` (NotificationId, CustomerId, Title, Message, IsRead, CreatedAt) để lưu trạng thái đọc/chưa đọc.
- [ ] Viết API `GET /api/promotions/my-notifications` trong `PromotionService.cs`.

---

### 🔸 FRONTEND (FE)

#### 1. Mô tả (Description)
Thêm Icon Chuông Thông Báo (Bell Icon) ở Navbar Header Khách hàng ([CustomerLayout.jsx](file:///d:/FER202/SE1924/demo-fe-car-wash/src/layouts/CustomerLayout.jsx)). Khi click vào chuông $\rightarrow$ Mở Popover hiển thị danh sách Promotion phù hợp kèm Badge đếm số lượng chưa đọc.

---

## 📌 ISSUE 4: [ADMIN] Upgrade Loyalty Rewards (Stock Management & Image Upload)

### 🔹 BACKEND (BE)

#### 1. Mô tả (Description)
Hiện tại Backend đã có sẵn đầy đủ các API CRUD Quà đổi điểm (`AdminRewardController.cs` & `RewardService.cs`). Scope nâng cấp lần này tập trung vào:
1. Bổ sung trường Số lượng tồn kho (`Stock` - int) và Ảnh quà (`ImageUrl` - string) vào Entity `RewardsCatalog`.
2. Tự động trừ tồn kho `Stock -= 1` khi khách hàng thực hiện đổi điểm lấy quà thành công. Nếu `Stock <= 0` $\rightarrow$ Từ chối đổi quà.

#### 2. Tasklist
- [ ] Thêm cột `Stock` (int, default = 99) và `ImageUrl` (string, nullable) vào Entity `RewardsCatalog`.
- [ ] Migration EF Core.
- [ ] Sửa `RewardService.RedeemRewardAsync`: Bổ sung kiểm tra `reward.Stock > 0` và trừ tồn kho `reward.Stock -= 1`.
- [ ] Cập nhật DTO `CreateRewardRequest` & `UpdateRewardRequest` nhận thêm `Stock` và `ImageUrl`.

---

### 🔸 FRONTEND (FE)

#### 1. Mô tả (Description)
Hoàn thiện giao diện Quản lý Quà Đổi Điểm phía Admin ([AdminRewardManagementPage.jsx](file:///d:/FER202/SE1924/demo-fe-car-wash/src/pages/admin/TierConfigPage.jsx)): Bổ sung ô nhập Số lượng tồn kho và Đường dẫn hình ảnh quà vào Modal Thêm/Sửa quà.

---

## 📌 ISSUE 5: [ADMIN - LƯU Ý QUYẾT ĐỊNH] Giữ Nguyên Logic No-Show Linh Hoạt Hiện Tại (Commit `ba64c2b`)

### 🔹 BÁO CÁO AUDIT MÃ NGUỒN:
* Theo commit `ba64c2b` đã được merge vào `main`: Team đã cố tình bỏ điều kiện bắt buộc chờ 15 phút khi Admin bấm No-Show thủ công để linh hoạt vận hành tại trạm.
* Đồng thời bug "giải phóng slot sau khi No-Show" đã được sửa thành công trong commit này.
* **Khuyên nghị**: **GIỮ NGUYÊN** logic No-Show thủ công hiện tại của Admin. Không gò ép lại rule 15 phút để đảm bảo trải nghiệm vận hành thực tế tại trạm rửa xe mượt mà nhất.

---

## 📌 ISSUE 6: [ADMIN] Admin Walk-in Booking (Same-day Slot Selection & Customer Phone Lookup)

### 🔹 BACKEND (BE)

#### 1. Mô tả (Description)
Xây dựng API cho phép Admin Đặt lịch hộ trực tiếp tại trạm (Walk-in Booking):
Tận dụng logic `BookingService.CreateBookingAsync(request, customerId?)` sẵn có (đã hỗ trợ phân nhánh Guest vs Member).
Bổ sung:
1. **API Lookup SĐT**: `GET /api/admin/customers/lookup?phone={phone}` (Tận dụng pattern tìm kiếm SĐT từ `AuthService`).
2. **Ràng buộc Same-day**: Đơn đặt hộ tại trạm chỉ được chọn các Slot thời gian thuộc **Ngày hiện tại (Same-day)** có thời gian `> UtcNow`.

#### 2. Tasklist
- [ ] Viết API Lookup Khách hàng theo SĐT trong `AdminCustomerService.cs`.
- [ ] Viết Method `CreateWalkInBookingAsync` trong `AdminBookingService.cs` (chỉ cho phép đặt slot trong ngày hiện tại).

---

### 🔸 FRONTEND (FE)

#### 1. Mô tả (Description)
Tạo Modal / Màn hình Booking Hộ phía Admin (`AdminWalkInBookingModal.jsx`):
1. Nhập SĐT $\rightarrow$ Tự động Lookup thông tin Khách hàng (Tên, Hạng thẻ, Điểm).
2. Chọn Slot thời gian còn trống trong ngày (các Slot thời gian đã trôi qua tự động bị disabled/xám màu).
3. Bấm "Xác nhận đặt lịch tại chỗ".

---

*Tài liệu đã được cập nhật chính xác $100\%$ theo đúng hiện trạng mã nguồn tại file [doc/ISSUES_SPECIFICATION.md](file:///d:/FER202/SE1924/demo-fe-car-wash/doc/ISSUES_SPECIFICATION.md).*
