import { ref, computed } from "vue";
import { defineStore } from "pinia";
import type { Column, Task } from "@/types/todo";
import { useApi } from "@/composable/useApi";
import { useAuthStore } from "@/stores/auth";

export const useKanbanStore = defineStore(
  "kanban",
  () => {
    const authStore = useAuthStore();
    const api = useApi({ authToken: authStore.data?.token });

    // État
    const columns = ref<Column[]>([
      { name: "EN_ATTENTE", tasks: [] },
      { name: "EN_COURS", tasks: [] },
      { name: "TERMINE", tasks: [] },
      { name: "ARCHIVE", tasks: [] },
    ]);

    // Actions
    const addTask = (columnName: string, task: Partial<Task>) => {
      if (!task.title?.trim() || !authStore.data?.user?.id) return;

      const userId = authStore.data.user.id;
      const title = task.title.trim();
      const column = columns.value.find((col) => col.name === columnName);

      if (!column) return;

      if (
        task.id &&
        columns.value.some((col) => col.tasks.some((t) => t.id === task.id))
      )
        return;

      const newTask: Task = {
        id: task.id ?? Date.now(),
        title,
        status: columnName,
        completed: task.completed ?? false,
        createdAt: task.createdAt ?? new Date().toISOString(),
        userId,
      };

      column.tasks.push(newTask);
    };

    const toggleTaskComplete = (taskId: number): void => {
      columns.value.forEach((column) => {
        const task = column.tasks.find((t) => t.id === taskId);
        if (task) {
          task.completed = !task.completed;
        }
      });
    };

    const deleteTask = (taskId: number): void => {
      columns.value.forEach((column) => {
        const taskIndex = column.tasks.findIndex((t) => t.id === taskId);
        if (taskIndex !== -1) {
          column.tasks.splice(taskIndex, 1);
        }
      });
    };

    // Nouvelle action pour récupérer les todos
    const fetchTodos = async (): Promise<Task[]> => {
      try {
        const { data, success } = (await api.get("/api/todos")) as {
          data: Task[];
          success: boolean;
        };

        return success ? data : [];
      } catch (error) {
        throw error;
      }
    };

    // Nouvelle action pour créer un todo
    const apiPostCreateTodo = async (task: Partial<Task>): Promise<Task> => {
      try {
        const response = await api.post("/api/todos/create", task);
        const { data, success } = response as { data: Task; success: boolean };

        if (success && data) {
          addTask(data.status, data);
          return data;
        }

        throw new Error("Échec de la création de la tâche");
      } catch (error) {
        console.error("Erreur lors de la création du todo:", error);
        throw error;
      }
    };

    const apiPatchToggleCompletion = async (
      taskId: number
    ): Promise<Task | null> => {
      try {
        const currentTask = columns.value
          .flatMap((column) => column.tasks)
          .find((task) => task.id === taskId);
        if (!currentTask) return null;

        const { data, success } = (await api.patch(
          `/api/todos/toggle-completion/${taskId}`
        )) as { data: Task; success: boolean };

        if (!success)
          throw new Error("Erreur lors du basculement de l'état de complétion");

        currentTask.completed = data.completed;
        toggleTaskComplete(taskId);
        return data;
      } catch (error) {
        throw error;
      }
    };

    // Getters
    const getColumnByName = computed(() => {
      return (name: string) => columns.value.find((col) => col.name === name);
    });

    return {
      columns,
      addTask,
      toggleTaskComplete,
      getColumnByName,
      deleteTask,
      fetchTodos,
      apiPostCreateTodo,
      apiPatchToggleCompletion,
    };
  },
  { persist: true }
);
