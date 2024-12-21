import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import nodemailer from "nodemailer";

async function sendEmail({ email, emailType, userId }: any) {
  try {
    // create a hashed token
    const hashedToken = await bcryptjs.hash(userId.toString(), 10);

    if (emailType === "VERIFY") {
      await User.findByIdAndUpdate(userId, {
        verifyToken: hashedToken,
        verifyTokenExpiry: Date.now() + 3600000,
      });
    } else if (emailType === "RESET") {
      await User.findByIdAndUpdate(userId, {
        forgotPasswordToken: hashedToken,
        forgotPasswordTokenExpiry: Date.now() + 3600000,
      });
    }


    const transport = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    } as any);

    const emailsent = await transport.sendMail({
      from: process.env.EMAIL_USER,
      to: [email],
      subject: emailType === "VERIFY" ? "User Verification" : "Password Reset",
      // text: `Paste the url in the browser to get verified`,
      html: `<div>
        <a href="http://localhost:3000/verification?${hashedToken}">click here</>
        paste the text in a browser to get verified
        <p>http://localhost:3000/verification?${hashedToken}</P>
        </div>`,
    });

  } catch (error: any) {
    throw new Error(error.message);
  }
}

export default sendEmail;
