"use client"
import Feed from "./Feed";
import Sidebar from "./Sidebar";
import ProfileCard from "./ProfileCard";

function Home() {
  return (
    <div className="w-full h-full">

      <div className="grid grid-cols-12 gap-2">
        {/* Sidebar - Takes 6 columns on small screens, 3 columns on large screens */}
        <div className="col-span-9 lg:col-span-3 m-2 rounded-lg min-h-60 p-2 pt-4 order-1 lg:order-1">
          <Sidebar />
        </div>

        {/* Feed - Takes 12 columns on small screens, 6 columns on large screens */}
        <div className="col-span-12 lg:col-span-6 m-2 rounded-lg p-2 order-3 lg:order-2">
          <Feed />
        </div>

        {/* ProfileCard - Takes 6 columns on small screens, 3 columns on large screens */}
        <div className="col-span-3 lg:col-span-3 m-2 mt-2 pt-6 order-2 lg:order-3">
          <ProfileCard />
        </div>
      </div>


    </div>
  );
}

export default Home;
