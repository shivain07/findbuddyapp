"use client"
import { Button } from "@/components/ui/button";
import { API_PATH } from "@/constants/apiConstant";
import { useUserStore } from "@/GlobalStore/userStore";
import { useApiCall } from "@/helpers/axiosWrapper";
import { HeartFilledIcon, HeartIcon } from "@radix-ui/react-icons";
import { useEffect, useState } from "react";

function PostLike({
  postId,
  likes,
}: {
  postId: string;
  likes: string[];
}) {
  const { user } = useUserStore();
  const userId = user?._id||"";
  const { apiCall } = useApiCall(); // Accessing the apiCall function
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(likes?.length || 0);
  useEffect(() => {
    if (likes.includes(userId)) {
      setIsLiked(true);
    } else {
      setIsLiked(false);
    }
  }, [likes]);


  const likePost = async () => {
    try {
      let response = await apiCall({
        url: API_PATH.post.like,
        method: "POST",
        data: {
          postId,
          likedBy: userId,
        },
      });

      if (response) {
        setIsLiked(!isLiked);
        isLiked
          ? setLikesCount((prev) => prev - 1)
          : setLikesCount((prev) => prev + 1);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Button
      variant="ghost"
      className="flex items-center text-sm text-gray-600"
      onClick={likePost}
    >
      {!isLiked ? (
        <HeartIcon className="w-5 h-5 text-purple-700" />
      ) : (
        <HeartFilledIcon className="w-5 h-5 text-purple-700" />
      )}
      {likesCount > 0 ? likesCount : ""}
    </Button>
  );
}

export default PostLike;
