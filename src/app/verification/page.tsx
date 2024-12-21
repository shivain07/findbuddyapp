"use client";

import { Button } from "@/components/ui/button";
import { API_PATH } from "@/constants/apiConstant";
import { useUserStore } from "@/GlobalStore/userStore";
import { useApiCall } from "@/helpers/axiosWrapper";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

function UserVerificationPage({ params }: any) {
  const [isVerifiedSuccess, setIsVerifiedSuccess] = useState(false);
  const {user} =useUserStore();
  const { apiCall } = useApiCall();
  const router = useRouter();

  useEffect(() => {
    let verificationToken = window.location.search.slice(1);
    if (verificationToken.length > 0) {
      userVerification(verificationToken);
    }
  }, []);

  const userVerification = async (token: string) => {

    const verification = await apiCall({
      url: API_PATH.user.verify,
      method: "POST",
      data: { token: token }
    });

    if (verification.success) {
      setIsVerifiedSuccess(true);
    } else {
      setIsVerifiedSuccess(false);
    }
  };

  return <div className="flex items-center flex-col gap-y-4 justify-center h-screen">
    <div
      className={`flex items-center justify-center px-6 py-4 text-lg font-medium rounded-md shadow-lg transition-all duration-500 ${isVerifiedSuccess
        ? 'bg-green-100 text-green-800 animate-pulse'
        : 'bg-red-100 text-red-800 animate-shake'
        }`}
    >
      {(isVerifiedSuccess||user?.isVerified) ? '✅ Congrats, you are verified.' : '❌ You are not yet verified.'}
    </div>
    
    <div className="w-[250px]">
      <Button
        className="w-full px-4 py-2 font-semibold text-white bg-purple-400 hover:bg-purple-500  rounded cursor-pointer"
        onClick={() => router.push("/home")}>
        Go to home</Button>
    </div>
  </div>;
}

export default UserVerificationPage;
