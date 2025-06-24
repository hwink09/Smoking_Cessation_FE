// Dữ liệu này mô phỏng dữ liệu từ các bảng User, Post, Comment trong ERD của đệ
export const communityPosts = [
  {
    id: 1,
    user: {
      name: "Trần Văn An",
      avatar: "https://i.pravatar.cc/150?img=1",
      role: "Member",
    },
    post: {
      postId: 101,
      content:
        "Hôm nay là ngày thứ 30 mình không hút điếu nào! Cảm giác thật tuyệt vời. Cảm ơn mọi người đã đồng hành!",
      post_date: "2025-06-18T10:00:00Z",
      reaction_count: 15,
      comments: [
        {
          comment_id: 201,
          user: {
            name: "Lê Thị Bình",
            avatar: "https://i.pravatar.cc/150?img=2",
          },
          comment_text: "Chúc mừng bạn nhé! Cố lên!",
          comment_date: "2025-06-18T10:05:00Z",
        },
        {
          comment_id: 202,
          user: {
            name: "Coach Hùng",
            avatar: "https://i.pravatar.cc/150?img=3",
          },
          comment_text: "Làm tốt lắm An! Hãy tiếp tục duy trì nhé.",
          comment_date: "2025-06-18T11:30:00Z",
        },
      ],
    },
  },
  {
    id: 2,
    user: {
      name: "Phạm Thị Dung",
      avatar: "https://i.pravatar.cc/150?img=4",
      role: "Member",
    },
    post: {
      postId: 102,
      content:
        "Mọi người có cách nào để vượt qua cơn thèm thuốc lúc uống cà phê buổi sáng không ạ? :(",
      post_date: "2025-06-19T08:30:00Z",
      reaction_count: 5,
      comments: [],
    },
  },
];
