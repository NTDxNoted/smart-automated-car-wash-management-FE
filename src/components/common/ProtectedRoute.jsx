import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; // Đảm bảo đường dẫn lùi thư mục chính xác tới file AuthContext

export default function ProtectedRoute({ children, requireAdmin = false }) {
  const { auth } = useAuth();

  if (requireAdmin) {
    const token = localStorage.getItem("admin_token");
    const role = auth.role?.toUpperCase();

    if (!token || role !== "ADMIN") {
      return <Navigate to="/" replace />;
    }

    return children;
  }

  const token = localStorage.getItem("member_token");
  const role = auth.role?.toUpperCase();

  if (!token || role !== "MEMBER") {
    return <Navigate to="/login" replace />;
  }

  return children;
}