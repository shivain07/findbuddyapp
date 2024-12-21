import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { IUserPost } from "@/interfaces/user";
import { getDateAndTime } from "@/lib/utils";
import {
  ChatBubbleIcon,
  Cross1Icon,
  HeartIcon,
  Share1Icon,
} from "@radix-ui/react-icons";
import PostComment from "./PostComment";
import { useUserStore } from "@/GlobalStore/userStore";
import PostLike from "./PostLike";
import Image from "next/image";
import userNoDp from "@/assets/images/userimg.png";

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

  return (
    <div className="border rounded-lg p-4 shadow-sm bg-white space-y-4">
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
