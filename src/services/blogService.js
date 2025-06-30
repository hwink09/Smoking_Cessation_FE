const BLOGS_KEY = "blogs";

const BlogService = {
  getAllBlogs: () => {
    const saved = localStorage.getItem(BLOGS_KEY);
    return saved ? JSON.parse(saved) : [];
  },
  createBlog: (blog) => {
    const blogs = BlogService.getAllBlogs();
    const newBlog = { ...blog, id: Date.now() };
    const updated = [...blogs, newBlog];
    localStorage.setItem(BLOGS_KEY, JSON.stringify(updated));
    return updated;
  },
  updateBlog: (id, blog) => {
    const blogs = BlogService.getAllBlogs();
    const updated = blogs.map((b) => (b.id === id ? { ...blog, id } : b));
    localStorage.setItem(BLOGS_KEY, JSON.stringify(updated));
    return updated;
  },
  deleteBlog: (id) => {
    const blogs = BlogService.getAllBlogs();
    const updated = blogs.filter((b) => b.id !== id);
    localStorage.setItem(BLOGS_KEY, JSON.stringify(updated));
    return updated;
  },
};

export default BlogService;
