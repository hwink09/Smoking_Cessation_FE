import api from "./api";

const SubscriptionService = {
  // POST /api/subscriptions - Create
  createSubscription: async (data) => {
    try {
      const response = await api.post("/subscriptions", data);
      return response.data;
    } catch (error) {
      console.error("Error creating subscription:", error);
      throw error;
    }
  },

  // POST /api/subscriptions/{id} - Create (with ID parameter)
  createSubscriptionWithId: async (id, data) => {
    try {
      const response = await api.post(`/subscriptions/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(`Error creating subscription with id ${id}:`, error);
      throw error;
    }
  },

  // GET /api/subscriptions - GetAll
  getAllSubscriptions: async () => {
    try {
      const response = await api.get("/subscriptions");
      return response.data;
    } catch (error) {
      console.error("Error fetching subscriptions:", error);
      throw error;
    }
  },

  // GET /api/subscriptions/{id} - GetByID
  getSubscriptionById: async (id) => {
    try {
      const response = await api.get(`/subscriptions/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching subscription ${id}:`, error);
      throw error;
    }
  },

  // PUT /api/subscriptions/{id} - Update
  updateSubscription: async (id, data) => {
    try {
      const response = await api.put(`/subscriptions/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(`Error updating subscription ${id}:`, error);
      throw error;
    }
  },

  // DELETE /api/subscriptions/{id} - Delete
  deleteSubscription: async (id) => {
    try {
      const response = await api.delete(`/subscriptions/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting subscription ${id}:`, error);
      throw error;
    }
  },

  // GET /api/subscriptions/my-active-subscription - Get user's active subscription
  getMyActiveSubscription: async () => {
    try {
      const response = await api.get("/subscriptions/my-active-subscription");
      return response.data;
    } catch (error) {
      console.error("Error fetching user's active subscription:", error);
      throw error;
    }
  },
};

export default SubscriptionService;
