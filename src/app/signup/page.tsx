"use client";
import PasswordInput from "@/components/modified/PasswordInput";
import { Button } from "@/components/ui/button";
import PhotonAutoSuggestion from "@/components/utility/PhotonAutoSuggestion";
import { API_PATH } from "@/constants/apiConstant";
import { useUserStore } from "@/GlobalStore/userStore";
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
  const { setUser, setIsLoggedin } = useUserStore();

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

      let response = await apiCall({
        url: API_PATH.user.signup,
        method: "POST",
        data: userData,
      });

      if (response.success) {
        setIsLoggedin(true);
        localStorage.setItem("accessToken", response.accessToken);
        localStorage.setItem("refreshToken", response.refreshToken);
        setUser(response?.user);
        router.push("/home");
      } else {
        setIsLoggedin(false)
      }
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
            {...register("email", {
              required: { value: true, message: "Email is required." },
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Enter a valid email.",
              },
            })}
            className={`border ${errors.email ? "border-red-500" : "border-gray-300"
              } p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
          {errors.email && (
            <span className="text-red-500 text-sm">{errors.email.message}</span>
          )}
        </div>

        <div className="mb-4">
          <input
            placeholder="Username"
            {...register("username", {
              required: { value: true, message: "Username is required." },
              minLength: { value: 2, message: "Username must be at least 2 characters." }
            })}
            className={`border ${errors.username ? "border-red-500" : "border-gray-300"
              } p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
          {errors.username && (
            <span className="text-red-500 text-sm">{errors.username.message}</span>
          )}
        </div>

        <div className="mb-4">
          <PasswordInput
            register={register}
            name="password"
            errors={errors?.password}
            validationRules={{
              required: { value: true, message: "Password is required." },
              minLength: { value: 6, message: "Password must be at least 6 characters." },
            }}
            placeholder="Enter your password"
          />
        </div>
        {currentStep === 2 && (
          <>
            {" "}
            <div className="mb-4">
              <input
                type="text"
                placeholder="Tags ex: sports,music"
                {...register("tags", { required: { value: true, message: "Please enter some tags preferences" } })}
                className={`border ${errors.password ? "border-red-500" : "border-gray-300"
                  } p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
              {errors.tags && (
                <span className="text-red-500 text-sm">
                  {errors.tags.message}
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
