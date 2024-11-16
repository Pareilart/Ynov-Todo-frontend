import { ref, computed } from "vue";
import { defineStore } from "pinia";
import type { Column, Task } from "@/types/todo";
import { useApiTodo } from "@/api/apiTodo";
import { useAuthStore } from "@/stores/auth";

export const useKanbanStore = defineStore(
  "kanban",
  () => {
    const authStore = useAuthStore();
    const apiTodo = useApiTodo();

    // État
    const columns = ref<Column[]>([
      { name: "EN_ATTENTE", tasks: [] },
      { name: "EN_COURS", tasks: [] },
      { name: "TERMINE", tasks: [] },
      { name: "ARCHIVE", tasks: [] },
    ]);

    // Actions
    const addTask = async (
      columnName: string,
      task: Partial<Task>
    ): Promise<Task | null> => {
      const title = task.title?.trim();

      if (!title)
        throw new Error("Le titre de la tâche ne peut pas être vide.");

      const column = columns.value.find((col) => col.name === columnName);
      if (!column)
        throw new Error(
          `La colonne "${columnName}" est introuvable. Assurez-vous que le nom de la colonne est correct.`
        );

      if (
        task.id &&
        columns.value.some((col) => col.tasks.some((t) => t.id === task.id))
      ) {
        return null;
      }

      try {
        const newTask = await apiTodo.createTodo({
          title,
          status: columnName,
        });

        if (!newTask?.success) throw new Error(newTask.message);

        column.tasks.push(newTask.data);
        return newTask.data;
      } catch (error) {
        throw error;
      }
    };

    const toggleTaskComplete = async (taskId: number): Promise<Task> => {
      // Recherche de la tâche
      const currentTask = columns.value
        .flatMap((column) => column.tasks)
        .find((task) => task.id === taskId);

      if (!currentTask) throw new Error("Tâche introuvable.");

      try {
        const currentTaskData = await apiTodo.toggleCompletion(taskId);
        if (!currentTaskData?.success) throw new Error(currentTaskData.message);
        return currentTaskData.data;
      } catch (error) {
        throw error;
      }
    };

    const deleteTask = async (taskId: number): Promise<void> => {
      if (
        !(authStore.hasPermission("delete:todos") && authStore.hasRole("ADMIN"))
      )
        throw new Error(
          "Vous n'avez pas les permissions pour supprimer une tâche"
        );

      try {
        const columnWithTask = columns.value.find((column) =>
          column.tasks.some((task) => task.id === taskId)
        );

        if (!columnWithTask) throw new Error("Tâche introuvable.");

        const response = await apiTodo.deleteTodo(taskId);
        if (!response?.success) throw new Error(response.message);

        columnWithTask.tasks = columnWithTask.tasks.filter(
          (task) => task.id !== taskId
        );

        return;
      } catch (error) {
        console.error("Erreur lors de la suppression de la tâche:", error);
        throw error;
      }
    };

    const fetchTasks = async (): Promise<boolean> => {
      try {
        const todos = await apiTodo.fetchTodos();
        if (todos?.success && todos.data) {
          // Réinitialiser les tâches dans les colonnes
          columns.value.forEach((column) => {
            column.tasks = [];
          });

          // Ajouter les tâches aux bonnes colonnes en fonction de leur statut
          todos.data.forEach((task: Task) => {
            const column = columns.value.find(
              (col) => col.name === task.status
            );
            if (column) {
              column.tasks.push(task);
            }
          });
        }
        return true;
      } catch (error) {
        console.error("Erreur lors du chargement des tâches:", error);
        return false;
      }
    };

    return {
      columns,
      addTask,
      toggleTaskComplete,
      deleteTask,
      fetchTasks,
    };
  },
  { persist: true }
);
