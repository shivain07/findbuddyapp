import { handler } from "@/app/middleware/handler";
import { connect } from "@/dbConfig/dbConfig";
import { authChecker } from "@/helpers/authChecker";
import Post from "@/models/postModel";
import {NextResponse } from "next/server";

connect();

const getRelevantPost = async (req: Request) => {
  try {
    // Parse the query parameters from the request URL

    // Fetch all posts made by the user
    const allPosts = await Post.find({}).populate("postedBy", '-password').sort({ createdAt: -1 }).limit(10); //add limit later add pagination

    return NextResponse.json({ allPosts }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Internal server error", message: error },
      { status: 500 }
    );
  }
}

export const GET = handler(
  authChecker,
  getRelevantPost,
);