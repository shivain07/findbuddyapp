import Link from "next/link";

export default function Home() {
  return (
    <div className="p-4">
      <section className="flex flex-col lg:flex-row items-center justify-between p-8 m-2 lg:p-16 space-y-8 lg:space-y-0">
        {/* Left Content */}
        <div className="lg:w-1/2 space-y-4 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold text-purple-500">
            We’re <span className="font-extrabold">FindBuddy</span>
          </h1>
          <p className="text-gray-600 text-lg">
            Join our community to stay connected near you.
          </p>
          <div className="space-x-4">
            <Link
              href={"/signup"}
              className="inline-flex items-center px-6 py-2 rounded-sm bg-purple-500 text-white font-medium text-lg  shadow-md hover:bg-purple-600 transition"
            >
              Sign up
            </Link>
            <Link
              href={"/login"}
              className="inline-flex items-center px-6 py-2 rounded-sm bg-purple-300 text-white font-medium  text-lg shadow-md hover:bg-purple-600 transition"
            >
              Login
            </Link>
          </div>
        </div>

        {/* Right Content */}
        <div className="lg:w-1/2 relative flex justify-center">
          <div className="flex items-center justify-center relative overflow-hidden">
            <img
              src={"/assets/images/heroimg.svg"}
              alt="Hero img"
              className=""
            />
            {/* Decorative Elements */}
            <div className="absolute top-6 left-6 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center">
              ❤️
            </div>
            <div className="absolute bottom-6 right-6 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center">
              👍
            </div>
            <div className="absolute top-16 right-10 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center">
              ✨
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
