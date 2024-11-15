<template>
  <div class="todos">
    <h1>Mes Todos</h1>
    
    <!-- Formulaire d'ajout -->
    <div class="add-todo bg-red-100">
      <input 
        v-model="newTodo" 
        @keyup.enter="addTodo"
        placeholder="Nouvelle tâche..."
      >
      <button @click="addTodo">Ajouter</button>
    </div>

    <!-- Filtres -->
    <div class="filters">
      <button 
        v-for="filter in filters" 
        :key="filter"
        :class="{ active: currentFilter === filter }"
        @click="currentFilter = filter"
      >
        {{ filter }}
      </button>
    </div>

    <!-- Liste des todos -->
    <ul class="todo-list">
      <li v-for="todo in filteredTodos" :key="todo.id" :class="{ archived: todo.archived }">
        <span class="todo-text">{{ todo.text }}</span>
        <div class="actions">
          <button @click="toggleArchive(todo)">
            {{ todo.archived ? 'Désarchiver' : 'Archiver' }}
          </button>
          <button @click="deleteTodo(todo)" class="delete">Supprimer</button>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface Todo {
  id: number
  text: string
  archived: boolean
}

const todos = ref<Todo[]>([])
const newTodo = ref('')
const filters = ['Tous', 'Actifs', 'Archivés']
const currentFilter = ref('Tous')

const addTodo = () => {
  if (newTodo.value.trim()) {
    todos.value.push({
      id: Date.now(),
      text: newTodo.value,
      archived: false
    })
    newTodo.value = ''
  }
}

const deleteTodo = (todo: Todo) => {
  const index = todos.value.findIndex(t => t.id === todo.id)
  todos.value.splice(index, 1)
}

const toggleArchive = (todo: Todo) => {
  todo.archived = !todo.archived
}

const filteredTodos = computed(() => {
  switch (currentFilter.value) {
    case 'Actifs':
      return todos.value.filter(todo => !todo.archived)
    case 'Archivés':
      return todos.value.filter(todo => todo.archived)
    default:
      return todos.value
  }
})
</script>

<style scoped>
.todos {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

.add-todo {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.add-todo input {
  flex: 1;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.filters {
  margin-bottom: 20px;
  display: flex;
  gap: 10px;
}

.filters button {
  padding: 5px 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
  cursor: pointer;
}

.filters button.active {
  background: #4CAF50;
  color: white;
  border-color: #4CAF50;
}

.todo-list {
  list-style: none;
  padding: 0;
}

.todo-list li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  margin-bottom: 5px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.todo-list li.archived {
  background-color: #f5f5f5;
  text-decoration: line-through;
}

.actions {
  display: flex;
  gap: 5px;
}

button {
  padding: 5px 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
  cursor: pointer;
}

button:hover {
  background: #f5f5f5;
}

button.delete {
  color: #ff4444;
  border-color: #ff4444;
}

button.delete:hover {
  background: #ffe5e5;
}
</style> 