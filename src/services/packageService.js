import api from "./api";

const PackageService = {
  // POST /api/packages - Create Package
  createPackage: async (packageData) => {
    try {
      const response = await api.post("/packages", packageData);
      return response.data;
    } catch (error) {
      console.error("Error creating package:", error);
      throw error;
    }
  },

  // GET /api/packages - Get All Package
  getAllPackages: async () => {
    try {
      const response = await api.get("/packages");
      return response.data;
    } catch (error) {
      console.error("Error fetching packages:", error);
      throw error;
    }
  },

  // GET /api/packages/:id - Get Package By Id
  getPackageById: async (id) => {
    try {
      const response = await api.get(`/packages/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching package ${id}:`, error);
      throw error;
    }
  },

  // PUT /api/packages/:id - Update Package
  updatePackage: async (id, packageData) => {
    try {
      const response = await api.put(`/packages/${id}`, packageData);
      return response.data;
    } catch (error) {
      console.error(`Error updating package ${id}:`, error);
      throw error;
    }
  },

  // DELETE /api/packages/:id - Delete Package
  deletePackage: async (id) => {
    try {
      const response = await api.delete(`/packages/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting package ${id}:`, error);
      throw error;
    }
  },
};

export default PackageService;
