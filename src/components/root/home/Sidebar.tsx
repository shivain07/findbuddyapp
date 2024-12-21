import { Avatar } from "@/components/ui/avatar";
import TrendingPost from "../post/TrendingPost";

function Sidebar() {
  return (
    <>
      <div className="border rounded-lg p-4 shadow-sm bg-white space-y-4 my-4">
        <span className="text-lg font-semibold">Trending posts</span>
      </div>
      <div className="space-y-2">
        <TrendingPost
          user={{
            name: "John Doe",
            avatarUrl: "https://github.com/shadcn.png",
          }}
          text="This is a sample post in FindyBuddy!"
          commentsCount={12}
          likesCount={34}
        />
        <TrendingPost
          user={{
            name: "John Doe",
            avatarUrl: "https://github.com/shadcn.png",
          }}
          text="This is a sample post in FindyBuddy!"
          commentsCount={12}
          likesCount={34}
        />
      </div>
    </>
  );
}

export default Sidebar;
