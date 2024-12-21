"use client";
import { useLoaderStore } from "@/GlobalStore/apiLoaderStore";

function ApiLoader() {
  const { isLoading, setIsLoading } = useLoaderStore();
  return (
    <div>
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="spinner-border animate-spin inline-block w-16 h-16 border-4 border-t-4 border-white rounded-full"></div>
        </div>
      )}
    </div>
  );
}

export default ApiLoader;
