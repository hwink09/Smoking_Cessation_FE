import { useState, useCallback } from "react";
import userService from "~/services/userService";

const useUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await userService.getAllUser();
      setUsers(data.users || []);
      return data.users || [];
    } catch (err) {
      setError(
        err.response?.data?.message || "Không thể tải danh sách người dùng"
      );
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const getUserById = useCallback(
    (id) => {
      return users.find((user) => user.id === id);
    },
    [users]
  );

  const editUser = useCallback(
    async (id, userData) => {
      setLoading(true);
      setError(null);
      try {
        const result = await userService.editUser(id, userData);
        await fetchUsers(); // Refresh danh sách
        return result;
      } catch (err) {
        setError(
          err.response?.data?.message || "Không thể chỉnh sửa người dùng"
        );
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchUsers]
  );

  const deleteUser = useCallback(
    async (id) => {
      setLoading(true);
      setError(null);
      try {
        const result = await userService.deleteUser(id);
        await fetchUsers(); // Refresh danh sách
        return result;
      } catch (err) {
        setError(err.response?.data?.message || "Không thể xóa người dùng");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchUsers]
  );

  return {
    users,
    loading,
    error,
    fetchUsers,
    getUserById,
    editUser,
    deleteUser,
  };
};

export default useUsers;
