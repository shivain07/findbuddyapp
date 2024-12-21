// utils/useApiCall.ts
import { useLoaderStore } from "@/GlobalStore/apiLoaderStore";
import axios, { AxiosRequestConfig } from "axios";
import { toast } from "@/hooks/use-toast";
import { useUserStore, userLoginPopupStore, userVerificationPopupStore } from "@/GlobalStore/userStore";
import { ROUTES_WITH_LOGIN, ROUTES_WITH_VERIFICATION } from "@/constants/apiConstant";
import { getDateAndTime } from "@/lib/utils";

// Create Axios instance
const axiosInstance = axios.create({
  baseURL: "/api/", // Update this based on your API
  timeout: 10000, // Timeout after 10 seconds
  headers: {
    "Content-Type": "application/json",
  },
});

const ERROR_TYPES = {
  verifcationToken: "VFTOKEN"
}
export const useApiCall = () => {
  const { setIsLoading } = useLoaderStore();
  const { user, isLoggedin } = useUserStore();
  const {setShowLoginPopup } = userLoginPopupStore();
  const { setShowUserVerificationModal } = userVerificationPopupStore();

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
        } else {

          toast({
            title: `Error ${statusCode}`,
            description: errorMessage,
            variant: "destructive", // Use 'destructive' for error styling
          });
        }
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