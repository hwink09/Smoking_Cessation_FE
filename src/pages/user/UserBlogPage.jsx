import { useState, useEffect } from "react";
import CreateBlog from "~/components/user/blog/CreateBlog";
import MyPosts from "~/components/user/blog/MyPosts";
import { usePostData } from "~/hooks/usePostData";
import ColourfulText from "~/components/ui/colourful-text";

function UserBlogPage() {
  const { createPost, getPostsByUserId, tags = [] } = usePostData();

  const [currentView, setCurrentView] = useState("myPosts");
  const [userPosts, setUserPosts] = useState([]);

  const fetchUserPosts = async () => {
    const userString = localStorage.getItem("user");
    const user = userString ? JSON.parse(userString) : null;
    const userId = user?.userId || user?._id || user?.id;
    if (!userId) return;

    try {
      const posts = await getPostsByUserId(userId);
      setUserPosts(posts);
    } catch (error) {
      console.error("Error fetching user posts:", error);
    }
  };

  useEffect(() => {
    fetchUserPosts();
  }, [currentView]);

  // Kiểm tra và reload khi có thay đổi like
  useEffect(() => {
    const checkForUpdates = () => {
      const shouldReload = localStorage.getItem("should_reload_blog_list");
      if (shouldReload === "true") {
        fetchUserPosts();
        localStorage.removeItem("should_reload_blog_list");
      }
    };

    // Kiểm tra định kỳ mỗi 2 giây
    const interval = setInterval(checkForUpdates, 2000);

    return () => clearInterval(interval);
  }, []);

  const handlePostCreate = async (newPost) => {
    try {
      const createdPost = await createPost({
        ...newPost,
        author: "user",
        data: new Date().toISOString(),
        like: 0,
        comment: 0,
      });

      setUserPosts((prev) => [createdPost, ...prev]);
      await fetchUserPosts(); // Refresh posts after creation
      setCurrentView("myPosts");
    } catch (error) {
      console.error("Failed to create post:", error);
    }
  };

  // if (currentView === "detail" && selectedPost) {
  //   return (
  //     <BlogDetail
  //       post={selectedPost}
  //       onBack={() => {
  //         setCurrentView("myPosts");
  //         fetchUserPosts(); // Refresh posts khi quay lại
  //       }}
  //       onPostClick={(post) => setSelectedPost(post)}
  //       relatedPosts={userPosts.filter((p) => p._id !== selectedPost._id)}
  //     />
  //   );
  // }

  if (currentView === "create") {
    return (
      <div className="min-h-screen text-slate-800 p-4 max-w-6xl mx-auto">
        <div className="text-center mb-8 bg-gradient-to-br from-purple-50 via-white to-blue-50 p-8 rounded-2xl shadow-md border border-blue-200">
          <div className="relative mb-10">
            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-purple-400 to-blue-500 rounded-full"></div>

            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-700 via-blue-700 to-cyan-700 bg-clip-text text-transparent mb-4 pb-2 border-b-2 border-blue-200 inline-block">
              Tạo <ColourfulText text="bài viết mới" />
            </h1>

            <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
              Chia sẻ câu chuyện và kinh nghiệm bỏ thuốc của bạn với cộng đồng!
            </p>
          </div>
        </div>

        <CreateBlog
          onSubmit={handlePostCreate}
          onCancel={() => setCurrentView("myPosts")}
          tags={tags}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen text-slate-800 p-4 max-w-6xl mx-auto">
      <div className="text-center mb-8 bg-gradient-to-br from-purple-50 via-white to-blue-50 p-8 rounded-2xl shadow-md border border-blue-200">
        <div className="relative mb-10">
          <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-purple-400 to-blue-500 rounded-full"></div>

          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-700 via-blue-700 to-cyan-700 bg-clip-text text-transparent mb-4 pb-2 border-b-2 border-blue-200 inline-block">
            Bài viết <ColourfulText text="của tôi" />
          </h1>

          <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
            Quản lý và theo dõi các bài viết bạn đã chia sẻ với cộng đồng!
          </p>
        </div>
      </div>

      <MyPosts
        posts={userPosts}
        refetchUserPosts={fetchUserPosts}
        onPostClick={() => {
          setCurrentView("detail");
        }}
        onCreateNew={() => setCurrentView("create")}
      />
    </div>
  );
}

export default UserBlogPage;
