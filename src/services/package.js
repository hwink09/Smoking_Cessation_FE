import api from "./api";

const PackageService = {
  getAllPackages: async () => {
    const response = await api.get("/packages");
    return response.data;
  },
};

export default PackageService;
