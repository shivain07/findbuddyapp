"use client"
import { API_PATH } from "@/constants/apiConstant";
import { useUserStore } from "@/GlobalStore/userStore";
import { useApiCall } from "@/helpers/axiosWrapper";
import { toast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function EditUserInfo({
  username,
  userId,
}: {
  username: string;
  userId: string;
}) {
  interface IUserEdit {
    username: string;
    profileImgUrl?: string;
  }

  const { updateUser } = useUserStore();
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
          profileImgUrl: res?.user?.profileImgUrl,
        });
        reset();
        setShowModal(false);
        toast({
          title: "User details updated successfully",
        });
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
            <div className="mt-2">
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

            <div className="mt-2">
              <label className="block text-sm/6 font-medium text-gray-900 my-1">
                Profile image url :
              </label>
              <input
                placeholder="Ex : https://github.com/shadcn.png"
                className={`block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1
               outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6
               ${errors.profileImgUrl ? "focus:outline-red-600" : ""}`}
                {...register("profileImgUrl", {
                  pattern: {
                    value: /^(https?:\/\/)?([^\s\/$.?#].[^\s]*)$/,
                    message: "Please enter a valid url",
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
}
