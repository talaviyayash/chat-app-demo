import { FullScreenLoader } from "@/components/FullScreenLoader";
import useApi from "@/hooks/useApi";
import { addProfile } from "@/store/slice/appSlice";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Navigate, Outlet, useNavigate } from "react-router-dom";

const ProtectedLayout = () => {
    const token = localStorage.getItem("token");
    console.log(token);
    const [isLoading, setIsLoading] = useState(true);
    const dispatch = useDispatch();
    const { api } = useApi();
    const navigate = useNavigate();

    useEffect(() => {
        if (token) {
            const getUserProfile = async () => {
                const response = await api({
                    method: "GET",
                    endPoint: "/auth/me",
                    showToastMessage: false,
                });
                if (response.success) {
                    dispatch(addProfile(response.data));
                    setIsLoading(false);
                } else {
                    localStorage.removeItem("token");
                    navigate("/signin");
                }
            }
            getUserProfile();
        }
    }, [token]);

    if (!token) {
        return <Navigate to="/signin" />
    }

    if (isLoading) {
        return <FullScreenLoader />
    }



    return (
        <Outlet />
    )
}

export default ProtectedLayout