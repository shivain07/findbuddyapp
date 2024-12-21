import mongoose from "mongoose";

const PostSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    postedBy: { type: String },
    tags: [{ type: String }], // Example: ['party', 'dance']
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
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Users who liked the post
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
}, { timestamps: true });

PostSchema.index({ geoLocation: "2dsphere" }); // Enable geospatial queries

const Post = mongoose.models.Post || mongoose.model("Post", PostSchema);
export default Post;
