# 🚀 AutoWash Pro — Hướng dẫn Chạy Dự án ở Môi trường Local (Local Setup Guide)

Tài liệu này hướng dẫn chi tiết các bước thiết lập, cấu hình và khởi chạy toàn bộ hệ thống **AutoWash Pro** (bao gồm Backend ASP.NET Core .NET 8 và Frontend React Vite) trên máy tính cá nhân để chuẩn bị cho buổi báo cáo / demo môn SWP391.

---

## 📋 1. Yêu cầu Môi trường (Prerequisites)

Trước khi khởi chạy, máy tính của bạn cần được cài đặt sẵn:

| Công cụ / SDK | Phiên bản khuyến nghị | Link tải |
| :--- | :--- | :--- |
| **.NET SDK** | .NET 8.0 SDK trở lên | [Download .NET 8](https://dotnet.microsoft.com/download/dotnet/8.0) |
| **Node.js & npm** | Node.js v18.x hoặc v20.x | [Download Node.js](https://nodejs.org/) |
| **Git** | Phiên bản mới nhất | [Download Git](https://git-scm.com/) |
| **IDE / Code Editor** | Visual Studio 2022 / VS Code / Rider | [VS Code](https://code.visualstudio.com/) |

---

## ⚙️ 2. Hướng dẫn Khởi chạy BACKEND (.NET 8 Web API)

Thư mục dự án: `smart-automated-car-wash-management-BE`

### Bước 2.1: Truy cập thư mục Backend
Mở Terminal / PowerShell và chuyển đến thư mục Backend:
```bash
cd d:\FER202\SE1924\smart-automated-car-wash-management-BE
```

### Bước 2.2: Cấu hình File `appsettings.Development.json`
Tạo hoặc kiểm tra file `src/AutoWashPro.API/appsettings.Development.json` có nội dung kết nối tới Database PostgreSQL (Supabase):

```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "ConnectionStrings": {
    "DefaultConnection": "Host=aws-0-ap-southeast-1.pooler.supabase.com;Port=6543;Database=postgres;Username=postgres.your_user;Password=your_password;Pooling=true;"
  },
  "JwtSettings": {
    "Secret": "AutoWashPro_Super_Secret_JWT_Key_SWP391_2026_SU26SWP01_Group3_Key",
    "Issuer": "AutoWashProAPI",
    "Audience": "AutoWashProClients",
    "ExpiryMinutes": 480
  }
}
```

### Bước 2.3: Khôi phục Dependencies & Khởi chạy Backend
Chạy các lệnh sau trong Terminal:
```bash
# 1. Khôi phục các thư viện NuGet
dotnet restore

# 2. Biên dịch dự án Backend
dotnet build

# 3. Khởi chạy Server Backend Web API
dotnet run --project src/AutoWashPro.API
```

* **Địa chỉ Backend API**: `http://localhost:59153` (hoặc cổng cấu hình trong `launchSettings.json`).
* **Trang tài liệu Swagger UI**: Khai thác & test trực tiếp các API tại:
  👉 **`http://localhost:59153/swagger`**

### Bước 2.4: Kiểm tra Unit Tests (Tùy chọn)
Chạy bộ kiểm thử tự động 179/179 Test Cases:
```bash
dotnet test
```

---

## 💻 3. Hướng dẫn Khởi chạy FRONTEND (React + Vite)

Thư mục dự án: `demo-fe-car-wash`

### Bước 3.1: Truy cập thư mục Frontend
Mở một cửa sổ Terminal / PowerShell mới và chuyển đến thư mục Frontend:
```bash
cd d:\FER202\SE1924\demo-fe-car-wash
```

### Bước 3.2: Cấu hình File `.env`
Tạo file `.env` tại thư mục gốc của Frontend `demo-fe-car-wash/.env`:

```env
# Cấu hình đường dẫn kết nối API tới Backend Local
VITE_API_BASE_URL=http://localhost:59153/api
```

### Bước 3.3: Cài đặt Node Modules & Khởi chạy Dev Server
Chạy các lệnh sau:
```bash
# 1. Cài đặt các gói node_modules
npm install

# 2. Khởi chạy Web App ở chế độ Development
npm run dev
```

* **Địa chỉ Ứng dụng Web**: Mở trình duyệt và truy cập:
  👉 **`http://localhost:5173`**

### Bước 3.4: Kiểm tra Build Production (Tùy chọn)
Kiểm tra khả năng đóng gói ứng dụng:
```bash
npm run build
```

---

## 🔑 4. Tài khoản Đăng nhập Mẫu để Demo (Test Credentials)

Dưới đây là danh sách tài khoản đã chuẩn bị sẵn data trên hệ thống để thực hiện kịch bản Demo:

### 👤 Tài khoản Khách hàng (Customer / Member):
* **Số điện thoại**: `0901234567`
* **Mật khẩu**: `123456`
* **Quyền hạn**: Đặt lịch rửa xe, xem bảng giá, xem lịch sử đặt lịch, đổi điểm thưởng Loyalty, cập nhật thông tin xe.

### 🛡️ Tài khoản Quản trị viên (Admin / Manager):
* **Trang đăng nhập Admin**: `http://localhost:5173/admin/login`
* **Số điện thoại**: `0903557940`
* **Mật khẩu**: `admin123`
* **Quyền hạn**: Quản lý đơn đặt lịch, Check-in xe vào trạm, xác nhận thanh toán, quản lý dịch vụ, cấu hình hạng thành viên, xem Dashboard báo cáo doanh thu & RFM.

---

## 🔄 5. Quy trình Kiểm thử Nhanh Luồng Chính (Happy Path Demo)

1. **Khách hàng**: Truy cập `http://localhost:5173` $\rightarrow$ Đăng nhập tài khoản Member (`0901234567`) $\rightarrow$ Chọn Dịch vụ Rửa xe $\rightarrow$ Chọn xe & chọn khung giờ trống $\rightarrow$ Bấm **Xác nhận đặt lịch** (Trạng thái đơn: `Pending`).
2. **Admin**: Mở tab mới `http://localhost:5173/admin/login` $\rightarrow$ Đăng nhập tài khoản Admin (`0903557940`) $\rightarrow$ Thấy thông báo SignalR nảy đơn mới ở Dashboard.
3. **Check-in & Hoàn thành**: Admin bấm **Check-in xe vào trạm** $\rightarrow$ Bấm **Xác nhận thanh toán & Hoàn thành**.
4. **Kiểm tra Tích điểm**: Khách hàng mở trang Lịch sử / Loyalty sẽ thấy tiền chi tiêu `TotalSpending` được cộng dồn và điểm thưởng `PointsEarned` được tự động cộng vào tài khoản!

---

*Tài liệu được khởi tạo tự động bởi Antigravity AI Assistant cho nhóm SU26SWP01 — AutoWash Pro.*
