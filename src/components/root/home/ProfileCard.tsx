"use client";
import { useUserStore } from "@/GlobalStore/userStore";
import UserInfoDisplay from "../profile/UserInfoDisplay";
import EditUserInfo from "../profile/EditUserInfo";
import VerifyUser from "../profile/VerifyUser";
import { Suspense } from "react";

const ProfileCard = () => {
  const { user } = useUserStore();

  return (
    <>
      <div className="p-4 border rounded-lg shadow-md bg-white dark:bg-gray-800 dark:border-gray-700 m-2">
        <Suspense
          fallback={
            <>
              <div className="space-y-2 animate-pulse">
                <div className="w-32 h-4 bg-gray-300 rounded" />
                <div className="w-48 h-3 bg-gray-300 rounded" />
              </div>
            </>
          }
        >
          <UserInfoDisplay
            username={user?.username}
            email={user?.email}
            profileImgUrl={user?.profileImgUrl}
            isVerified={user?.isVerified}
          />
        </Suspense>
        <div className="flex justify-center">
          <EditUserInfo
            username={user?.username || ""}
            userId={user?._id || ""}
          />
        </div>
        {user && <VerifyUser user={user} />}
      </div>
    </>
  );
};

export default ProfileCard;
