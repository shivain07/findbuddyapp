import { handler } from "@/app/middleware/handler";
import { connect } from "@/dbConfig/dbConfig";
import { authChecker } from "@/helpers/authChecker";
import Post from "@/models/postModel";
import { NextResponse } from "next/server";

connect();

async function getpost(request: Request) {
  try {
    // Parse the query parameters from the request URL
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "User id is missing" },
        { status: 400 }
      );
    }
    // Fetch all posts made by the user
    const userPosts = await Post.find({ postedBy: userId }).populate("postedBy", '-password').sort({ createdAt: -1 });

    return NextResponse.json({ userPosts }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Internal server error", message: error },
      { status: 500 }
    );
  }
}

export const GET = handler(
  authChecker,
  getpost,
);