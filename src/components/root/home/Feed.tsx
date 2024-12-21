import { IUserPost } from "@/interfaces/user";
import Post from "../post/Post";
import PostInput from "./PostInput";
import { useApiCall } from "@/helpers/axiosWrapper";
import { useEffect, useState } from "react";
import { API_PATH } from "@/constants/apiConstant";

function Feed() {
  const { apiCall } = useApiCall(); // Accessing the apiCall function
  const [relevantPosts, setRelevantPosts] = useState<IUserPost[]>([]);

  useEffect(() => {
    getAllRelevantPosts();
  }, []);

  const getAllRelevantPosts = async () => {
    try {
      const data = await apiCall({
        url: API_PATH.post.getRelevant,
        method: "GET",
      });
      data.allPosts ? setRelevantPosts(data.allPosts) : setRelevantPosts([]);
    } catch (error) {
      console.log(error);
    }
  };

  return (
  <>
      <div className="p-6">
        <PostInput />
      </div>

      {/* <PhotonSearchWithMap /> */}

      <div className="space-y-6 p-6">
        {relevantPosts.length > 0 &&
          relevantPosts.map((post) => {
            return (
              <Post
                key={post._id}
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
            );
          })}
      </div>
    </>
  );
}

export default Feed;
