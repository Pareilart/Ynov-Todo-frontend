import type { Task } from "@/types/todo";
import { useApi } from "@/composable/useApi";
import { useAuthStore } from "@/stores/auth";
import type { ResponseApi } from "@/types/reponseApi";

export const useApiTodo = () => {
  const authStore = useAuthStore();
  const api = useApi({ authToken: authStore.data?.token });

  const fetchTodos = async (): Promise<ResponseApi> => {
    try {
      const response = (await api.get("/api/todos")) as ResponseApi;
      if (!response.success || !response.data)
        throw new Error("Erreur lors du chargement des tâches");

      return response;
    } catch (error) {
      throw error;
    }
  };

  const createTodo = async (task: Partial<Task>): Promise<ResponseApi> => {
    if (!task.title || !task.status)
      throw new Error(
        "Les champs 'title' et 'status' sont requis pour créer une tâche"
      );

    try {
      const response = (await api.post(
        "/api/todos/create",
        task
      )) as ResponseApi;

      if (!response.success || !response.data)
        throw new Error("Échec de la création de la tâche");

      return response;
    } catch (error) {
      console.error("Erreur lors de la création du todo:", error);
      throw error;
    }
  };

  const toggleCompletion = async (taskId: number): Promise<ResponseApi> => {
    try {
      const response = (await api.patch(
        `/api/todos/toggle-completion/${taskId}`
      )) as ResponseApi;

      if (!response.success || !response.data)
        throw new Error(
          response.message ||
            "Erreur lors du basculement de l'état de complétion"
        );

      return response;
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la tâche:", error);
      throw error;
    }
  };

  const deleteTodo = async (
    taskId: number
  ): Promise<{ data: Task; message: string; success: boolean }> => {
    try {
      if (!authStore.hasPermission("delete:todos"))
        throw new Error(
          "Vous n'avez pas les permissions pour supprimer une tâche"
        );

      const response = (await api.delete(`/api/todos/delete/${taskId}`)) as {
        data: Task;
        message: string;
        success: boolean;
      };

      if (!response.success)
        throw new Error("Erreur lors de la suppression de la tâche");

      return response;
    } catch (error) {
      throw error;
    }
  };

  return {
    fetchTodos,
    createTodo,
    toggleCompletion,
    deleteTodo,
  };
};
