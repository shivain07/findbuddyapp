import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { IUserPost } from "@/interfaces/user";
import { getDateAndTime } from "@/lib/utils";
import {  Cross1Icon,
  Share1Icon,
  TrashIcon,
} from "@radix-ui/react-icons";
import PostComment from "./PostComment";
import { useUserStore } from "@/GlobalStore/userStore";
import PostLike from "./PostLike";
import Image from "next/image";
import userNoDp from "@/assets/images/userimg.png";
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Dispatch, SetStateAction, useState } from "react";
import { useApiCall } from "@/helpers/axiosWrapper";
import { API_PATH } from "@/constants/apiConstant";
import { toast } from "@/hooks/use-toast";

export default function Post({
  _id,
  title,
  content,
  postedBy,
  tags,
  likes,
  comments,
  createdAt,
  updatedAt,
}: IUserPost) {
  const { user } = useUserStore();
  const [show, setShow] = useState(false);

  return (
    <div className="border rounded-lg p-4 shadow-sm bg-white space-y-4 relative">
      <DeletePost show={show} setShow={setShow} userId={user?._id || ""} postId={_id || ""} />
      {user?._id == postedBy._id && <span className="absolute right-2" title="Delete post">
        <TrashIcon className="text-slate-700 hover:text-red-600 cursor-pointer" height={20} width={20} onClick={() => setShow(true)} />
      </span>}

      {/* Header */}
      <div className="flex items-center space-x-4">
        <Avatar className="w-10 h-10">
          <Image
            src={postedBy?.profileImgUrl ? postedBy.profileImgUrl : userNoDp}
            alt="User image"
            width={100}
            height={100}
          />
        </Avatar>
        <div>
          <h4 className="text-sm font-semibold">
            {postedBy.username}
            <span className="text-xs font-light ms-2">{postedBy.email}</span>
          </h4>
        </div>
      </div>

      {/* Text */}
      <p className="text-sm text-gray-800">{title}</p>
      <p className="text-sm text-gray-700">{content}</p>
      <div className="text-right">
        <span className="text-xs font-light italic" suppressHydrationWarning={true}>
          {updatedAt ? getDateAndTime(updatedAt) : "-"}
        </span>
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center pt-2 border-t">
        <PostLike
          postId={_id || ""}
          userId={user?._id || ""}
          likes={likes || []}
        />
        <PostComment
          title={title}
          content={content}
          postId={_id || ""}
          userId={user?._id || ""}
          commentsCount={comments?.length || 0}
        />
        <Button
          variant="ghost"
          className="flex items-center space-x-2 text-sm text-purple-700"
        >
          <Share1Icon className="w-5 h-5" />
          <span>Share</span>
        </Button>
      </div>
    </div>
  );
}

interface IDeletePost {
  show: boolean,
  setShow: Dispatch<SetStateAction<boolean>>,
  userId: string,
  postId: string
}
const DeletePost = ({
  show,
  setShow,
  userId, postId
}: IDeletePost) => {
  const { apiCall } = useApiCall(); // Accessing the apiCall function

  const deleteUser = async () => {
    const response = await apiCall({
      url: API_PATH.post.delete,
      method: "DELETE",
      params: { userId, postId },
    });

    if (response.success) {
      toast({
        title: "Post deleted successfully.",
        variant: "default"
      });
      setShow(false)
    }
  }
  return <AlertDialog open={show} onOpenChange={setShow}>
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
}