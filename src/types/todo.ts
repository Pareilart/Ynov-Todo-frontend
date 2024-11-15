export interface Task {
  id: number;
  name: string;
  completed: boolean;
}

export interface Column {
  name: string;
  tasks: Task[];
} 