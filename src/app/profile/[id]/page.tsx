import { getUsersPost } from "@/app/lib/data";
import { PostSkeleton } from "@/components/root/post/FeedSkeleton";
import Post from "@/components/root/post/Post";
import { HeartFilledIcon } from "@radix-ui/react-icons";
import { Suspense } from "react";

type ProfilePageProps = {
  params: Promise<{
    id: string;
  }>;
};

const ProfilePage = async ({ params }: ProfilePageProps) => {
  const { id } = await params;

  return (
    <div className="p-3">
      <h2 className="text-xl font-semibold p-2 flex justify-center my-4">
        Hey checkout posts made by you{" "}
        <HeartFilledIcon
          width={30}
          height={30}
          className="text-purple-800 mx-1"
        />
      </h2>
      <div className="p-2">
        <div className="grid grid-cols-12 gap-4">
          <Suspense
            fallback={
              <div className="lg:col-span-4 md:col-span-6 col-span-12 p-2">
                <PostSkeleton />
              </div>
            }
          >
            <UserPosts userId={id} />
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

const UserPosts = async ({ userId }: { userId: string }) => {
  const userPostList = await getUsersPost(userId);

  return (
    <>
      {userPostList.length > 0 ? (
        userPostList.map((post) => {
          return (
            <div
              className="lg:col-span-4 md:col-span-6 col-span-12"
              key={post._id}
            >
              <Post postData={post} />
            </div>
          );
        })
      ) : (
        <>
          <div className="col-span-12">
            <h3 className="text-xl font-semibold p-2 flex justify-center my-4 text-gray-500">
              Add a few post and come back again{" "}
              <HeartFilledIcon width={30} height={30} className=" mx-1" />{" "}
            </h3>
          </div>
        </>
      )}
    </>
  );
};
