
import { generateAccessToken, verifyRefreshToken } from "@/helpers/jwtToken";
import jwt, { JwtPayload } from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

// Define a custom type that extends JwtPayload
interface DecodedToken extends JwtPayload {
  _id: string;
  username: string;
  email: string;
}

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { refreshToken } = reqBody;
    const isValidRFToken = verifyRefreshToken(refreshToken);
    if (isValidRFToken) {
      const decodedValue = jwt.decode(refreshToken);

      if (decodedValue && typeof decodedValue !== "string") {
        const accessToken = generateAccessToken({
          _id: (decodedValue as DecodedToken)._id, // Type assertion
          username: (decodedValue as DecodedToken).username,
          email: (decodedValue as DecodedToken).email,
        });
        return NextResponse.json({
          accessToken: accessToken
        })
      }
      else {
        return NextResponse.json(
          { error: "Invalid refresh token provided.", message: "Unable to decode RFToken" },
          { status: 500 }
        );
      }

    }


  } catch (error: any) {
    return NextResponse.json(
      { error: "Internal server error", message: error },
      { status: 500 }
    );
  }
}
