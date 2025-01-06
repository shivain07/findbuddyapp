import { handler } from "@/app/middleware/handler";
import { connect } from "@/dbConfig/dbConfig";
import { authChecker } from "@/helpers/authChecker";
import { verifyUser } from "@/helpers/verifyUser";
import Comment from "@/models/commentModel";
import Post from "@/models/postModel";
import { NextResponse } from "next/server";

connect();

async function addComment(request: Request) {
  try {
    const reqBody = await request.json();
    const { content, postId, postedBy } = reqBody;

    // Validate required fields
    if (!postId || !content || !postedBy) {
      return NextResponse.json(
        { error: "Required fields are missing" },
        { status: 400 }
      );
    }

    let comment = {
      content,
      postedBy,
      post: postId,
    };
    
    // Check if the user is verified using the utility
    const userCheck = await verifyUser(postedBy);

    if (userCheck.error) {
      return NextResponse.json(
        { error: userCheck.error },
        { status: userCheck.status }
      );
    }

    const newComment = new Comment(comment);

    // Step 1: Save comment to database
    const savedComment = await newComment.save();

    // // Step 2: Update the Post's comments array
    await Post.findByIdAndUpdate(postId, {
      $push: { comments: savedComment._id },
    });

    const response = NextResponse.json({
      message: "Comment added successfully",
      status: 201,
    });

    return response;
  } catch (error: any) {
    return NextResponse.json(
      { error: "Internal server error" ,message:error },
      { status: 500 }
    );
  }
}

export const POST = handler(
  authChecker,
  addComment,
);