import { handler } from "@/app/middleware/handler";
import { authChecker } from "@/helpers/authChecker";
import { verifyUser } from "@/helpers/verifyUser";
import Post from "@/models/postModel";
import { NextResponse } from "next/server";

 async function deletepost (request: Request) {
  try {
    // Extract query parameters (postId and userId) from the request URL
    const { searchParams } = new URL(request.url);
    const postId = searchParams.get("postId");
    const userId = searchParams.get("userId");

    // Validate required fields
    if (!postId || !userId) {
      return NextResponse.json(
        { error: "postId and userId are required" },
        { status: 400 }
      );
    }

    // Verify the user
    const userCheck = await verifyUser(userId);

    if (userCheck.error) {
      return NextResponse.json(
        { error: userCheck.error },
        { status: userCheck.status }
      );
    }

    // Find the post
    const post = await Post.findById(postId);

    if (!post) {
      return NextResponse.json(
        { error: "Post not found" },
        { status: 404 }
      );
    }

    // Check if the user is authorized to delete the post
    if (post.postedBy.toString() !== userId) {
      return NextResponse.json(
        { error: "You are not authorized to delete this post" },
        { status: 403 }
      );
    }

    // Delete the post
    await Post.findByIdAndDelete(postId);

    return NextResponse.json({
      message: "Post deleted successfully",
      success: true
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Internal server error", message: error },
      { status: 500 }
    );
  }
}

export const DELETE = handler(
  authChecker,
  deletepost,
);