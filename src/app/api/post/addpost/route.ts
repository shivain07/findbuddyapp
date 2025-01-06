import { handler } from "@/app/middleware/handler";
import { connect } from "@/dbConfig/dbConfig";
import { authChecker } from "@/helpers/authChecker";
import { verifyUser } from "@/helpers/verifyUser";
import Post from "@/models/postModel";
import { NextResponse } from "next/server";

connect();

async function addpost(request: Request) {
  try {
    const reqBody = await request.json();
    const { title, content, postedBy } = reqBody;
    // Validate required fields
    if (!title || !content || !postedBy) {
      return NextResponse.json(
        { error: "Required fields are missing" },
        { status: 400 }
      );
    }

    // Check if the user is verified using the utility
    const userCheck = await verifyUser(postedBy);

    if (userCheck.error) {
      return NextResponse.json(
        { error: userCheck.error },
        { status: userCheck.status }
      );
    }

    const newPost = new Post(reqBody);

    // Save to database
    const savedPost = await newPost.save();

    const response = NextResponse.json({
      message: "Post created successfully",
      post: savedPost,
    });

    return response;
  } catch (error: any) {
    return NextResponse.json(
      { error: "Internal server error", message: error },
      { status: 500 }
    );
  }
}

export const POST = handler(
  authChecker,
  addpost,
);