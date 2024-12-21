import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import PhotonAutoSuggestion from "@/components/utility/PhotonAutoSuggestion";
import { API_PATH } from "@/constants/apiConstant";
import { useApiCall } from "@/helpers/axiosWrapper";
import { IUserPost } from "@/interfaces/user";
import { useState } from "react";
import Post from "../post/Post";

function Search() {
  const [selectedCoordinates, setSelectedCoordinates] = useState<{
    location: string;
    coordinates: (number | null)[];
  } | null>({
    location: "",
    coordinates: [],
  });
  const maxKm = 50;
  const [rangeInKm, setRangeInKm] = useState(1);
  const { apiCall } = useApiCall(); // Accessing the apiCall function
  const [relevantPosts, setRelevantPosts] = useState<IUserPost[]>([]);

  const getSearchResults = async () => {
    console.log(selectedCoordinates, rangeInKm);
    await apiCall({
      url: API_PATH.search,
      method: "POST",
      data: {
        coordinates: selectedCoordinates?.coordinates,
        rangeInKm: rangeInKm,
      },
    })
      .then((res) => {
       setRelevantPosts(res.posts)
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-xl font-bold text-gray-800 mb-4">
            Search Nearby Posts
          </h1>
          <div className="flex flex-col space-y-4">
            <div className="flex-1">
              <PhotonAutoSuggestion
                setSelectedCoordinates={setSelectedCoordinates}
                selectedCoordinates={selectedCoordinates}
              />
            </div>
            <div>
              <label className="block text-sm/6 font-medium text-gray-900 my-1">
                Range in kms : {rangeInKm}
              </label>
              <Slider
                defaultValue={[1]}
                value={[rangeInKm]}
                onValueChange={(e) => setRangeInKm(e[0])}
                max={maxKm}
                step={1}
              />
            </div>
            <Button onClick={getSearchResults}>Search</Button>
          </div>
          <div className="space-y-6 p-6">
            {relevantPosts?.length > 0 &&
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
        </div>
      </div>
    </div>
  );
}

export default Search;
