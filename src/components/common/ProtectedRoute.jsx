import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; // Đảm bảo đường dẫn lùi thư mục chính xác tới file AuthContext

export default function ProtectedRoute({ children, requireAdmin = false }) {
  // Trích xuất chuẩn xác các biến trạng thái từ bộ nhớ loadFromStorage của nhóm
  const { auth, isAdmin, isGuest } = useAuth();

  // Khách vãng lai chưa đăng nhập hoặc không có mã Token -> Chuyển hướng về trang login
  if (isGuest || !auth.token) {
    return <Navigate to="/login" replace />;
  }

  // Nếu route yêu cầu quyền quản trị viên mà tài khoản hiện tại không phải ADMIN
  if (requireAdmin && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  // Mọi điều kiện hợp lệ -> Cho phép truy cập vào trang con (History / Profile)
  return children;
}