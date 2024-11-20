import { useApi } from "@/composable/useApi";
import { useAuthStore } from "@/stores/auth";
import type { ResponseApi } from "@/types/reponseApi";

export const useApiAdminUser = () => {
  const authStore = useAuthStore();
  const api = useApi({ authToken: authStore.data?.token });

  const fetchUsers = async (): Promise<ResponseApi> => {
    try {
      const response = (await api.get("/api/admin/users/all")) as ResponseApi;
      if (!response.success || !response.data)
        throw new Error("Erreur lors du chargement des utilisateurs");

      return response;
    } catch (error) {
      throw error;
    }
  };

  const fetchUserTodos = async (userId: number): Promise<ResponseApi> => {
    try {
      const response = (await api.get(
        `/api/admin/users/${userId}/todos`
      )) as ResponseApi;
      return response;
    } catch (error) {
      throw error;
    }
  };

  return {
    fetchUsers,
    fetchUserTodos,
  };
};
