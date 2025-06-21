import React from "react";
import { Avatar, Input, Button } from "antd";
import { Image, Video, Send } from "lucide-react";

const CreatePost = () => {
  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20 mb-8">
      <div className="flex items-start gap-4">
        <Avatar src="https://i.pravatar.cc/150?img=5" size={48} />
        <div className="w-full">
          <Input.TextArea
            rows={3}
            placeholder="Share your victories, ask for help, or just say hi!"
            className="bg-white/5 border-white/10 text-white placeholder-gray-400 focus:border-purple-500 !p-4 !rounded-lg"
          />
          <div className="flex justify-between items-center mt-4">
            <div className="flex gap-4">
              <button className="text-gray-400 hover:text-green-400 transition-colors">
                <Image size={20} />
              </button>
              <button className="text-gray-400 hover:text-blue-400 transition-colors">
                <Video size={20} />
              </button>
            </div>
            <Button
              type="primary"
              icon={<Send size={16} />}
              className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 border-none">
              Post
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
