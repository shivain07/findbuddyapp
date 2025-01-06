// utils/useApiCall.ts
import { useLoaderStore } from "@/GlobalStore/apiLoaderStore";
import axios, { AxiosRequestConfig } from "axios";
import { toast } from "@/hooks/use-toast";
import { useUserStore, userLoginPopupStore, userVerificationPopupStore } from "@/GlobalStore/userStore";
import { API_PATH, ROUTES_WITH_LOGIN, ROUTES_WITH_VERIFICATION } from "@/constants/apiConstant";
import { getDateAndTime } from "@/lib/utils";
import { sessionExpiredLoginAlert } from "./alertServices";
import { useRouter } from "next/navigation";

// Create Axios instance
const axiosInstance = axios.create({
  baseURL: "/api/", // Update this based on your API
  timeout: 10000, // Timeout after 10 seconds
  headers: {
    "Content-Type": "application/json"
  },
});

const ERROR_TYPES = {
  verifcationToken: "VFTOKEN"
}

export const useApiCall = () => {
  const { setIsLoading } = useLoaderStore();
  const { user, isLoggedin } = useUserStore();
  const { setShowLoginPopup } = userLoginPopupStore();
  const { setShowUserVerificationModal } = userVerificationPopupStore();
  const router = useRouter();

  // adding access token
  axiosInstance.interceptors.request.use(request => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      request.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    return request;
  }, error => {
    return Promise.reject(error);
  });

  // refreshing access token logic
  axiosInstance.interceptors.response.use(
    response => response, // Directly return successful responses.
    async error => {
      const originalRequest = error.config;
      if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true; // Mark the request as retried to avoid infinite loops.
        try {
          const refreshToken = localStorage.getItem('refreshToken') || ""; // Retrieve the stored refresh token.
          // Make a request to your auth server to refresh the token.
          const response = await axiosInstance.post(API_PATH.token.verifyRFToken, {
            refreshToken
          });

          const { accessToken } = response.data;

          // Store the new access and refresh tokens.
          localStorage.setItem('accessToken', accessToken);
          // Update the authorization header with the new access token.
          axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

          // **Explicitly update the originalRequest headers.**
          originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
          return axiosInstance(originalRequest); // Retry the original request with the new access token.
        } catch (refreshError) {
          // Handle refresh token errors by clearing stored tokens and redirecting to the login page.
          console.error('Token refresh failed:', refreshError);
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      }
      return Promise.reject(error); // For all other errors, return the error as is.
    }
  );

  const apiCall = async (config: AxiosRequestConfig): Promise<any> => {
    try {

      let urlPath = config.url || "";
      if (!isLoggedin && ROUTES_WITH_LOGIN.includes(urlPath)) {
        setShowLoginPopup(true);
        return;
      }
      if (!user?.isVerified && ROUTES_WITH_VERIFICATION.includes(urlPath)) {
        setShowUserVerificationModal(true);
        return;
      }
      setIsLoading(true);
      const response = await axiosInstance(config);
      setIsLoading(false);
      return response.data; // Directly return data from response
    } catch (error: any) {
      setIsLoading(false);
      console.log(error);
      const statusCode = error.response?.status;
      const errorType = error.response?.data?.errorType || ""
      const errorMessage =
        error.response?.data?.error ||
        error.response.error ||
        error.response?.data?.message ||
        error.message ||
        "An unexpected error occurred";

      // Show a toast for 400 and 500 status codes
      if (statusCode === 400 || statusCode === 500) {
        if (errorType === ERROR_TYPES.verifcationToken) {
          toast({
            title: `Verification mail already sent`,
            description: `${errorMessage} .Try after ${getDateAndTime(error.response?.data?.expiryTime)}`,
            variant: "default"
          });
        } else if (statusCode === 400) {
          sessionExpiredLoginAlert(router)
        } else {
          toast({
            title: `Error ${statusCode}`,
            description: errorMessage,
            variant: "destructive", // Use 'destructive' for error styling
          });
        }
      } else if (statusCode === 403) {
        toast({
          title: `Error ${statusCode}`,
          description: errorMessage,
          variant: "destructive", // Use 'destructive' for error styling
        });
      } else {
        toast({
          title: "Something went wrong.",
          description: "We are looking into it. Please try again.",
          variant: "destructive", // Use 'destructive' for error styling
        });
      }

      throw new Error(errorMessage); // Throw error with the custom message
    }
  };

  return { apiCall };
};
