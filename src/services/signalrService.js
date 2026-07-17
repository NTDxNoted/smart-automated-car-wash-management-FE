import * as signalR from "@microsoft/signalr";

class SignalRService {
  constructor() {
    this.connection = null;
    this.listeners = new Set();
  }

  startConnection() {
    const adminToken = localStorage.getItem("admin_token");
    if (!adminToken) {
      console.warn("SignalR: Không tìm thấy token admin. Không kết nối.");
      return;
    }

    if (this.connection) {
      // Tránh kết nối đè lên nếu đã có hoặc đang thiết lập kết nối
      if (this.connection.state === signalR.HubConnectionState.Connected ||
          this.connection.state === signalR.HubConnectionState.Connecting) {
        console.log("SignalR: Kết nối đang chạy hoặc đang được thiết lập.");
        return;
      }
    }

    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:59153/api';
    const hubUrl = baseUrl.endsWith('/api') 
      ? baseUrl.substring(0, baseUrl.length - 4) + '/hubs/admin-notifications'
      : baseUrl + '/hubs/admin-notifications';

    console.log("SignalR: Khởi tạo kết nối tới URL:", hubUrl);

    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(hubUrl, {
        accessTokenFactory: () => adminToken,
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets
      })
      .withAutomaticReconnect()
      .build();

    // Lắng nghe sự kiện từ backend và chuyển tiếp tới listeners
    this.connection.on("NewBooking", (data) => {
      console.log("SignalR: Nhận sự kiện NewBooking", data);
      this.broadcast("NewBooking", data);
    });

    this.connection.on("BookingStatusChanged", (data) => {
      console.log("SignalR: Nhận sự kiện BookingStatusChanged", data);
      this.broadcast("BookingStatusChanged", data);
    });

    this.connection.on("NewCustomer", (data) => {
      console.log("SignalR: Nhận sự kiện NewCustomer", data);
      this.broadcast("NewCustomer", data);
    });

    this.connection.start()
      .then(() => console.log("SignalR: Kết nối Hub thành công!"))
      .catch((err) => console.error("SignalR: Kết nối Hub thất bại:", err));
  }

  registerListener(listener) {
    this.listeners.add(listener);
    // Trả về hàm cleanup hủy đăng ký listener
    return () => this.listeners.delete(listener);
  }

  broadcast(event, data) {
    this.listeners.forEach((listener) => {
      try {
        listener(event, data);
      } catch (err) {
        console.error("SignalR: Lỗi khi xử lý sự kiện trong listener:", err);
      }
    });
  }

  stopConnection() {
    if (this.connection) {
      if (this.connection.state !== signalR.HubConnectionState.Disconnected) {
        this.connection.stop().then(() => {
          this.connection = null;
          console.log("SignalR: Đã ngắt kết nối.");
        });
      } else {
        this.connection = null;
      }
    }
  }
}

export const signalRService = new SignalRService();
