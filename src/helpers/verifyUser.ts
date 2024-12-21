import User from "@/models/userModel";

export async function verifyUser(userId: string) {
    // Check if user ID is provided
    if (!userId) {
      return { error: "User ID is required", status: 400 };
    }
  
    // Find the user in the database
    const user = await User.findById(userId);
  
    if (!user) {
      return { error: "User not found", status: 404 };
    }
  
    if (!user.isVerified) {
      return { error: "User is not verified", status: 403 };
    }
  
    // Return success
    return { success: true, user };
  }