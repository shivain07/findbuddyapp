import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import sendEmail from "@/helpers/sendEmail";

connect();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { userId } = reqBody;

    // Find the user in the database
    const userInDb = await User.findById(userId);

    if (!userInDb) {
      return NextResponse.json({ error: "User not found", status: 404 });
    }

    if (userInDb.isVerified) {
      return NextResponse.json({ error: "User is already verified", status: 400 });
    }

    const currentTime = new Date();

    // Check if verifyToken exists and is not expired
    if (
      userInDb.verifyToken &&
      userInDb.verifyTokenExpiry &&
      currentTime < new Date(userInDb.verifyTokenExpiry) 
    ) {

      const date = new Date(userInDb.verifyTokenExpiry||"00");
      // Extract date and time components
      const formattedDate = date.toLocaleDateString(); // e.g., "12/21/2024"
      const formattedTime = date.toLocaleTimeString(); // e.g., "4:03:14 PM"
      return NextResponse.json(
        {
          error: "Verification email already sent. Please check your email or wait until it expires.",
          expiryTime: `${formattedDate} - ${formattedTime}`,
          errorType: "VFTOKEN"
        },
        { status: 400 }
      );
    }

    try {
      await sendEmail({
        email: userInDb?.email,
        emailType: "VERIFY",
        userId: userInDb?._id,
      });

      return NextResponse.json({
        message: "Email sent successfully",
        success: true,
      });
    } catch (err) {
      return NextResponse.json(
        { error: "Error sending email. Please try again" },
        { status: 500 }
      );
    }

  } catch (error: any) {
    return NextResponse.json(
      { error: "Internal server error", message: error },
      { status: 500 }
    );
  }
}
