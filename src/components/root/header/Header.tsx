"use client";
import { useUserStore } from "@/GlobalStore/userStore";
import {
  BellIcon,
  MagnifyingGlassIcon,
  PersonIcon,
} from "@radix-ui/react-icons";
import { usePathname, useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { API_PATH } from "@/constants/apiConstant";
import { useApiCall } from "@/helpers/axiosWrapper";
import { OPEN_PAGES } from "@/constants/uiConstants";

function Header() {
  const router = useRouter();
  const { user, isLoggedin, setIsLoggedin, clearUser } = useUserStore();
  const pathname = usePathname(); // Get the current URL path
  const { apiCall } = useApiCall(); // Accessing the apiCall function

  const logout = async () => {
    try {
      await apiCall({
        url: API_PATH.user.logout,
        method: "GET",
        data: { user: user },
      });
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      clearUser();
      setIsLoggedin(false);
      router.push("/login");
    } catch (error: any) {
      console.log(error.message);
    }
  };

  const logoClick = () => {
    if (OPEN_PAGES.includes(pathname) && !isLoggedin) {
      router.push(`/home`);
      return;
    }

    if (isLoggedin) {
      router.push(`/home`);
    } else {
      router.push(`/`);
    }
  };

  return (
    <header className="grid grid-cols-12 gap-2 px-4 py-3 bg-white shadow-md border-b-2">
      {/* LinkedIn Logo */}
      <div className="col-span-7 md:col-span-3 order-1 md:order-1 flex items-center space-x-2">
        <div
          className="text-purple-900 font-bold text-2xl cursor-pointer"
          onClick={logoClick}
        >
          Findbuddy?
        </div>
      </div>

      <div className="col-span-12 md:col-span-7 order-3 md:order-2">
        {pathname !== "/search" && (
          <div className=" flex w-full max-w-3xl  items-center gap-3 rounded-xl border-2 border-[#EBEEF7] bg-white px-3 py-2 md:flex-row">
            <MagnifyingGlassIcon
              className="cursor-pointer text-purple-900"
              height={30}
              width={30}
            />
            <input
              type="search"
              name="search"
              onClick={() => {
                router.push(`/search`);
              }}
              placeholder="Search for people, jobs, companies and more..."
              className="w-full text-[#939AAD] outline-none"
            />
          </div>
        )}
      </div>

      {isLoggedin && (
        <div className="col-span-5 md:col-span-2 order-2 md:order-3 flex items-center justify-end gap-1 space-x-2 px-2">
          <div className="flex items-center justify-center w-10 h-10 bg-gray-200 rounded-full hover:bg-gray-300">
            <DropdownMenu>
              <DropdownMenuTrigger>
                <div className="py-2 px-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-full border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">
                  <PersonIcon
                    height={30}
                    width={30}
                    className="cursor-pointer p-1 text-purple-900 hover:scale-110"
                  />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    router.push(`/profile/${user?._id}`);
                  }}
                >
                  Profile
                </DropdownMenuItem>

                <DropdownMenuItem onClick={logout}>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="py-2 px-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-full border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">
            <BellIcon
              height={30}
              width={30}
              className="cursor-pointer p-1 text-purple-900 hover:scale-110"
              onClick={() => {
                router.push(`/notification`);
              }}
            />
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;
