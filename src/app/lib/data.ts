import Comment from "@/models/commentModel";
import Post from "@/models/postModel";


export const getRelevantPosts = async () => {

    try {
        const allPosts = await Post.find({}).populate("postedBy", '-password').sort({ createdAt: -1 }).limit(10);
        return allPosts;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch the latest post.');
    }
}

export const getUsersPost = async (userId: string) => {
    try {

        if (!userId) {
            throw new Error('User id is missing');
        }
        // Fetch all posts made by the user
        const userPosts = await Post.find({ postedBy: userId }).populate("postedBy", '-password').sort({ createdAt: -1 });
        return userPosts;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch the users posts.');
    }
}

export const getPostComment = async (postId: string) => {
    try {
        if (!postId) {
            throw new Error('Post id is missing');
        }
        // Fetch all comments on post made by the user
        const postComments = await Comment.find({ post: postId }).populate("postedBy", '-password').sort({ createdAt: -1 });
        return postComments;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch the post comment.');
    }
}