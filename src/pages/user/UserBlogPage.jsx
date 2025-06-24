import { useState, useEffect } from "react";
import CreateBlog from "~/components/user/blog/CreateBlog";
import MyPosts from "~/components/user/blog/MyPosts";
import UserBlogDetail from "~/components/user/blog/UserBlogDetail";
import { usePostData } from "~/hooks/usePostData";


function UserBlogPage() {
  const {
    createPost,
    getPostsByUserId,
    tags = [],
  } = usePostData();

  const [currentView, setCurrentView] = useState("myPosts");
  const [selectedPost, setSelectedPost] = useState(null);
  const [userPosts, setUserPosts] = useState([]);

  const fetchUserPosts = async () => {
    const userString = localStorage.getItem("user");
    const user = userString ? JSON.parse(userString) : null;
    if (!user?.id) {
      console.log("Không tìm thấy user id khi fetchUserPosts");
      return;
    }
    console.log("Gọi fetchUserPosts với userId:", user.id);
    try {
      const posts = await getPostsByUserId(user.id);
      console.log("Kết quả fetchUserPosts:", posts);
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
      console.log("Tạo post với dữ liệu:", newPost);
      await createPost({
        ...newPost,
        author: "user",
        data: new Date().toISOString(),
        like: 0,
        comment: 0,
      });
      console.log("Tạo post thành công, gọi lại fetchUserPosts");
      await fetchUserPosts(); // Chỉ cần gọi lại fetchUserPosts để cập nhật danh sách
      setCurrentView("myPosts");
    } catch (error) {
      console.error("Failed to create post:", error);
    }
  };

  if (currentView === "detail" && selectedPost) {
    console.log("Chuyển sang view detail với post:", selectedPost);
    return (
      <UserBlogDetail
        post={selectedPost}
        onBack={() => {
          setCurrentView("myPosts");
          fetchUserPosts(); // Refresh posts khi quay lại
        }}
        onPostClick={(post) => setSelectedPost(post)}
        relatedPosts={userPosts.filter((p) => p._id !== selectedPost._id)}
      />
    );
  }

  if (currentView === "create") {
    console.log("Chuyển sang view tạo bài viết mới");
    return (
      <CreateBlog
        onSubmit={handlePostCreate}
        onCancel={() => setCurrentView("myPosts")}
        tags={tags}
      />
    );
  }

  console.log("Render view danh sách bài viết, số lượng:", userPosts.length);
  return (
    <MyPosts
      posts={userPosts}
      refetchUserPosts={fetchUserPosts} 
      onPostClick={(post) => {
        console.log("Chọn post để xem chi tiết:", post);
        setSelectedPost(post);
        setCurrentView("detail");
      }}
      onCreateNew={() => {
        console.log("Bấm nút tạo bài viết mới");
        setCurrentView("create");
      }}
    />
  );
}

export default UserBlogPage;
