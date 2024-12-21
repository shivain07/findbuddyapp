"use client";

import Home from "@/components/root/home/Home";
import { API_PATH } from "@/constants/apiConstant";
import { useUserStore } from "@/GlobalStore/userStore";
import { useApiCall } from "@/helpers/axiosWrapper";
import sendEmail from "@/helpers/sendEmail";
import { useToast } from "@/hooks/use-toast";
import { IUserState } from "@/interfaces/user";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

function Homepage() {
  const router = useRouter();
  const {setUser} = useUserStore();
  const { apiCall } = useApiCall(); // Accessing the apiCall function
  const { toast } = useToast();

  useEffect(() => {
    getUserData();
  }, []);

  const getUserData = async () => {
    try {
      const response = await apiCall({
        url: API_PATH.tokenChange,
        method: "GET",
      });
      if (response?.user) {
        localStorage.setItem("userId",response?.user?._id||"")
        setUser(response?.user);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="h-full flex flex-col bg-slate-100">
      {/* <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white shadow-lg rounded-lg p-6 max-w-sm w-full">
          <h2 className="text-xl font-semibold mb-4 text-center">
            Profile Page
          </h2>
          <h3 className="text-lg text-gray-700 text-center mb-4">
            {user?.username || "Guest"}
          </h3>
          <div className="flex justify-center space-x-4">
            {!user?.isVerified && (
              <button
                className="bg-green-500 text-white p-2 rounded-md hover:bg-green-600 transition"
                onClick={verifyUser}
              >
                Verify
              </button>
            )}
            <button
              onClick={logout}
              className="bg-red-500 text-white p-2 rounded-md hover:bg-red-600 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </div> */}
      <Home />
    </div>
  );
}

export default Homepage;
