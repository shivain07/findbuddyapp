"use client";
import { useLoaderStore } from "@/GlobalStore/apiLoaderStore";

function ApiLoader() {
  const { isLoading, setIsLoading } = useLoaderStore();
  return (
    <div>
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <section className="dots-container">
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>
          </section>
        </div>
      )}
    </div>
  );
}

export default ApiLoader;
