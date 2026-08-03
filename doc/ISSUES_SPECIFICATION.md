# 📋 ISSUES SPECIFICATION DOCUMENT (FINAL & CODE-AUDITED)

Tài liệu tổng hợp các Issue kỹ thuật đã qua **Audit Mã nguồn thực tế** cho cả **Backend (.NET 8)** và **Frontend (React Vite)** của hệ thống **AutoWash Pro**.

---

## 📌 ISSUE 1: [CUSTOMER] Cancellation Limits (Max 3), 2-Hour Cooldown & 1-Hour Cancel Deadline

### 🔹 BACKEND (BE)

#### 1. Mô tả (Description)
Xây dựng logic đếm số lần hủy đơn (`CancellationCount`) của khách hàng. Khi hủy lần thứ 3 (Max = 3), áp dụng hình phạt tạm khóa quyền đặt lịch trong **2 tiếng** (`CooldownUntil = UtcNow + 2 hours`). Đồng thời điều chỉnh quy định thời hạn hủy đơn: khách hàng chỉ được phép hủy đơn trước giờ hẹn tối thiểu **1 tiếng (60 phút)** (`scheduledTime - UtcNow >= 1 hour`). (Thay thế đoạn code hardcode 2 tiếng tại `BookingService.cs:638-639`).

#### 2. Tasklist
- [ ] Bổ sung trường `CancellationCount` (int, default = 0) và `CooldownUntil` (DateTime?, default = null) vào Entity `Customer`.
- [ ] Tạo EF Core Migration cho 2 cột mới trong bảng `Customer`.
- [ ] Sửa `BookingService.CancelBookingAsync`: Đổi điều kiện kiểm tra từ `< 2 hours` thành `< 1 hour`. Nếu trễ hơn 60 phút $\rightarrow$ Quăng Exception `CANCEL_TOO_LATE`.
- [ ] Cập nhật logic khi hủy thành công: Tăng `CancellationCount += 1`. Nếu `CancellationCount >= 3` $\rightarrow$ Set `CooldownUntil = DateTime.UtcNow.AddHours(2)`.
- [ ] Sửa `BookingService.CreateBookingAsync`: Kiểm tra nếu `Customer.CooldownUntil > UtcNow` $\rightarrow$ Báo lỗi `BOOKING_COOLDOWN_ACTIVE`.
- [ ] Reset `CancellationCount = 0` khi đơn hàng rửa xe hoàn thành thành công (`Completed`).

#### 3. Endpoints
- `POST /api/bookings/{id}/cancel` — Hủy đơn đặt lịch (kiểm tra hạn 1h & đếm lần hủy).

#### 4. Business Rules
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

### 🔸 FRONTEND (FE)

#### 1. Mô tả (Description)
Cập nhật giao diện nút "Hủy đơn" tại `BookingCard.jsx` và `BookingDetailModal.jsx`: chỉ bật nút Hủy nếu giờ hẹn còn cách giờ hiện tại $\ge 1$ tiếng. Bắt mã lỗi `BOOKING_COOLDOWN_ACTIVE` từ API để hiển thị Toast thông báo khách đang trong thời gian bị phạt 2 tiếng.

#### 2. Tasklist
- [ ] Sửa hàm `canCancel(booking)` tại `BookingCard.jsx` & `BookingDetailModal.jsx`: đổi từ `7200 * 1000` (2h) thành `3600 * 1000` (1h).
- [ ] Bổ sung xử lý thông báo lỗi `BOOKING_COOLDOWN_ACTIVE` trong `StepConfirm.jsx` khi tạo đơn.

#### 3. File Structure (FE)
```
src/
├── components/
│   └── booking/
│       ├── BookingCard.jsx
│       ├── BookingDetailModal.jsx
│       └── StepConfirm.jsx
└── utils/
    └── datetime.js
```

---

## 📌 ISSUE 2: [CUSTOMER] Instant License Plate Validation & Dynamic Lock Buffer

### 🔹 BACKEND (BE)

#### 1. Mô tả (Description)
Cập nhật logic buffer kiểm tra biển số xe trong `BookingService.cs` (`BookingService.cs:263-274` & `:864-874`):
1. Đơn đang chờ (`Pending`): Khoảng cách tối thiểu giữa 2 lần đặt xe là **2 tiếng (120 phút)**.
2. Đơn đã hoàn thành (`Completed`): Giảm khoảng thời gian khóa biển số xuống **1 tiếng (60 phút)** để hỗ trợ việc test/demo đặt lại xe.

#### 2. Tasklist
- [ ] Cập nhật logic trong `BookingService.cs`:
  - Với đơn `Pending`: Giữ nguyên buffer 120 phút.
  - Với đơn `Completed`: Đổi buffer thành 60 phút tính từ `CompletedAt` / `ScheduledTime`.

#### 3. Endpoints
- `GET /api/bookings/available-slots?licensePlate={plate}` — Tận dụng endpoint sẵn có (`BookingsController.cs:196`).

---

### 🔸 FRONTEND (FE)

#### 1. Mô tả (Description)
Tại bước 2 `StepVehicleTime.jsx`, bắt sự kiện khi người dùng vừa nhập hoặc chọn xong biển số xe (`onBlur` hoặc chọn từ dropdown xe đã lưu). Lập tức gọi API `GET /api/bookings/available-slots` để kiểm tra. Nếu biển số xe bị khóa $\rightarrow$ Hiển thị thông báo lỗi màu đỏ ngay dưới ô nhập biển số và disable nút Tiếp tục.

#### 2. Tasklist
- [ ] Bổ sung trigger validate biển số ngay tại `StepVehicleTime.jsx`.
- [ ] Bắt lỗi vi phạm buffer $\rightarrow$ Hiển thị Inline Error màu đỏ bên dưới input biển số xe.

#### 3. File Structure (FE)
```
src/
├── components/
│   └── booking/
│       └── StepVehicleTime.jsx
└── services/
    └── vehicleService.js
```

---

## 📌 ISSUE 3: [CUSTOMER] Promotion Notification Bell & Targeted Tier Popover

### 🔹 BACKEND (BE)

#### 1. Mô tả (Description)
Xây dựng API lấy danh sách Khuyến mãi/Thông báo dành riêng cho người dùng đang đăng nhập dựa trên Hạng thẻ (`TargetTier`: "ALL", "GUEST", "SILVER", "GOLD", "PLATINUM").

#### 2. Tasklist
- [ ] Bổ sung trường `TargetTier` (string) và `IsPublic` (bool) vào bảng `Promotions`.
- [ ] Tạo bảng `CustomerNotifications` (NotificationId, CustomerId, Title, Message, IsRead, CreatedAt) để lưu trạng thái đọc/chưa đọc.
- [ ] Viết API `GET /api/promotions/my-notifications` trong `PromotionService.cs`.

#### 3. Endpoints
- `GET /api/promotions/my-notifications` — Lấy danh sách ưu đãi/thông báo của khách hàng.

#### 4. File Structure (BE)
```
Application/
├── Services/
│   └── PromotionService.cs
└── DTOs/
    └── PromotionNotificationDto.cs

API/
└── Controllers/
    └── PromotionsController.cs
```

---

### 🔸 FRONTEND (FE)

#### 1. Mô tả (Description)
Thêm Icon Chuông Thông Báo (Bell Icon) ở Navbar Header Khách hàng (`CustomerLayout.jsx`). Khi click vào chuông $\rightarrow$ Mở Popover hiển thị danh sách Promotion phù hợp kèm Badge đếm số lượng chưa đọc.

#### 2. Tasklist
- [ ] Tạo Component `NotificationBell.jsx` đính vào `CustomerLayout.jsx`.
- [ ] Gọi API `promotionService.getMyNotifications()`.
- [ ] Hiển thị danh sách Voucher/Khuyến mãi kèm nút "Sao chép mã" hoặc "Dùng ngay".

#### 3. File Structure (FE)
```
src/
├── components/
│   └── common/
│       └── NotificationBell.jsx
├── layouts/
│   └── CustomerLayout.jsx
└── services/
    └── promotionService.js
```

---

## 📌 ISSUE 4: [CUSTOMER] Member Tier 2% Discount Seed Data & StepConfirm Breakdown

### 🔹 BACKEND (BE)

#### 1. Mô tả (Description)
Cập nhật tỷ lệ giảm giá `DiscountRate` của Hạng thẻ `Member` (mặc định) trong Database Seed Data từ **0% $\rightarrow$ 2.0%**.

#### 2. Tasklist
- [ ] Sửa Seed Data DB / Migration: Cập nhật `DiscountRate = 2.0` cho Record `Member` trong bảng `Tiers`.

---

### 🔸 FRONTEND (FE)

#### 1. Mô tả (Description)
Tại bước 3 `StepConfirm.jsx`, hiển thị minh bạch khoản giảm giá Thành viên Member (2%) trong phần Chi tiết hoá đơn `Invoice Breakdown`.

#### 2. Tasklist
- [ ] Kiểm tra và hiển thị dòng `Giảm giá Thành viên Member (2%): -X.XXX đ` dựa trên `InvoiceResponseDto.TierDiscount`.

---

## 📌 ISSUE 5: [ADMIN] Upgrade Loyalty Rewards (Stock Quantity, Image Upload & Stock Deduction)

### 🔹 BACKEND (BE)

#### 1. Mô tả (Description)
Backend đã có sẵn đầy đủ các API CRUD Quà đổi điểm (`AdminRewardController.cs` & `RewardService.cs`). Scope lần này tập trung vào:
1. Bổ sung trường Số lượng tồn kho (`Stock` - int) và Ảnh quà (`ImageUrl` - string) vào Entity `RewardsCatalog`.
2. Tự động trừ tồn kho `Stock -= 1` khi khách hàng đổi điểm thành công.

#### 2. Tasklist
- [ ] Thêm cột `Stock` (int, default = 99) và `ImageUrl` (string, nullable) vào Entity `RewardsCatalog`.
- [ ] Migration EF Core.
- [ ] Sửa `RewardService.RedeemRewardAsync`: Bổ sung kiểm tra `reward.Stock > 0` và trừ tồn kho `reward.Stock -= 1`.
- [ ] Cập nhật DTO `CreateRewardRequest` & `UpdateRewardRequest` nhận thêm `Stock` và `ImageUrl`.

#### 3. Endpoints
- `GET /api/admin/rewards`
- `POST /api/admin/rewards`
- `PUT /api/admin/rewards/{id}`
- `DELETE /api/admin/rewards/{id}`

---

### 🔸 FRONTEND (FE)

#### 1. Mô tả (Description)
Cập nhật giao diện Quản lý Quà Đổi Điểm phía Admin (`AdminRewardManagementPage.jsx`): Bổ sung ô nhập Số lượng tồn kho và Đường dẫn hình ảnh quà vào Modal Thêm/Sửa quà.

#### 2. Tasklist
- [ ] Cập nhật Modal `RewardFormModal.jsx` thêm ô `Stock` và `ImageUrl`.

---

## 📌 ISSUE 6: [ADMIN] Admin Walk-in Booking (Same-day Slot Selection & Phone Lookup)

### 🔹 BACKEND (BE)

#### 1. Mô tả (Description)
Xây dựng API cho phép Admin Đặt lịch hộ trực tiếp tại trạm (Walk-in Booking):
Tận dụng logic `BookingService.CreateBookingAsync(request, customerId?)` sẵn có (đã hỗ trợ phân nhánh Guest vs Member).
Bổ sung:
1. **API Lookup SĐT**: `GET /api/admin/customers/lookup?phone={phone}` (Tận dụng pattern tìm kiếm SĐT từ `AuthService`).
2. **Ràng buộc Same-day**: Đơn đặt hộ tại trạm chỉ được chọn các Slot thời gian thuộc **Ngày hiện tại (Same-day)** có thời gian `> UtcNow`.

#### 2. Tasklist
- [ ] Viết API Lookup Khách hàng theo SĐT trong `AdminCustomerService.cs`.
- [ ] Viết Method `CreateWalkInBookingAsync` trong `AdminBookingService.cs` (ràng buộc chọn slot trong ngày hiện tại).

#### 3. Endpoints
- `GET /api/admin/customers/lookup?phone={phone}` — Lookup thông tin khách theo SĐT.
- `POST /api/admin/bookings/walk-in` — Admin tạo đơn rửa xe trực tiếp tại trạm.

---

### 🔸 FRONTEND (FE)

#### 1. Mô tả (Description)
Tạo Modal / Màn hình Booking Hộ phía Admin (`AdminWalkInBookingModal.jsx`):
1. Nhập SĐT $\rightarrow$ Tự động Lookup thông tin Khách hàng (Tên, Hạng thẻ, Điểm).
2. Chọn Slot thời gian còn trống trong ngày (các Slot thời gian đã trôi qua tự động bị disabled/xám màu).
3. Bấm "Xác nhận đặt lịch tại chỗ".

#### 2. Tasklist
- [ ] Tạo Component `AdminWalkInBookingModal.jsx`.
- [ ] Thêm nút "Đặt lịch trực tiếp tại trạm" ở trang `BookingManagementPage.jsx` Admin.
- [ ] Viết logic Lookup SĐT và lọc danh sách Slot thời gian theo ngày hiện tại.

---

## 📌 BHI CHÚ QUYẾT ĐỊNH: Admin No-Show Handling
* **Quyết định**: Giữ nguyên logic No-Show thủ công linh hoạt hiện tại của Admin theo Commit `ba64c2b` (Cho phép Admin bấm No-Show bất kỳ lúc nào để giải phóng slot cho luồng Walk-in Booking tại trạm). Không revert lại rule chờ 15 phút.
