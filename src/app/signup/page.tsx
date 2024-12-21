"use client";
import { Button } from "@/components/ui/button";
import PhotonAutoSuggestion from "@/components/utility/PhotonAutoSuggestion";
import { API_PATH } from "@/constants/apiConstant";
import { useApiCall } from "@/helpers/axiosWrapper";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

type Inputs = {
  email: string;
  password: string;
  username: string;
  tags: string;
};

function SignupPage() {
  const router = useRouter();
  const { apiCall } = useApiCall(); // Accessing the apiCall function
  const [selectedCoordinates, setSelectedCoordinates] = useState<{
    location: string;
    coordinates: (number | null)[];
  } | null>({
    location: "",
    coordinates: [],
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();
  const [currentStep, setCurrentStep] = useState(1);

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      let userData = {
        username: data.username,
        email: data.email,
        password: data.password,
        tags: data.tags ? data.tags.split(" ") : [],
        location: selectedCoordinates?.location,
        geoLocation: {
          type: "Point",
          coordinates: selectedCoordinates?.coordinates,
        },
      };

      await apiCall({
        url: API_PATH.user.signup,
        method: "POST",
        data: userData,
      }).then(() => {
        router.push("/login");
      });
      // Redirect or show success message
    } catch (error) {
      console.error("Signup failed", error);
    }
  };

  const isButtonDisabled =
    !selectedCoordinates ||
    selectedCoordinates.location.trim() === "" ||
    selectedCoordinates.coordinates.length === 0 ||
    selectedCoordinates.coordinates.every((coord) => coord === null);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4 h-full">
      <h2 className="text-3xl font-bold mb-6 text-center">Sign Up</h2>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm"
      >
        <div className="mb-4">
          <input
            type="email"
            placeholder="Email"
            {...register("email", { required: true })}
            className={`border ${
              errors.email ? "border-red-500" : "border-gray-300"
            } p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
          {errors.email && (
            <span className="text-red-500 text-sm">Email is required</span>
          )}
        </div>

        <div className="mb-4">
          <input
            placeholder="Username"
            {...register("username", { required: true })}
            className={`border ${
              errors.username ? "border-red-500" : "border-gray-300"
            } p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
          {errors.username && (
            <span className="text-red-500 text-sm">Username is required</span>
          )}
        </div>

        <div className="mb-4">
          <input
            type="password"
            placeholder="Password"
            {...register("password", { required: true })}
            className={`border ${
              errors.password ? "border-red-500" : "border-gray-300"
            } p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
          {errors.password && (
            <span className="text-red-500 text-sm">Password is required</span>
          )}
        </div>
        {currentStep === 2 && (
          <>
            {" "}
            <div className="mb-4">
              <input
                type="text"
                placeholder="Tags ex: sports,music"
                {...register("tags", { required: true })}
                className={`border ${
                  errors.password ? "border-red-500" : "border-gray-300"
                } p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
              {errors.tags && (
                <span className="text-red-500 text-sm">
                  Please enter some tags preferences
                </span>
              )}
            </div>
            <div className="mb-4">
              <PhotonAutoSuggestion
                selectedCoordinates={selectedCoordinates}
                setSelectedCoordinates={setSelectedCoordinates}
                placeholder="Your location"
                showLabel={false}
              />
              {!selectedCoordinates?.location && (
                <span className="text-gray-500 text-sm">
                  *Please fill in some location*
                </span>
              )}
            </div>
          </>
        )}

        {currentStep === 1 && (
          <Button
            type="submit"
            className="bg-purple-500 hover:bg-purple-700 font-semibold text-white p-2 rounded w-full transition"
            onClick={() => setCurrentStep(2)}
          >
            Next
          </Button>
        )}
        {currentStep === 2 && (
          <Button
            type="submit"
            className="bg-purple-500 hover:bg-purple-700 font-semibold  text-white p-2 rounded w-full transition"
            disabled={isButtonDisabled}
          >
            Sign Up
          </Button>
        )}
      </form>
      <Link href="/login" className="mt-4 text-purple-500 hover:underline">
        Already have an account? Login
      </Link>
    </div>
  );
}

export default SignupPage;
