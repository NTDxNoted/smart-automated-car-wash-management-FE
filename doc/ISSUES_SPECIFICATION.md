# 📋 COMPREHENSIVE ISSUES SPECIFICATION DOCUMENT (BE & FE SEPARATED)

Tài liệu tổng hợp các Issue kỹ thuật chuẩn hóa cho cả **Backend (.NET 8)** và **Frontend (React Vite)** của hệ thống **AutoWash Pro**.

---

## 📌 ISSUE 1: [CUSTOMER] Cancellation Limits (Max 3), 2-Hour Cooldown & 1-Hour Pre-booking Cancel Deadline

### 🔹 BACKEND (BE)

#### 1. Mô tả (Description)
Xây dựng logic đếm số lần hủy đơn (`CancellationCount`) của khách hàng. Khi hủy lần thứ 3 (Max = 3), áp dụng hình phạt tạm khóa quyền đặt lịch trong **2 tiếng** (`CooldownUntil = UtcNow + 2 hours`). Đồng thời điều chỉnh quy định thời hạn hủy đơn: khách hàng chỉ được phép hủy đơn trước giờ hẹn tối thiểu **1 tiếng (60 phút)** (`scheduledTime - UtcNow >= 1 hour`). Nếu trễ hơn 60 phút, hệ thống từ chối hủy.

#### 2. Tasklist
- [ ] Bổ sung trường `CancellationCount` (int) và `CooldownUntil` (DateTime?) vào Entity `Customer`.
- [ ] Thêm validation trong `BookingService.CancelBookingAsync`: Kiểm tra `scheduledTime - UtcNow >= 1 hour`. Nếu `< 1h` $\rightarrow$ quăng Exception `INVALID_CANCELLATION_DEADLINE`.
- [ ] Cập nhật logic hủy đơn: Tăng `CancellationCount += 1`. Nếu `CancellationCount >= 3` $\rightarrow$ Set `CooldownUntil = DateTime.UtcNow.AddHours(2)`.
- [ ] Thêm validation trong `BookingService.CreateBookingAsync`: Kiểm tra nếu `Customer.CooldownUntil > UtcNow` $\rightarrow$ Báo lỗi `BOOKING_COOLDOWN_ACTIVE`.
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

### 🔸 FRONTEND (FE)

#### 1. Mô tả (Description)
Cập nhật giao diện nút "Hủy đơn" tại `BookingCard.jsx` và `BookingDetailModal.jsx`: chỉ bật nút Hủy nếu giờ hẹn còn cách giờ hiện tại $\ge 1$ tiếng (thay vì 2 tiếng trước đây). Đồng thời xử lý bắt mã lỗi `BOOKING_COOLDOWN_ACTIVE` từ API để hiển thị Toast thông báo khách đang trong thời gian bị phạt 2 tiếng.

#### 2. Tasklist
- [ ] Sửa hàm `canCancel(booking)` tại `BookingCard.jsx` & `BookingDetailModal.jsx`: đổi từ `7200 * 1000` (2h) thành `3600 * 1000` (1h).
- [ ] Bổ sung thông báo lỗi `BOOKING_COOLDOWN_ACTIVE` trong `StepConfirm.jsx` khi tạo đơn.

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

## 📌 ISSUE 2: [CUSTOMER] Instant License Plate Validation at `StepVehicleTime.jsx` & Dynamic Lock Buffer

### 🔹 BACKEND (BE)

#### 1. Mô tả (Description)
Cung cấp API kiểm tra nhanh trạng thái biển số xe (`ValidateLicensePlateAvailability`). Một biển số xe không thể đặt lịch mới nếu:
1. Đang có đơn ở trạng thái `Pending`.
2. Đã hoàn thành (`Completed`) nhưng thời gian hoàn thành chưa qua **1 tiếng** (Buffer khóa biển số sau khi rửa).

#### 2. Tasklist
- [ ] Viết Method `ValidateLicensePlateAsync(string licensePlate)` trong `BookingService.cs`.
- [ ] Kiểm tra DB: Tìm đơn gần nhất của `licensePlate`:
  - Nếu có đơn `Pending` $\rightarrow$ Trả về `AVAILABLE = false`, lý do `HAS_PENDING_BOOKING`.
  - Nếu đơn mới nhất là `Completed` và `CompletedAt / ScheduledTime` cách hiện tại `< 1 hour` $\rightarrow$ Trả về `AVAILABLE = false`, lý do `COMPLETED_LOCK_ACTIVE`.
- [ ] Phơi API Endpoint `POST /api/vehicles/validate-plate`.

#### 3. Endpoints
- `POST /api/vehicles/validate-plate` — Validate khả năng đặt lịch của biển số xe.
  - Body: `{ "licensePlate": "51L-007.10" }`
  - Response: `{ "isAvailable": false, "reason": "Biển số xe vừa hoàn thành trong vòng 1 giờ, vui lòng thử lại sau.", "unlockAt": "2026-08-03T16:30:00Z" }`

#### 4. Business Rules (Lưu ý)
- **BR-PLATE-01**: Biển số xe có đơn `Pending` không được phép đặt đơn mới.
- **BR-PLATE-02**: Biển số xe vừa `Completed` bị khóa 1 tiếng trước khi đặt lượt tiếp theo.

#### 5. File Structure (BE)
```
Application/
├── Interfaces/
│   └── IVehicleService.cs
├── Services/
│   └── VehicleService.cs
└── DTOs/
    └── ValidatePlateRequestDto.cs

API/
└── Controllers/
    └── VehicleController.cs
```

---

### 🔸 FRONTEND (FE)

#### 1. Mô tả (Description)
Tại bước 2 [StepVehicleTime.jsx](file:///d:/FER202/SE1924/demo-fe-car-wash/src/components/booking/StepVehicleTime.jsx), ngay khi người dùng vừa nhập hoặc chọn biển số xe, Frontend lập tức gọi API Validate biển số. Nếu không hợp lệ $\rightarrow$ Khóa ngay lập tức, hiển thị thông báo lỗi màu đỏ ngay bên dưới ô nhập biển số.

#### 2. Tasklist
- [ ] Thêm event `onBlur` / `onChange` kèm `debounce` trên ô nhập biển số xe tại `StepVehicleTime.jsx`.
- [ ] Gọi API `vehicleService.validatePlate(licensePlate)`.
- [ ] Nếu `isAvailable == false` $\rightarrow$ Disable nút "Tiếp tục" và hiển thị Inline Error Message đỏ rực bên dưới input.

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
Xây dựng API lấy danh sách Khuyến mãi/Thông báo dành riêng cho người dùng đang đăng nhập dựa trên Hạng thẻ (Guest vs Member Tier: Silver, Gold, Platinum).

#### 2. Tasklist
- [ ] Bổ sung trường `TargetTier` (string: "ALL", "GUEST", "SILVER", "GOLD", "PLATINUM") vào bảng `Promotion`.
- [ ] Viết API `GET /api/promotions/my-notifications` trong `PromotionService.cs`.
- [ ] Nếu là Guest: Trả về danh sách Promotion có `TargetTier == "ALL"` hoặc `"GUEST"`.
- [ ] Nếu là Member: Trả về Promotion phù hợp với `CurrentTier` của Member.

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
Thêm Icon Chuông Thông Báo (Bell Icon) ở Navbar HeaderKhách hàng ([CustomerLayout.jsx](file:///d:/FER202/SE1924/demo-fe-car-wash/src/layouts/CustomerLayout.jsx)). Khi click vào chuông $\rightarrow$ Mở Popover hiển thị danh sách Promotion phù hợp kèm Badge số lượng chưa đọc.

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

## 📌 ISSUE 4: [CUSTOMER] Explicit Member 2% Discount Breakdown in `StepConfirm.jsx`

### 🔸 FRONTEND (FE ONLY)

#### 1. Mô tả (Description)
Tại bước 3 [StepConfirm.jsx](file:///d:/FER202/SE1924/demo-fe-car-wash/src/components/booking/StepConfirm.jsx), bổ sung dòng hiển thị rõ ràng khoản **Giảm giá 2% dành riêng cho tài khoản Member**, giúp khách hàng nhìn thấy rõ số tiền được ưu đãi trước khi bấm Xác nhận đặt lịch.

#### 2. Tasklist
- [ ] Trong `StepConfirm.jsx`, tính toán `memberDiscount = isMember ? Math.floor(baseAmount * 0.02) : 0`.
- [ ] Thêm dòng hiển thị trong phần Chi tiết hoá đơn:
  `Giảm giá Thành viên Member (2%): -X.XXX đ`
- [ ] Cập nhật công thức tổng tiền thanh toán: `finalAmount = baseAmount - memberDiscount - tierDiscount - rewardDiscount - promoDiscount`.

#### 3. File Structure (FE)
```
src/
└── components/
    └── booking/
        └── StepConfirm.jsx
```

---

## 📌 ISSUE 5: [ADMIN] Loyalty Rewards Management (CRUD Redeem Items)

### 🔹 BACKEND (BE)

#### 1. Mô tả (Description)
Xây dựng đầy đủ các API Quản trị (CRUD) cho danh mục Đổi điểm lấy quà/Voucher (`Reward`). Cho phép Admin Thêm mới, Sửa (tên quà, số điểm `pointsRequired`, số lượng tồn `stock`, mô tả, loại giảm giá), Xóa/Bật tắt trạng thái Active của quà.

#### 2. Tasklist
- [ ] Viết các hàm `CreateRewardAsync`, `UpdateRewardAsync`, `DeleteRewardAsync`, `ToggleRewardStatusAsync` trong `AdminRewardService.cs`.
- [ ] Phơi các API CRUD trong `AdminRewardController.cs`.

#### 3. Endpoints
- `GET /api/admin/rewards` — Lấy danh sách quà đổi điểm (Admin).
- `POST /api/admin/rewards` — Tạo quà đổi điểm mới.
- `PUT /api/admin/rewards/{id}` — Cập nhật thông tin quà.
- `DELETE /api/admin/rewards/{id}` — Xóa / Ẩn quà.

#### 4. File Structure (BE)
```
Application/
├── Interfaces/
│   └── IAdminRewardService.cs
├── Services/
│   └── AdminRewardService.cs
└── DTOs/
    ├── CreateRewardRequestDto.cs
    └── UpdateRewardRequestDto.cs

API/
└── Controllers/
    └── Admin/
        └── AdminRewardController.cs
```

---

### 🔸 FRONTEND (FE)

#### 1. Mô tả (Description)
Tạo màn hình Quản lý Quổi Điểm Quà Tặng phía Admin (`AdminRewardManagementPage.jsx`) cho phép Admin xem danh sách, Thêm quà mới qua Modal, Chỉnh sửa thông tin quà và Bật/Tắt trạng thái.

#### 2. Tasklist
- [ ] Tạo file `src/pages/admin/AdminRewardManagementPage.jsx`.
- [ ] Tạo Modal `RewardFormModal.jsx` cho các thao tác Thêm / Sửa quà.
- [ ] Đăng ký Route `/admin/rewards` trong `App.jsx` và thêm Menu vào `AdminLayout.jsx`.

#### 3. File Structure (FE)
```
src/
├── pages/
│   └── admin/
│       └── AdminRewardManagementPage.jsx
├── components/
│   └── admin/
│       └── RewardFormModal.jsx
└── services/
    └── adminRewardService.js
```

---

## 📌 ISSUE 6: [ADMIN] Fix No-Show Validation Rule (15-min Overdue) & Slot Release Logic

### 🔹 BACKEND (BE)

#### 1. Mô tả (Description)
Sửa lại điều kiện cho phép chuyển trạng thái đơn hàng sang `No-Show`:
Nút/API `Set No-Show` chỉ hợp lệ khi đơn đang ở `Pending`, `CheckInTime == null`, VÀ thời gian hiện tại đã trễ quá **15 phút** so with giờ hẹn (`scheduledTime <= UtcNow - 15 minutes`). Khi chuyển sang `No-Show`, giải phóng hoàn toàn Slot thời gian đó để phục vụ cho luồng Booking hộ tại trạm.

#### 2. Tasklist
- [ ] Cập nhật `AdminBookingService.MarkNoShowAsync`: Thêm validation `if (booking.ScheduledTime > UtcNow.AddMinutes(-15)) throw Exception("Chưa đủ 15 phút trễ hẹn để đánh dấu No-Show");`.
- [ ] Cập nhật trạng thái slot thời gian để giải phóng cho việc đặt lịch mới.

#### 3. Endpoints
- `PATCH /api/admin/bookings/{id}/no-show` — Chuyển trạng thái đơn sang No-Show.

#### 4. File Structure (BE)
```
Application/
├── Services/
│   └── AdminBookingService.cs

API/
└── Controllers/
    └── Admin/
        └── AdminBookingController.cs
```

---

### 🔸 FRONTEND (FE)

#### 1. Mô tả (Description)
Tại `BookingDetailDrawer.jsx` phía Admin, nút "Đánh dấu No-Show" chỉ sáng lên khi đơn thỏa mãn điều kiện trễ quá 15 phút so với lịch hẹn.

#### 2. Tasklist
- [ ] Cập nhật biến kiểm tra `canSetNoShow` trong `BookingDetailDrawer.jsx`: `(new Date() - scheduledDate) >= 15 * 60 * 1000`.

#### 3. File Structure (FE)
```
src/
└── components/
    └── admin/
        └── BookingDetailDrawer.jsx
```

---

## 📌 ISSUE 7: [ADMIN] Admin Walk-in Booking (Same-day Slot Selection & Customer Phone Lookup)

### 🔹 BACKEND (BE)

#### 1. Mô tả (Description)
Xây dựng API cho phép Admin Đặt lịch hộ trực tiếp tại trạm (Walk-in Booking):
1. **API Lookup SĐT**: `GET /api/admin/customers/lookup?phone=xxx`. Nếu tìm thấy khách hàng $\rightarrow$ Trả về thông tin Khách, Hạng thẻ (Tier), Số điểm hiện có, Mức giảm giá Tier. Nếu không tìm thấy $\rightarrow$ Trả về `isGuest = true`.
2. **API Admin Create Booking**: `POST /api/admin/bookings/walk-in`. Cho phép Admin đặt lịch trong ngày hiện tại.

#### 2. Tasklist
- [ ] Viết API Lookup Khách hàng theo SĐT trong `AdminCustomerService.cs`.
- [ ] Viết Method `CreateWalkInBookingAsync` trong `AdminBookingService.cs`:
  - Validate Slot thời gian: chỉ cho phép chọn các Slot thuộc **Ngày hiện tại (Same-day)** có thời gian `> UtcNow`.
  - Nếu là Member: Áp dụng giảm giá Tier, cho phép dùng điểm đổi quà, tính điểm thưởng sau khi rửa.
  - Nếu là Guest: Đặt lịch dạng Guest vãng lai.

#### 3. Endpoints
- `GET /api/admin/customers/lookup?phone={phone}` — Lookup thông tin khách theo SĐT.
- `POST /api/admin/bookings/walk-in` — Admin tạo đơn rửa xe trực tiếp tại trạm.

#### 4. File Structure (BE)
```
Application/
├── Interfaces/
│   ├── IAdminCustomerService.cs
│   └── IAdminBookingService.cs
├── Services/
│   ├── AdminCustomerService.cs
│   └── AdminBookingService.cs
└── DTOs/
    ├── CustomerLookupResponseDto.cs
    └── AdminWalkInBookingRequestDto.cs

API/
└── Controllers/
    └── Admin/
        ├── AdminCustomersController.cs
        └── AdminBookingController.cs
```

---

### 🔸 FRONTEND (FE)

#### 1. Mô tả (Description)
Tạo Modal / Màn hình Booking Hộ phía Admin (`AdminWalkInBookingModal.jsx`):
1. Nhập SĐT $\rightarrow$ Tự động Lookup thông tin Khách hàng.
2. Chọn Slot thời gian còn trống trong ngày (các Slot thời gian đã trôi qua tự động bị disabled/xám màu).
3. Hiển thị mức ưu đãi Tier / Tích điểm nếu là Member.
4. Bấm "Xác nhận đặt lịch tại chỗ".

#### 2. Tasklist
- [ ] Tạo Component `AdminWalkInBookingModal.jsx`.
- [ ] Thêm nút "Đặt lịch trực tiếp tại trạm" ở trang `BookingManagementPage.jsx` Admin.
- [ ] Viết logic Lookup SĐT và lọc danh sách Slot thời gian theo ngày hiện tại.

#### 3. File Structure (FE)
```
src/
├── components/
│   └── admin/
│       └── AdminWalkInBookingModal.jsx
├── pages/
│   └── admin/
│       └── BookingManagementPage.jsx
└── services/
    └── adminBookingService.js
```

---

*Tài liệu đã được khởi tạo và lưu trữ tại file [doc/ISSUES_SPECIFICATION.md](file:///d:/FER202/SE1924/demo-fe-car-wash/doc/ISSUES_SPECIFICATION.md).*
