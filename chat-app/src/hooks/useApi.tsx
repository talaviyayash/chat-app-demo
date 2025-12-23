"use client";

import type { AxiosRequestConfig, AxiosResponse } from "axios";
import axios from "axios";

import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export const apiCall = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

type AxiosHeaders = AxiosRequestConfig["headers"];

interface ApiProps {
  method?: "POST" | "PATCH" | "GET" | "PUT" | "DELETE";
  header?: AxiosHeaders;
  endPoint?: string;
  data?: unknown;
  showToastMessage?: boolean;
  params?: {
    [key: string]: string | undefined | number | unknown;
  };
}

type ApiSuccess<T = undefined> =
  | { success: false; message: string }
  | { success: true; message?: string; data?: T };

const useApi = () => {
  const navigate = useNavigate();

  const api = async <T = unknown,>({
    header = {},
    endPoint,
    method,
    data,
    showToastMessage = false,
    params,
  }: ApiProps): Promise<ApiSuccess<T>> => {
    try {
      const accessToken = localStorage.getItem("token");

      const headers: AxiosHeaders = {
        "Content-Type": "application/json",
        ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
        ...header,
      };

      const response: AxiosResponse<T> = await apiCall({
        method,
        url: endPoint,
        data,
        headers,
        params,
      });

      const responseData = response?.data as ApiSuccess<T>;
      if (showToastMessage) {
        toast.success(responseData.message || "");
      }

      return { ...responseData, success: true };
    } catch (e: unknown) {
      console.log("🚀 ~ api ~ e:", e);
      if (axios.isAxiosError(e)) {
        if (showToastMessage) toast.error(e.response?.data.errors);
        if (e.status === 401) {
          localStorage.clear();
          navigate("/");
        }
        return e.response?.data;
      } else {
        console.error("Unexpected Error:", e);
        return { message: "An unexpected error occurred", success: false };
      }
    }
  };

  return { api };
};

export default useApi;
