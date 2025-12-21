import Signin from "@/auth/signin/Signin";
import Signup from "@/auth/signup/Signup";
import AuthLayout from "@/layout/AuthLayout";
import ProtectedLayout from "@/layout/ProtectedLayout";
import Chat from "@/pages/chat/Chat";
import { useRoutes } from "react-router-dom";

const Routes = () => {
  const routes = useRoutes([
    {
      element: <AuthLayout />,
      children: [
        {
          path: "/",
          element: <Signin />,
        },
        {
          path: "/signin",
          element: <Signin />,
        },
        {
          path: "/signup",
          element: <Signup />,
        },
      ]
    },
    {
      element: <ProtectedLayout />,
      children: [
        {
          path: "/chat",
          element: <Chat />,
        },
      ]
    },
  ]);

  return routes;
};

export default Routes;
