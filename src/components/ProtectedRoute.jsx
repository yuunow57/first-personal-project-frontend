import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  
  // 토큰이 없으면 로그인 페이지로 보냄
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // 토큰이 있으면 원래 페이지 렌더링
  return children;
}
