import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        required:[true,"Please provide username"],
        type:String,
        unique:true
    },
    email: {
        required:[true,"Please provide email"],
        type:String,
        unique:true
    },
    isVerified:{
        type:Boolean,
        default:false
    },
    password:{
        required:[true,"Password required"],
        type:String,
    },
    tags: [{ type: String }], 
    location: { type: String ,required:true},
    geoLocation: {
        type: {
            type: String,
            enum: ["Point"], // Only allow "Point"
            required: true,
        },
        coordinates: {
            type: [Number], // Array of numbers [longitude, latitude]
            required: true,
        },
    },
    profileImgUrl:{
        type:String,
        required:false,
    },
    forgotPasswordToken:String,
    forgotPasswordTokenExpiry:Date,
    verifyToken:String,
    verifyTokenExpiry:Date
})

const User =mongoose.models.User || mongoose.model("User", userSchema);

export default User;