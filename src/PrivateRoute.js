import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from './useAuth';

const PrivateRoute = () => {
    const { isAuthenticated, loading } = useAuth();
    const location = useLocation();

    console.log("PrivateRoute: loading =", loading); // ★追加
    console.log("PrivateRoute: isAuthenticated =", isAuthenticated); // ★追加
    console.log("PrivateRoute: location =", location); // ★追加

    if (loading) {
        console.log("PrivateRoute: Loading..."); // ★追加
        return <div>loading...</div>;
    }

    if (!isAuthenticated) {
        console.log("PrivateRoute: Not authenticated. Redirecting to /"); // ★追加
        return <Navigate to="/" state={{ fromm: location }} replace />;
    }

    console.log("PrivateRoute: Authenticated. Rendering Outlet."); // ★追加
    return <Outlet />
};

export default PrivateRoute;