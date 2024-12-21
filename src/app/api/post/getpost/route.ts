import { connect } from "@/dbConfig/dbConfig";
import Post from "@/models/postModel";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function GET(request: NextRequest) {
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
    const userPosts = await Post.find({ postedBy: userId }).populate("postedBy",'-password').sort({ createdAt: -1 });

    return NextResponse.json({ userPosts }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Internal server error",message:error },
      { status: 500 }
    );
  }
}
