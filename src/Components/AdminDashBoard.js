import React from "react";
import { useAuth } from "../useAuth";
import { useNavigate } from "react-router-dom";

const AdminDashBoard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('ログアウトエラー：', error);
      // エラーハンドリング
    }
  };
  console.log("AdminDashBoard: user =", user);
  return (
      <div>
        <h1>管理者用ダッシュボード</h1>
        { user ? (<p>ようこそ、{ user.name }さん！</p>) : (<p>ユーザー情報を取得中...</p>) }
        <button onClick={handleLogout}>ログアウト</button>
      </div>
  );
};

export default AdminDashBoard;