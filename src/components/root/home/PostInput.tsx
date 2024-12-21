import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  PopoverContent,
  Popover,
  PopoverTrigger,
} from "@/components/ui/popover";
import PhotonAutoSuggestion from "@/components/utility/PhotonAutoSuggestion";
import { API_PATH } from "@/constants/apiConstant";
import { useUserStore } from "@/GlobalStore/userStore";
import { useApiCall } from "@/helpers/axiosWrapper";
import { toast } from "@/hooks/use-toast";
import { IUserPost } from "@/interfaces/user";
import { Avatar } from "@radix-ui/react-avatar";
import {
  ActivityLogIcon,
  FaceIcon,
  GlobeIcon,
  ImageIcon,
} from "@radix-ui/react-icons";
import { ChangeEvent, useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

export default function PostInput() {
  const { user } = useUserStore();
  const { apiCall } = useApiCall();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<IUserPost>();

  const [selectedCoordinates, setSelectedCoordinates] = useState<{
    location: string;
    coordinates: (number | null)[];
  } | null>({
    location: "",
    coordinates: [],
  });

  const onSubmit: SubmitHandler<IUserPost> = async (data) => {
    let postData = {
      content: data.content,
      title: data.title,
      tags: data.tags ? data.tags.split(" ") : [],
      postedBy: user?._id,
      location: selectedCoordinates?.location,
      geoLocation: {
        type: "Point",
        coordinates: selectedCoordinates?.coordinates,
      },
    };

    await apiCall({
      url: API_PATH.post.add,
      method: "POST",
      data: postData,
    }).then((res) => {
      if (res) {
        toast({
          title: "Post added successfully"
        })
        reset();
      }
    });
  };

  const isButtonDisabled =
    !selectedCoordinates ||
    selectedCoordinates.location.trim() === "" ||
    selectedCoordinates.coordinates.length === 0 ||
    selectedCoordinates.coordinates.every((coord) => coord === null);

  return (
    <form className="border rounded-lg p-4 shadow-sm bg-white space-y-4">
      {/* Header */}
      <div className="space-x-4">
        <div>
          <h3 className="font-bold text-xl">Write your first post</h3>
        </div>
        <div className="flex-1">
          <div className="mt-2 p-2">
            <label className="block text-sm/6 font-medium text-gray-900 my-1">
              Title :
            </label>
            <input
              id="title"
              placeholder="Title"
              className={`block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1
               outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6
               ${errors.title ? "focus:outline-red-600" : ""}`}
              {...register("title", {
                required: {
                  value: true,
                  message: "Please fill in title",
                },
              })}
            />
            <small className="block text-xs font-light text-red-600 my-1">
              {errors.title?.message}
            </small>
          </div>

          <div className="mt-2 p-2">
            <label className="block text-sm/6 font-medium text-gray-900 my-1">
              Content :
            </label>
            <textarea
              id="content"
              rows={3}
              {...register("content", {
                required: {
                  value: true,
                  message: "Please fill in content",
                },
              })}
              placeholder="Find a buddy share your thoughts?"
              className={`block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1
                outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6
                ${errors.content ? "focus:outline-red-600" : ""}`}
              defaultValue={""}
            />
            <small className="block text-xs font-light text-red-600 my-1">
              {errors.content?.message}
            </small>
          </div>
          <div className="mt-2 p-2">
            <label className="block text-sm/6 font-medium text-gray-900 my-1">
              Tags :
            </label>
            <input
              {...register("tags")}
              placeholder="Ex: Sports dance"
              className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
              defaultValue={""}
            />
          </div>
          <div className="mt-2 p-2">
            <PhotonAutoSuggestion
              selectedCoordinates={selectedCoordinates}
              setSelectedCoordinates={setSelectedCoordinates}
            />
          </div>
        </div>
      </div>

      {/* Toolbar and Post Button */}
      <div className="flex justify-between items-center pt-2 border-t border-gray-700">
        {/* Toolbar Icons */}
        <div className="flex space-x-4 text-purple-500">
          <Popover>
            <PopoverTrigger>
              <ImageIcon className="w-5 h-5 cursor-pointer" />
            </PopoverTrigger>
            <PopoverContent>Place content for the popover here.</PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger>
              <FaceIcon className="w-5 h-5 cursor-pointer" />
            </PopoverTrigger>
            <PopoverContent></PopoverContent>
          </Popover>

          <GlobeIcon className="w-5 h-5 cursor-pointer" />
        </div>

        <Button
          variant="outline"
          className="bg-purple-500 text-white px-4 py-2 rounded-full hover:bg-purple-600"
          disabled={isButtonDisabled}
          onClick={handleSubmit(onSubmit)}
        >
          Post
        </Button>
      </div>
    </form>
  );
}
