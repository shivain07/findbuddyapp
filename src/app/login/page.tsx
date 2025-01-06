"use client";
import PasswordInput from "@/components/modified/PasswordInput";
import { Button } from "@/components/ui/button";
import { API_PATH } from "@/constants/apiConstant";
import { useUserStore } from "@/GlobalStore/userStore";
import { useApiCall } from "@/helpers/axiosWrapper";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";

type Inputs = {
  email: string;
  password: string;
};

function LoginPage() {
  const router = useRouter();
  const { apiCall } = useApiCall();
  const {setUser, setIsLoggedin } = useUserStore();
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
        url: API_PATH.user.login,
        method: "POST",
        data: data
      });

      if (response.success) {
        setIsLoggedin(true);
        localStorage.setItem("accessToken", response.accessToken);
        localStorage.setItem("refreshToken", response.refreshToken);
        setUser(response?.user);
      } else {
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
          <div>

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
              className={`w-full px-4 py-2 border ${errors.email ? "border-red-600" : "border-gray-300"}  rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            {errors.email && <span className="text-red-600 mt-2">{errors.email?.message}</span>}
          </div>
          {/* Password input */}
          <div>
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

          {/* Submit button */}
          <Button
            type="submit"
            className="w-full px-4 py-2 font-semibold text-white bg-purple-500 hover:bg-purple-700  rounded cursor-pointer"
          >
            Login
          </Button>
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
