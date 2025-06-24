import React from "react";
import { Avatar, Button, Input } from "antd";
import { Heart, MessageSquare, MoreHorizontal, Send } from "lucide-react";

const PostCard = ({ postData }) => {
  const { user, post } = postData;

  return (
    // Thay đổi lớn: Dùng div với custom style thay cho Card mặc định
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20">
      {/* Post Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Avatar src={user.avatar} size={48} />
          <div>
            <p className="font-bold text-white">{user.name}</p>
            <p className="text-xs text-gray-400">
              {new Date(post.post_date).toLocaleString()}
            </p>
          </div>
        </div>
        <Button
          type="text"
          icon={<MoreHorizontal size={20} className="text-gray-400" />}
        />
      </div>

      {/* Post Content */}
      <p className="mb-4 text-gray-200">{post.content}</p>

      {/* Post Actions */}
      <div className="flex items-center gap-6 text-gray-400 mb-4">
        <button className="flex items-center gap-2 hover:text-red-500 transition-colors">
          <Heart size={20} />
          <span>{post.reaction_count} Likes</span>
        </button>
        <button className="flex items-center gap-2 hover:text-cyan-400 transition-colors">
          <MessageSquare size={20} />
          <span>{post.comments.length} Comments</span>
        </button>
      </div>

      {/* Comments Section */}
      <div className="border-t border-white/10 pt-4 space-y-4">
        {post.comments.map((comment) => (
          <div key={comment.comment_id} className="flex items-start gap-3">
            <Avatar src={comment.user.avatar} size={32} />
            <div className="bg-white/5 p-3 rounded-lg w-full">
              <p className="font-semibold text-sm text-white">
                {comment.user.name}
              </p>
              <p className="text-sm text-gray-300">{comment.comment_text}</p>
            </div>
          </div>
        ))}
        {/* Comment Input */}
        <div className="flex items-center gap-3 pt-2">
          <Avatar src="https://i.pravatar.cc/150?img=5" size={32} />
          <Input
            placeholder="Write a comment..."
            className="bg-white/5 border-white/10 text-white rounded-full focus:border-purple-500"
            suffix={
              <Send
                size={16}
                className="cursor-pointer text-gray-400 hover:text-white"
              />
            }
          />
        </div>
      </div>
    </div>
  );
};

export default PostCard;
