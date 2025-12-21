import { Navigate, Outlet } from "react-router-dom";

const AuthLayout = () => {
    const token = localStorage.getItem("token");

    if (token) {
        return <Navigate to="/chat" />
    }

    return (
        <Outlet />
    )
}

export default AuthLayout