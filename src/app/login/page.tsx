"use client";
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
};

function LoginPage() {
  const router = useRouter();
  const { apiCall } = useApiCall();
  const { setIsLoggedin } = useUserStore();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      // Add your API call here, e.g.:

      const response = await apiCall({
        url:API_PATH.user.login,
        method: "POST",
        data:data
      });

      if(response.success){
        setIsLoggedin(true);
      }else{
        setIsLoggedin(false)
      }

      router.push("/home");
      // Redirect or show success message
    } catch (error) {
      console.error("login failed", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white shadow-md rounded-lg">
        <h2 className="text-2xl font-bold text-center text-gray-800">Login</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Email input */}
          <input
            type="email"
            placeholder="Email"
            {...register("email")}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {/* Password input */}
          <input
            type="password"
            placeholder="Password"
            {...register("password", { required: true })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {/* Submit button */}
          <input
            type="submit"
            value="Login"
            className="w-full px-4 py-2 font-semibold text-white bg-purple-500 hover:bg-purple-700  rounded-lg cursor-pointer"
          />
        </form>
        <div className="text-center">
          <Link href="/signup" className="text-purple-500 hover:underline">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
