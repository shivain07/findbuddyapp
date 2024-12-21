import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { username, profileImgUrl, userId } = reqBody;

    if (!userId || !username) {
      return NextResponse.json(
        { error: "Required fields are missing" },
        { status: 400 }
      );
    }

    // Find the user and update fields
    const updatedUser = await User.findByIdAndUpdate(
      userId, // Filter: the user ID
      {
        username,
        ...(profileImgUrl && { profileImgUrl }), // Conditionally include profileImgUrl
      }, // Fields to update
      { new: true, runValidators: true } // Options: return updated document & validate fields
    );

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found. Please provide a valid user ID." }, { status: 404 });
    }

    return NextResponse.json({
      message: "User updated successfully",
      user: {
        username:updatedUser.username,
        profileImgUrl:updatedUser.profileImgUrl||""
      },
    });

  } catch (error: any) {
    return NextResponse.json(
      { error: "Internal server error", message: error },
      { status: 500 }
    );
  }
}
