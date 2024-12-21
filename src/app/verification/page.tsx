"use client";

import { API_PATH } from "@/constants/apiConstant";
import { useApiCall } from "@/helpers/axiosWrapper";
import { useEffect, useState } from "react";

function UserVerificationPage({ params }: any) {
  const [isVerifiedSuccess, setIsVerifiedSuccess] = useState(false);
  const { apiCall } = useApiCall();
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
  return <div className="flex items-center justify-center h-screen">
    <div
      className={`flex items-center justify-center px-6 py-4 text-lg font-medium rounded-md shadow-lg transition-all duration-500 ${isVerifiedSuccess
          ? 'bg-green-100 text-green-800 animate-pulse'
          : 'bg-red-100 text-red-800 animate-shake'
        }`}
    >
      {isVerifiedSuccess ? '✅ Congrats, you are verified.' : '❌ You are not yet verified.'}
    </div>
  </div>;
}

export default UserVerificationPage;
