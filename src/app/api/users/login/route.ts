import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import { generateAccessToken, generateRefreshToken } from "@/helpers/jwtToken";

connect();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { email, password } = reqBody;

    // Validate if email exists and is not an empty string
    if (!email || typeof email !== 'string' || email.trim() === "") {
      throw new Error("Email is required and cannot be empty.");
    }

    // Normalize email to lowercase
    const normalizedEmail = email.trim().toLowerCase();

    // Query the user with the normalized email
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return NextResponse.json(
        { error: "User does not exist" },
        { status: 403 }
      );
    }

    // check if password is correct
    const validPassword = await bcryptjs.compare(password, user.password);
    if (!validPassword) {
      return NextResponse.json({ error: "Invalid password" }, { status: 400 });
    }

    let accessToken = generateAccessToken({
      _id: user._id,
      username: user.username,
      email: user.email,
    });

    let refreshToken = generateRefreshToken({
      _id: user._id,
      username: user.username,
      email: user.email,
    });

    const response = NextResponse.json({
      message: "Login successful",
      success: true,
      refreshToken,
      accessToken,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        isVerified:user?.isVerified,
        profileImgUrl:user?.profileImgUrl
      }
    },{status:200});

    return response;
  } catch (error: any) {
    return NextResponse.json(
      { error: "Internal server error", message: error },
      { status: 500 }
    );
  }
}