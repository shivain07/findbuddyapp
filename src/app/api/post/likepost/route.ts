import { connect } from "@/dbConfig/dbConfig";
import { verifyUser } from "@/helpers/verifyUser";
import Post from "@/models/postModel";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { postId, likedBy } = reqBody;

    // Validate required fields
    if (!postId || !likedBy) {
      return NextResponse.json(
        { error: "Required fields missing" },
        { status: 400 }
      );
    }

    // Check if the user is verified using the utility
    const userCheck = await verifyUser(likedBy);

    if (userCheck.error) {
      return NextResponse.json(
        { error: userCheck.error },
        { status: userCheck.status }
      );
    }

    // Find the post
    const post = await Post.findById(postId);
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 400 });
    }

    // Check if the user has already liked the post
    const isLiked = post.likes.includes(likedBy);

    if (isLiked) {
      // Unlike the post (remove the user ID from the likes array)
      await Post.findByIdAndUpdate(postId, {
        $pull: { likes: likedBy }, // Remove user ID from likes array
      });
      return NextResponse.json({
        message: "Post unliked successfully.",
        status: 200,
      });
    } else {
      // Like the post (add the user ID to the likes array)
      await Post.findByIdAndUpdate(postId, {
        $push: { likes: likedBy }, // Add user ID to likes array
      });
      return NextResponse.json({
        message: "Post liked successfully.",
        status: 200,
      });
    }
  } catch (error: any) {
    return NextResponse.json(
      { error: "Internal server error", message: error },
      { status: 500 }
    );
  }
}

// export async function GET(request: NextRequest) {
//   try {
//     const { searchParams } = new URL(request.url);
//     const postId = searchParams.get("postId");

//     if (!postId) {
//       return NextResponse.json(
//         { message: "postId is required" },
//         { status: 400 }
//       );
//     }
//     // Fetch all posts made by the user
//     const post = await Post.findById(postId);

//     return NextResponse.json({ userPosts }, { status: 200 });
//   } catch (error: any) {
//     return NextResponse.json({
//       message: error.message,
//       status: 500,
//     });
//   }
// }
