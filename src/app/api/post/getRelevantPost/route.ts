import { connect } from "@/dbConfig/dbConfig";
import Post from "@/models/postModel";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function GET(request: NextRequest) {
  try {
    // Parse the query parameters from the request URL

    // Fetch all posts made by the user
    const allPosts = await Post.find({}).populate("postedBy",'-password').sort({ createdAt: -1 }).limit(10); //add limit later add pagination

    return NextResponse.json({ allPosts }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Internal server error",message:error },
      { status: 500 }
    );
  }
}
