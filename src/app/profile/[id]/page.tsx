"use client";
import Post from "@/components/root/post/Post";
import { API_PATH } from "@/constants/apiConstant";
import { useApiCall } from "@/helpers/axiosWrapper";
import { IUserPost } from "@/interfaces/user";
import { HeartFilledIcon } from "@radix-ui/react-icons";
import { useEffect, useState } from "react";

type ProfilePageProps = {
  params: Promise<{
    id: string;
  }>;
};

const ProfilePage =  ({ params }: ProfilePageProps) => {
  const { apiCall } = useApiCall(); // Accessing the apiCall function
  const [userPosts, setUserPosts] = useState<IUserPost[]>([]);

  useEffect(() => {
    getUserData();
  }, []);

  const getUserData = async () => {
    try {
      const { id } = await params;
      const data = await apiCall({
        url: API_PATH.post.get,
        method: "GET",
        params: { userId: id },
      });
      data.userPosts ? setUserPosts(data.userPosts) : setUserPosts([]);
    } catch (error) {
      console.log(error);
    }
  };
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
          {userPosts.length > 0 ? (
            userPosts?.map((post) => {
              return (
                <div className="lg:col-span-4 md:col-span-6 col-span-12" key={post._id}>
                  <Post
                    _id={post._id}
                    title={post.title}
                    content={post.content}
                    postedBy={post.postedBy}
                    tags={post.tags}
                    likes={post.likes}
                    comments={post.comments}
                    createdAt={post.createdAt}
                    updatedAt={post.updatedAt}
                  />
                </div>
              );
            })
          ) : (
            <div className="col-span-12">
              <h3 className="text-xl font-semibold p-2 flex justify-center my-4 text-gray-500">
                Add a few post and come back again{" "}
                <HeartFilledIcon width={30} height={30} className=" mx-1" />{" "}
              </h3>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
