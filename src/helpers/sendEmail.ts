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
      html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
      <h2 style="color: #4CAF50; text-align: center;">${
        emailType === "VERIFY" ? "Verify Your Email" : "Reset Your Password"
      }</h2>
      <p style="font-size: 16px;margin-bottom:5px;">
        Hey from findbuddy 
      </p>
      <p style="font-size: 16px;">
        ${
          emailType === "VERIFY"
            ? "Thank you for signing up! Please verify your email address by clicking the button below."
            : "We received a request to reset your password. Click the button below to proceed."
        }
      </p>
      <div style="text-align: center; margin: 20px 0;">
        <a href="${process.env.DOMAIN}/verification?${hashedToken}" 
           style="background-color: #4CAF50; color: white; text-decoration: none; padding: 10px 20px; border-radius: 5px; font-size: 16px; display: inline-block;">
          ${emailType === "VERIFY" ? "Verify Email" : "Reset Password"}
        </a>
      </div>
      <p style="font-size: 14px; color: #555;">
        Or, copy and paste the following link into your browser if the button does not work:
      </p>
      <p style="font-size: 14px; color: #007BFF; word-wrap: break-word;">
        <a href="${process.env.DOMAIN}/verification?${hashedToken}" style="color: #007BFF;">
        ${process.env.DOMAIN}/verification?${hashedToken}
        </a>
      </p>
      <hr style="border: 0; height: 1px; background: #ddd; margin: 20px 0;">
      <p style="font-size: 12px; color: #999; text-align: center;">
        If you did not request this email, you can safely ignore it.
      </p>
    </div>
      `,
    });

  } catch (error: any) {
    throw new Error(error.message);
  }
}

export default sendEmail;
