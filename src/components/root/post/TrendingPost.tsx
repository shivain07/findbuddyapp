import { Avatar } from "@radix-ui/react-avatar";

interface TrendingPostProps {
  user: {
    name: string;
    avatarUrl: string;
  };
  text: string;
  commentsCount: number;
  likesCount: number;
}

function TrendingPost({ user,text }: TrendingPostProps) {
  return (
    <div className="border rounded-lg p-4 shadow-sm bg-white space-y-4">
      <div className="flex items-center space-x-4">
        <Avatar className="w-10 h-10">
          <img src={user.avatarUrl} alt={`${user.name}'s avatar`} />
        </Avatar>
        <div>
          <h4 className="text-sm font-medium">{user.name}</h4>
        </div>
      </div>{" "}
      <p className="text-sm text-gray-700">{text}</p>
    </div>
  );
}

export default TrendingPost;
