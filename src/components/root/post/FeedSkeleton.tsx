function FeedSkeleton() {
  return (
    <>
      <PostSkeleton />
      <PostSkeleton />
      <PostSkeleton />
    </>
  );
}

function PostSkeleton() {
  return (
    <div className="border rounded-lg p-4 shadow-sm bg-white space-y-4 animate-pulse my-4">
      {/* Header: Avatar + Name + Email + Delete icon */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 rounded-full bg-gray-300" />
          <div className="space-y-2">
            <div className="w-32 h-4 bg-gray-300 rounded" />
            <div className="w-48 h-3 bg-gray-300 rounded" />
          </div>
        </div>
        <div className="w-6 h-6 bg-gray-300 rounded" />
      </div>

      {/* Content */}
      <div className="space-y-2">
        <div className="w-full h-4 bg-gray-300 rounded" />
        <div className="w-3/4 h-4 bg-gray-300 rounded" />
      </div>

      {/* Timestamp */}
      <div className="w-24 h-3 bg-gray-300 rounded self-end" />

      {/* Action buttons: Like, Comment, Share */}
      <div className="flex items-center space-x-6 pt-2 border-t">
        <div className="w-6 h-6 bg-gray-300 rounded-full" />
        <div className="w-6 h-6 bg-gray-300 rounded-full" />
        <div className="w-16 h-4 bg-gray-300 rounded" />
      </div>
    </div>
  );
}

export { FeedSkeleton, PostSkeleton };
