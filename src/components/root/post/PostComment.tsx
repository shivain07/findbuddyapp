"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { API_PATH } from "@/constants/apiConstant";
import { useApiCall } from "@/helpers/axiosWrapper";
import { toast } from "@/hooks/use-toast";
import { IComment } from "@/interfaces/user";
import { Avatar } from "@radix-ui/react-avatar";
import {
  ArrowDownIcon,
  ChatBubbleIcon,
  DoubleArrowDownIcon,
  HeartIcon,
} from "@radix-ui/react-icons";
import { ObjectId } from "mongoose";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

interface IPostComment {
  title: string;
  content: string;
  postId: string;
  userId: string;
  commentsCount: number;
}

interface ICommentForm {
  comment: string;
}

function PostComment({
  title,
  content,
  postId,
  userId,
  commentsCount,
}: IPostComment) {
  const { apiCall } = useApiCall(); // Accessing the apiCall function
  const [comments, setComments] = useState<IComment[]>([]);
  const [totalComments, setTotalComments] = useState(commentsCount);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ICommentForm>();

  const onSubmit: SubmitHandler<ICommentForm> = async (data) => {
    let commentData = {
      content: data.comment,
      postedBy: userId,
      postId,
    };

    await apiCall({
      url: API_PATH.comment.add,
      method: "POST",
      data: commentData,
    })
      .then((res) => {
        if (res) {
          toast({
            title: "Comment added successfully"
          })
          getAllComments();
          reset({
            comment: "",
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getAllComments = async () => {
    try {
      const data = await apiCall({
        url: API_PATH.comment.get,
        method: "GET",
        params: { postId: postId },
      });

      if (data.postComments) {
        setComments(data.postComments);
        setTotalComments(data.postComments.length || 0);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Dialog>
      <DialogTrigger onClick={getAllComments} asChild>
        <Button
          variant="ghost"
          className="flex items-center text-sm text-gray-600"
        >
          <ChatBubbleIcon className="w-5 h-5 text-purple-700" />
          <span>{totalComments > 0 ? totalComments : ""}</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-sm">Post</DialogTitle>
        </DialogHeader>
        <div>
          <p className="text-xl font-bold text-gray-800">{title}</p>
          <p className="text-md text-gray-700">{content}</p>
        </div>
        <div>
          <div className="mt-2">
            <textarea
              {...register("comment", {
                required: {
                  value: true,
                  message: "Please add a comment",
                },
              })}
              rows={3}
              placeholder="add a comment"
              className={`block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300
               placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6
               ${errors.comment ? "focus:outline-red-600" : ""}
               `}
              defaultValue={""}
            />
          </div>
          <div className="text-right mt-2">
            <Button onClick={handleSubmit(onSubmit)}>Submit</Button>
          </div>
        </div>

        <div className="p-2">
          <div className="py-2 mb-3 text-sm flex justify-between">
            <span>Comments {`(${comments.length})`}</span>
            <span className="flex">
              Most relevant <ArrowDownIcon />
            </span>
          </div>

          <ScrollArea className="h-[200px] py-1">
            {comments.length > 0 ? (
              comments.map((comment) => (
                <div
                  key={comment._id}
                  className="p-3 my-2 bg-white rounded-md shadow-sm border"
                >
                  <div className="flex items-center">
                    <Avatar className="w-[30px] h-[30px] rounded-full overflow-hidden border-2 border-gray-200">
                      <img
                        src="https://github.com/shadcn.png"
                        alt="Avatar"
                        className="object-cover w-full h-full"
                      />
                    </Avatar>
                    <div className="mx-1">
                      <h4 className="text-sm font-semibold">
                        {comment.postedBy?.username}
                        <span className="text-xs font-light ms-2">
                          {comment.postedBy?.email}
                        </span>
                      </h4>
                    </div>
                  </div>
                  <div className="text-sm p-2 mt-2">{comment.content}</div>
                  {/* <div>
                    <Button
                      variant="ghost"
                      className="flex items-center text-sm text-gray-600"
                    >
                      <HeartIcon className="w-5 h-5" />
                    </Button>
                  </div> */}
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">
                No comments yet. Be the first!
              </p>
            )}
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default PostComment;