import { Navigate, Outlet } from "react-router-dom";

const ProtectedLayout = () => {
    const token = localStorage.getItem("token");
    console.log(token);

    if (!token) {
        return <Navigate to="/signin" />
    }

    return (
        <Outlet />
    )
}

export default ProtectedLayout