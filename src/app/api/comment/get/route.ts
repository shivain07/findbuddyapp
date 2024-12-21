import { connect } from "@/dbConfig/dbConfig";
import Comment from "@/models/commentModel";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function GET(request: NextRequest) {
  try {
    // Parse the query parameters from the request URL
    const { searchParams } = new URL(request.url);
    const postId = searchParams.get("postId");

    if (!postId) {
      return NextResponse.json(
        { error: "Required fields are missing" },
        { status: 400 }
      );
    }

    // Fetch all comments on post made by the user
    const postComments = await Comment.find({ post: postId }).populate("postedBy",'-password').sort({ createdAt: -1 });

    return NextResponse.json({ postComments }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Internal server error",message:error },
      { status: 500 }
    );
  }
}
