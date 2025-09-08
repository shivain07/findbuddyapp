import { useApiCall } from "@/helpers/axiosWrapper";
import { toast } from "@/hooks/use-toast";
import { Avatar } from "@radix-ui/react-avatar";
import { CheckCircledIcon } from "@radix-ui/react-icons";
import userNoDp from "@/assets/images/userimg.png";
import Image from "next/image";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { API_PATH } from "@/constants/apiConstant";
import { IUserState } from "@/interfaces/user";

function VerifyUser({
    user
}:{
    user:IUserState
}) {
  const { apiCall } = useApiCall();

  const verifyUser = async () => {
    toast({
      title: "Verification email sent",
      description: "Please check your email for verification",
    });

    await apiCall({
      url: API_PATH.user.sendmail,
      method: "POST",
      data: { userId: user?._id },
    });
  };
  return (
    <>
      <div className="flex justify-center">
        {!user?.isVerified && (
          <button
            className="bg-green-500 w-full my-2 text-white p-2 text-sm rounded-md hover:bg-green-600 transition"
            onClick={verifyUser}
          >
            Verify
          </button>
        )}
      </div>

      <Sheet>
        <SheetContent>
          <SheetHeader>
            <SheetTitle></SheetTitle>
            <SheetDescription>
              <div>
                <div className="flex items-center space-x-4">
                  <div className="h-16 w-16 flex-shrink-0 rounded-full overflow-hidden bg-gray-300 dark:bg-gray-600">
                    <Avatar>
                      <Image
                        src={
                          user?.profileImgUrl ? user.profileImgUrl : userNoDp
                        }
                        alt="User image"
                        width={100}
                        height={100}
                      />
                    </Avatar>
                  </div>
                  <div>
                    <div className="flex items-center">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {user?.username}
                      </h3>
                      {user?.isVerified ? (
                        <CheckCircledIcon
                          className="ml-2 h-5 w-5 text-green-500"
                          aria-label="Verified"
                        />
                      ) : (
                        <CheckCircledIcon
                          className="ml-2 h-5 w-5 text-gray-300"
                          aria-label="Verified"
                        />
                      )}
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {user?.email}
                    </p>
                  </div>
                </div>
                {/* <div className="flex justify-center">
                  <EditUserInfo
                    username={user?.username || ""}
                    userId={user?._id || ""}
                  />
                </div> */}
                <div className="flex justify-center">
                  {!user?.isVerified && (
                    <button
                      className="bg-green-500 w-full my-2 text-white p-2 text-sm rounded-md hover:bg-green-600 transition"
                      onClick={verifyUser}
                    >
                      Verify
                    </button>
                  )}
                </div>
              </div>
            </SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </>
  );
}

export default VerifyUser;
