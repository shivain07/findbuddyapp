import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema({
    content: { type: String, required: true },
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Users who liked the comment
}, { timestamps: true });

const Comment = mongoose.models.Comment ||mongoose.model('Comment', CommentSchema);

export default Comment;
