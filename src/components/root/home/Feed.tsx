import { Suspense } from "react";
import Post from "../post/Post";
import { getRelevantPosts } from "@/app/lib/data";
import { FeedSkeleton } from "../post/FeedSkeleton";

async function Feed() {
  return (
    <>
      {/* <PhotonSearchWithMap /> */}
      <Suspense fallback={<FeedSkeleton />}>
        <FeedWall />
      </Suspense>
    </>
  );
}

export default Feed;

const FeedWall = async () => {
  const relevantPosts = await getRelevantPosts();
  return (
    <div className="space-y-6 p-6">
      {relevantPosts.length > 0 &&
        relevantPosts.map((post,index) => {
          return <Post key={post?._id||index} postData={post} />;
        })}
    </div>
  );
};
