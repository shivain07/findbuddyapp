import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import { generateAccessToken, generateRefreshToken } from "@/helpers/jwtToken";

connect();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { username, email, password, tags, location, geoLocation } = reqBody;

    // Basic validation
    if (
      !username ||
      !email ||
      !password ||
      !tags ||
      !location
    ) {
      return NextResponse.json(
        { error: "Required fields are missing" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "User already present" },
        { status: 400 }
      );
    }

    // Hash password
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    // Create new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      tags, location, geoLocation
    });

    // Save user
    const savedUser = await newUser.save();

    let accessToken = generateAccessToken({
      _id: savedUser._id,
      username: savedUser.username,
      email: savedUser.email,
    });

    let refreshToken = generateRefreshToken({
      _id: savedUser._id,
      username: savedUser.username,
      email: savedUser.email,
    });

    const response = NextResponse.json({
      message: "User created successfully",
      success: true,
      refreshToken,
      accessToken,
      user: {
        _id: savedUser._id,
        username: savedUser.username,
        email: savedUser.email,
        isVerified: savedUser?.isVerified,
        profileImgUrl: savedUser?.profileImgUrl
      }
    }, { status: 201 });

    return response;
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error", message: error },
      {
        status: 500
      }
    );
  }
}
