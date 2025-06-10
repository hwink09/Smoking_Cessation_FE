const Post = require('../models/post.model');
const User = require('../models/user.model');

module.exports.createPost = async (req, res) => {
    try {
        const { content, image, tags } = req.body;
        const userId = req.user.id;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'Login to create post' });
        }
        const post = new Post({
            user_id: userId,
            content,
            image,
            tags,
            reaction_count: 0,
            comment_count: 0,
        });
        await post.save();
        res.status(201).json({
            message: 'Post created successfully',
            post: {
                id: post._id,
                user_id: post.user_id,
                content: post.content,
                image: post.image,
                tags: post.tags,
                reaction_count: post.reaction_count,
                comment_count: post.comment_count,
                post_date: post.post_date,
            }
        });
    } catch (error) {
        console.error('Error creating post:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports.getAllPosts = async (req, res) => {
    try {
        const post = await Post.find().populate('user_id', 'name email avatar_url')
            .populate('tags', 'title description')
            .sort({ post_date: -1 });

        res.status(200).json({ post });
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports.likePost = async (req, res) => {
    try {
        const postId = req.params.id;
        const userId = req.user.id;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'Login to like post' });
        }
        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        if (!post.like_user_ids.includes(userId)) {
            post.like_user_ids.push(userId);
            post.reaction_count++;
        } else {
            post.like_user_ids = post.like_user_ids.filter(id => id.toString() !== userId)
            post.reaction_count--;
        }
        await post.save();

        res.status(200).json({
            message: 'Post liked successfully',
            post: {
                id: post._id,
                user_id: post.user_id,
                content: post.content,
                image: post.image,
                tags: post.tags,
                reaction_count: post.reaction_count,
                comment_count: post.comment_count,
                post_date: post.post_date,
            }
        });
    } catch (error) {
        console.error('Error liking post:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports.deletePost = async (req, res) => {
    try {
        const postId = req.params.id;
        const userId = req.user.id;

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        if (post.user_id.toString() !== userId) {
            return res.status(401).json({ message: 'You are not authorized to delete this post' });
        }

        await Post.deleteOne({ _id: postId });
        res.status(200).json({ message: 'Post deleted sucessfully' });

    } catch (error) {
        console.error('Error deleting post:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports.editPost = async (req, res) => {
    try {
        const postId = req.params.id;
        const userId = req.user.id;
        const { content, image, tags } = req.body;

        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        if (post.user_id.toString() !== userId) {
            return res.status(401).json({ message: 'You are not authorized to edit this post' });
        }

        post.content = content;
        post.image = image;
        post.tags = tags;
        await post.save();

        res.status(200).json({
            message: 'Post edited successfully',
            post: {
                id: post._id,
                user_id: post.user_id,
                content: post.content,
                image: post.image,
                tags: post.tags,
                reaction_count: post.reaction_count,
                comment_count: post.comment_count,
                post_date: post.post_date,
            }
        });
    } catch (error) {
        console.error('Error editing post:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports.getPostByUserId = async (req, res) => {
    try {
        const userId = req.params.id;
        const posts = await Post.find({ user_id: userId }).populate('user_id', 'name email avatar_url')
            .populate('tags', 'title description')
            .sort({ post_date: -1 });

        res.status(200).json({ posts });
    } catch (error) {
        console.error('Error fetching posts by user ID:', error);
        res.status(500).json({ message: 'Internal server error' })
    }
};

module.exports.getPostByTagId = async (req, res) => {
    try {
        const tagId = req.params.id;
        const posts = await Post.find({ tags: tagId }).populate('user_id', 'name email avatar_url')
            .populate('tags', 'title description')
            .sort({ post_date: -1 });

        res.status(200).json({ posts });
    } catch (error) {
        console.error('Error fetching posts by tag ID:', error);
        res.status(500).json({ message: 'Internal server error' })
    }
};