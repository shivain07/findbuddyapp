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
} from "@/components/ui/dropdown-menu"
import { API_PATH } from "@/constants/apiConstant";
import { useApiCall } from "@/helpers/axiosWrapper";
import { OPEN_PAGES } from "@/constants/uiConstants";

function Header() {
  const router = useRouter();
  const { user, isLoggedin, setIsLoggedin } = useUserStore();
  const pathname = usePathname(); // Get the current URL path
  const { apiCall } = useApiCall(); // Accessing the apiCall function

  const logout = async () => {
    try {
      await apiCall({
        url: API_PATH.user.logout,
        method: "GET",
        data: { user: user },
      });
      router.push("/login");
      setIsLoggedin(false);
    } catch (error: any) {
      console.log(error.message);
    }
  };

  const logoClick = () => {

    if(OPEN_PAGES.includes(pathname)&&!isLoggedin){
      router.push(`/home`);
      return;
    }

    if (isLoggedin) {
      router.push(`/home`);
    } else {
      router.push(`/`);
    }
  }

  return (
    <header className="flex items-center justify-between px-4 py-3 bg-white shadow-md border-b-2">
      {/* LinkedIn Logo */}
      <div className="flex items-center space-x-2">
        <div
          className="text-purple-900 font-bold text-2xl cursor-pointer"
          onClick={logoClick}
        >
          Findbuddy?
        </div>
      </div>
      {pathname !== "/search" && (
        <div className="w-full flex justify-center items-center">
          <MagnifyingGlassIcon
            className="cursor-pointer text-purple-900"
            height={30}
            width={30}
          />
          <input
            type="text"
            placeholder="Search for people, jobs, companies and more..."
            className="ml-4 w-full max-w-md px-4 py-2 bg-gray-100 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={() => {
              router.push(`/search`);
            }}
          />
        </div>
      )}

      {isLoggedin && <div className="flex items-center space-x-2 px-2">

        <div className="flex items-center justify-center w-10 h-10 bg-gray-200 rounded-full hover:bg-gray-300">
          <span className="text-gray-600 text-xl font-bold">
            <DropdownMenu>
              <DropdownMenuTrigger>
                <PersonIcon
                  height={30}
                  width={30}
                  className="cursor-pointer p-1 text-purple-900 hover:scale-110"
                />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => { router.push(`/profile/${user?._id}`); }}>Profile</DropdownMenuItem>

                <DropdownMenuItem onClick={logout}>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </span>
        </div>

        <div className="flex items-center justify-center w-10 h-10 bg-gray-200 rounded-full hover:bg-gray-300">
          <span className="text-gray-600 text-xl font-bold">
            <BellIcon
              height={30}
              width={30}
              className="cursor-pointer p-1 text-purple-900 hover:scale-110"
            />
          </span>
        </div>
      </div>}
    </header>
  );
}

export default Header;
