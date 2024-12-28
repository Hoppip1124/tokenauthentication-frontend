import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginForm from './Components/LoginForm';
import AdminDashBoard from './Components/AdminDashBoard';
import UserDashBoard from './Components/UserDashBoard.js';
import { AuthProvider } from './AuthContext.js';
import PrivateRoute from './PrivateRoute.js';

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginForm />}/>
          <Route element={<PrivateRoute />}>
            <Route path="/admin/dashboard" element={<AdminDashBoard />}/>
            <Route path="/user/dashboard" element={<UserDashBoard />}/>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
export default App;