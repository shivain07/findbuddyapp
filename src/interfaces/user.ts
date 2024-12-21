import { Types } from "mongoose";

export interface IUserState {
  username: string;
  email: string;
  isVerified: boolean;
  password?: string; // Password might not be needed in the state
  forgotPasswordToken?: string;
  forgotPasswordTokenExpiry?: Date;
  verifyToken?: string;
  verifyTokenExpiry?: Date;
  id?: string;
  _id?: string;
  profileImgUrl?:string
}

export interface IUserPost {
  title: string;
  content: string;
  tags?: string; // Optional, array of strings
  location?: string; // Optional
  geoLocation?: {
    type: string; // Example: "Point"
    coordinates: [number, number]; // Longitude, Latitude
  };
  _id?: string;
  postedBy: IUserState; // Reference to a user
  likes?: string[]; // Array of users who liked the post
  comments?: string[]; // Array of comments associated with the post
  createdAt?: Date; // Auto-generated by `timestamps: true`
  updatedAt?: Date; // Auto-generated by `timestamps: true`
}

export interface IComment {
  _id: string; // Unique identifier for the comment
  content: string; // Text content of the comment
  postedBy: IUserState; // ID of the user who posted the comment
  post: string; // ID of the associated post
  likes: string[]; // Array of user IDs who liked the comment
  createdAt: string; // ISO string of when the comment was created
  updatedAt: string; // ISO string of when the comment was last updated
  __v: number; // Version key (used by MongoDB)
}
