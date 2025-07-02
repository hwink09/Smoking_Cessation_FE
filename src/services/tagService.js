import api from "./api";

const tagService = {
  // GET /api/tags
  getAllTags: async () => {
    try {
      const response = await api.get("/tags");
      return response.data;
    } catch (error) {
      console.error("Error fetching tags:", error);
      throw error;
    }
  },

  // POST /api/tags/create
  createTag: async (tagData) => {
    try {
      const response = await api.post("/tags/create", tagData);
      return response.data;
    } catch (error) {
      console.error("Error creating tag:", error);
      throw error;
    }
  },
};

export default tagService;
