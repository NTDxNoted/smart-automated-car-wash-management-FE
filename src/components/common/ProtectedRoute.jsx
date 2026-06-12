import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; // Đảm bảo đường dẫn lùi thư mục chính xác tới file AuthContext

export default function ProtectedRoute({ children, requireAdmin = false }) {
  // Trích xuất chuẩn xác các biến trạng thái từ bộ nhớ loadFromStorage của nhóm
  const { auth } = useAuth();

  if (requireAdmin) {
    const token =
      localStorage.getItem("admin_token");

    if (
      !token ||
      auth.role !== "Admin"
    ) {
      return <Navigate to="/login" replace />;
    }

    return children;
  }

  const token =
    localStorage.getItem("member_token");

  if (
    !token || auth.role !== "Member"
  ) 
  {
    return <Navigate to="/login" replace />;
  }

  // Mọi điều kiện hợp lệ -> Cho phép truy cập vào trang con (History / Profile)
  return children;
}