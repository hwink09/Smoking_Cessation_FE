import api from "./api";

const userService = {
    getAllUser: async () => {
        try {
            const response = await api.get("/user");
            return response.data;
        } catch (error) {
            console.error("Error fetching users:", error);
            throw error;
        }
    },

    editUser: async (id, data) => {
        try {
            const response = await api.put(`/user/${id}`, data)
            return response.data;
        } catch (error) {
            console.error("Error fetching users:", error);
            throw error;
        }
    },

    deleteUser: async (id) => {
        try {
            const response = await api.delete(`/user/${id}`)
            return response.data;
        } catch (error) {
            console.error("Error fetching users:", error);
            throw error;
        }
    }

}

export default userService