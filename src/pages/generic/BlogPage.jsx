import { useEffect, useState } from "react";
import BlogCard from "~/components/generic/blog/BlogCard";
import FilterBar from "~/components/generic/blog/FilterBar";
import { usePostData } from "~/hooks/usePostData";


function BlogPage() {
  const { posts, loading, error, tags, refetchPosts, likePost } = usePostData(); 
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);

  useEffect(() => {
    const handleFocus = () => {
      refetchPosts();
    };

    window.addEventListener("focus", handleFocus);
    return () => {
      window.removeEventListener("focus", handleFocus);
    };
  }, [refetchPosts]);

  // Kiểm tra và reload khi có thay đổi like
  // useEffect(() => {
  //   const checkForUpdates = () => {
  //     const shouldReload = localStorage.getItem("should_reload_blog_list");
  //     if (shouldReload === "true") {
  //       refetchPosts();
  //       localStorage.removeItem("should_reload_blog_list");
  //     }
  //   };
  //   checkForUpdates();
  //   const interval = setInterval(checkForUpdates, 2000);
  //   return () => clearInterval(interval);
  // }, [refetchPosts]);

  const filteredPosts = (posts || []).filter((post) => {
    const matchesSearch =
      !searchTerm ||
      post.content.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesTags =
      selectedTags.length === 0 ||
      post.tags?.some((tag) => selectedTags.includes(tag._id));

    return matchesSearch && matchesTags;
  });

  const handleFilterChange = (filters) => {
    if (filters.searchTerm !== undefined) setSearchTerm(filters.searchTerm);
  };

  const handleTagToggle = (tagId) => {
    setSelectedTags((prev) =>
      prev.includes(tagId)
        ? prev.filter((id) => id !== tagId)
        : [...prev, tagId]
    );
  };

  console.log("BlogPage render");

  return (
    <div className="flex flex-col bg-white">
      <div className="flex-1 min-w-0 pt-6">
        <FilterBar
          onFilterChange={handleFilterChange}
          tags={tags}
          selectedTags={selectedTags}
          onTagToggle={handleTagToggle}
        />

        <div className="max-w-screen-xl mx-auto w-full px-4 md:px-8">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
            </div>
          ) : error ? (
            <div className="text-center text-red-600 p-4">Error: {error}</div>
          ) : (
            <BlogList posts={filteredPosts} likePost={likePost} refetchPosts={refetchPosts} />
          )}
        </div>
      </div>
    </div>
  );
}

const BlogList = ({ posts, likePost, refetchPosts }) => {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Bài viết mới nhất ({posts.length})
        </h2>
      </div>

      {posts.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <BlogCard key={post._id} post={post} likePost={likePost} refetchPosts={refetchPosts} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            Không tìm thấy bài viết nào phù hợp.
          </p>
        </div>
      )}
    </div>
  );
};

export default BlogPage;
