import { Button } from "@/components/ui/button";
import { API_PATH } from "@/constants/apiConstant";
import { useUserStore } from "@/GlobalStore/userStore";
import { useApiCall } from "@/helpers/axiosWrapper";
import { toast } from "@/hooks/use-toast";
import { Avatar } from "@radix-ui/react-avatar";
import { CheckCircledIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";
import userNoDp from "@/assets/images/userimg.png";
import Image from "next/image";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { SubmitHandler, useForm } from "react-hook-form";
import { useEffect, useState } from "react";

const ProfileCard = () => {
  const router = useRouter();
  const { user } = useUserStore();
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
      <div className="lg:block hidden max-w-sm p-4 border rounded-lg shadow-md bg-white dark:bg-gray-800 dark:border-gray-700 m-2">
        <div className="flex items-center space-x-4">
          <div className="h-16 w-16 flex-shrink-0 rounded-full overflow-hidden bg-gray-300 dark:bg-gray-600">
            <Avatar>
              <Image
                src={user?.profileImgUrl ? user.profileImgUrl : userNoDp}
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
        <div className="flex justify-center">
          <EditUserInfo
            username={user?.username || ""}
            userId={user?._id || ""}
          />
        </div>
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
      <Sheet>
        <SheetTrigger className="lg:hidden p-2 w-full flex justify-end">
          <div className="h-16 w-16 flex-shrink-0 rounded-full overflow-hidden bg-gray-300 border-purple-300 hover:border-purple-600 border-2  dark:bg-gray-600">
            <Avatar>
              <Image
                src={user?.profileImgUrl ? user.profileImgUrl : userNoDp}
                alt="User image"
                width={100}
                height={100}
              />
            </Avatar>
          </div>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle></SheetTitle>
            <SheetDescription>
              <div>
                <div className="flex items-center space-x-4">
                  <div className="h-16 w-16 flex-shrink-0 rounded-full overflow-hidden bg-gray-300 dark:bg-gray-600">
                    <Avatar>
                      <Image
                        src={user?.profileImgUrl ? user.profileImgUrl : userNoDp}
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
                <div className="flex justify-center">
                  <EditUserInfo
                    username={user?.username || ""}
                    userId={user?._id || ""}
                  />
                </div>
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
};

export default ProfileCard;

const EditUserInfo = ({
  username,
  userId,
}: {
  username: string;
  userId: string;
}) => {
  interface IUserEdit {
    username: string;
    profileImgUrl?: string;
  }

  const { user, updateUser } = useUserStore();
  const [showModal, setShowModal] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<IUserEdit>();

  const { apiCall } = useApiCall();

  useEffect(() => {
    setValue("username", username);
  }, [username]);

  const onSubmit: SubmitHandler<IUserEdit> = async (data) => {
    let postData = {
      username: data.username,
      profileImgUrl: data.profileImgUrl,
      userId: userId,
    };

    await apiCall({
      url: API_PATH.user.update,
      method: "POST",
      data: postData,
    }).then((res) => {
      if (res) {
        updateUser({
          username: res?.user?.username,
          profileImgUrl: res?.user?.profileImgUrl
        })
        reset();
        setShowModal(false);
        toast({
          title: "User details updated successfully"
        })
      }
    });
  };

  return (
    <>
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogTrigger className="w-full" onClick={() => setShowModal(true)}>
          <div className="bg-purple-500 w-full mt-2 text-white p-2 text-sm rounded-md hover:bg-purple-600 transition">
            Edit details
          </div>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit user details</DialogTitle>
          </DialogHeader>
          <div className="flex-1">
            <div className="mt-2 p-2">
              <label className="block text-sm/6 font-medium text-gray-900 my-1">
                Username :
              </label>
              <input
                placeholder="Enter user name"
                defaultValue={username}
                className={`block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1
               outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6
               ${errors.username ? "focus:outline-red-600" : ""}`}
                {...register("username", {
                  required: {
                    value: true,
                    message: "Please fill in username",
                  },
                })}
              />
              <small className="block text-xs font-light text-red-600 my-1">
                {errors.username?.message}
              </small>
            </div>

            <div className="mt-2 p-2">
              <label className="block text-sm/6 font-medium text-gray-900 my-1">
                Profile image url :
              </label>
              <input
                placeholder="Ex : https://github.com/shadcn.png"
                className={`block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1
               outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6
               ${errors.profileImgUrl ? "focus:outline-red-600" : ""}`}
                {...register("profileImgUrl", {
                  required: {
                    value: false,
                    message: "Please fill in profile image url",
                  },
                })}
              />
              <small className="block text-xs font-light text-red-600 my-1">
                {errors.profileImgUrl?.message}
              </small>
            </div>

            <div className="p-2">
              <Button
                variant="outline"
                className="bg-purple-500 text-white w-full hover:bg-purple-600"
                onClick={handleSubmit(onSubmit)}
              >
                Update user
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
