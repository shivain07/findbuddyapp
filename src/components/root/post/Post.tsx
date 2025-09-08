import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { IUserPost } from "@/interfaces/user";
import { getDateAndTime } from "@/lib/utils";
import { Share1Icon } from "@radix-ui/react-icons";
import PostComment from "./PostComment";
import PostLike from "./PostLike";
import Image from "next/image";
import userNoDp from "@/assets/images/userimg.png";
import DeletePost from "./DeletePost";

export default function Post({ postData }: { postData: IUserPost }) {
  let postId = postData?._id ? postData._id.toString() : "";
  let postedBy = postData?.postedBy?._id
    ? postData.postedBy._id.toString()
    : "";
  let likes = postData.likes?.map(id=>id.toString()) || [];
  return (
    <div className="border rounded-lg p-4 shadow-sm bg-white space-y-4 relative">
      <DeletePost postId={postId} postedBy={postedBy} />

      <div className="flex items-center space-x-4">
        <Avatar className="w-10 h-10">
          <Image
            src={
              postData.postedBy?.profileImgUrl
                ? postData.postedBy.profileImgUrl
                : userNoDp
            }
            alt="User image"
            width={100}
            height={100}
          />
        </Avatar>
        <div>
          <h4 className="text-sm font-semibold">
            {postData.postedBy.username}
            <span className="text-xs font-light ms-2">
              {postData.postedBy.email}
            </span>
          </h4>
        </div>
      </div>

      <p className="text-sm text-gray-800">{postData.title}</p>
      <p className="text-sm text-gray-700">{postData.content}</p>
      <div className="text-right">
        <span
          className="text-xs font-light italic"
          suppressHydrationWarning={true}
        >
          {postData.updatedAt ? getDateAndTime(postData.updatedAt) : "-"}
        </span>
      </div>

      <div className="flex justify-between items-center pt-2 border-t">
        <PostLike postId={postId} likes={likes} />
        <PostComment
          title={postData.title}
          content={postData.content}
          postId={postId}
          commentsCount={postData.comments?.length || 0}
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
