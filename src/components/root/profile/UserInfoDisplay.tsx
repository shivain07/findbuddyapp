import Image from "next/image";
import { CheckCircledIcon } from "@radix-ui/react-icons";
import userNoDp from "@/assets/images/userimg.png";

interface UserInfoDisplayProps {
  username?: string;
  email?: string;
  profileImgUrl?: string;
  isVerified?: boolean;
}

export default function UserInfoDisplay({
  username,
  email,
  profileImgUrl,
  isVerified,
}: UserInfoDisplayProps) {
  return (
    <div className="flex items-center space-x-4">
      <div className="h-16 w-16 rounded-full overflow-hidden bg-gray-300 dark:bg-gray-600">
        <Image
          src={profileImgUrl || userNoDp}
          alt="User image"
          width={100}
          height={100}
        />
      </div>
      <div>
        <div className="flex items-center">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {username ? (
              username
            ) : (
              <>
                <div className="space-y-2 animate-pulse">
                  <div className="w-32 h-4 bg-gray-300 rounded" />
                </div>
              </>
            )}
          </h3>
          <CheckCircledIcon
            className={`ml-2 h-5 w-5 ${
              isVerified ? "text-green-500" : "text-gray-300"
            }`}
            aria-label="Verified"
          />
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400">{email}</p>
      </div>
    </div>
  );
}
