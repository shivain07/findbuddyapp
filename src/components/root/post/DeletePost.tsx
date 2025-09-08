"use client"
import { API_PATH } from "@/constants/apiConstant";
import { useUserStore } from "@/GlobalStore/userStore";
import { useApiCall } from "@/helpers/axiosWrapper";
import { toast } from "@/hooks/use-toast";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Cross1Icon, TrashIcon } from "@radix-ui/react-icons";

interface IDeletePost {
  postedBy: string;
  postId: string;
}
const DeletePost = ({ postId,postedBy }: IDeletePost) => {
  const [show, setShow] = useState(false);
  const { apiCall } = useApiCall(); // Accessing the apiCall function
  const { user } = useUserStore();
  const deleteUser = async () => {
    const response = await apiCall({
      url: API_PATH.post.delete,
      method: "DELETE",
      params: { userId: user?._id, postId },
    });

    if (response.success) {
      toast({
        title: "Post deleted successfully.",
        variant: "default",
      });
      setShow(false);
    }
  };
  return (
    <>
      <AlertDialog open={show} onOpenChange={setShow}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="flex justify-between">
              <AlertDialogTitle>Alert !</AlertDialogTitle>
              <Cross1Icon
                color="black"
                height={20}
                width={20}
                className="cursor-pointer hover:scale-125"
                onClick={() => setShow(false)}
              />
            </div>
            <AlertDialogDescription>
              Are you sure you want to delete this post.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <button
              className="bg-red-500 w-full my-2 text-white p-2 text-sm rounded-md hover:bg-red-600 transition"
              onClick={deleteUser}
            >
              Delete
            </button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {user?._id == postedBy&& (
        <span className="absolute right-2" title="Delete post">
          <TrashIcon
            className="text-slate-700 hover:text-red-600 cursor-pointer"
            height={20}
            width={20}
            onClick={() => setShow(true)}
          />
        </span>
      )}
    </>
  );
};

export default DeletePost;