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
  console.log(relevantPosts);
  return (
    <div className="space-y-6 p-6">
      {relevantPosts.length > 0 &&
        relevantPosts.map((post) => {
          return <Post key={post.id} postData={post} />;
        })}
    </div>
  );
};
