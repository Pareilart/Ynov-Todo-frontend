import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { Column } from '@/types/todo'

export const useKanbanStore = defineStore('kanban', () => {
  // État
  const columns = ref<Column[]>([
    { name: 'À faire', tasks: [] },
    { name: 'En cours', tasks: [] },
    { name: 'Terminé', tasks: [] },
    { name: 'Archivé', tasks: [] },
  ])

  // Actions
  const addTask = (columnName: string, taskName: string): void => {
    const column = columns.value.find(col => col.name === columnName)
    if (!column || !taskName.trim()) return

    const task = {
      id: Date.now(),
      name: taskName.trim(),
      completed: false
    }

    column.tasks.push(task)
  }

  const toggleTaskComplete = (taskId: number): void => {
    columns.value.forEach(column => {
      const task = column.tasks.find(t => t.id === taskId)
      if (task) {
        task.completed = !task.completed
      }
    })
  }

  const deleteTask = (taskId: number): void => {
    columns.value.forEach(column => {
      const taskIndex = column.tasks.findIndex(t => t.id === taskId)
      if (taskIndex !== -1) {
        column.tasks.splice(taskIndex, 1)
      }
    })
  }

  // Getters
  const getColumnByName = computed(() => {
    return (name: string) => columns.value.find(col => col.name === name)
  })

  return { 
    columns,
    addTask,
    toggleTaskComplete,
    getColumnByName,
    deleteTask
  }
}, { persist: true }) 