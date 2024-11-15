export interface Task {
  id: number;
  title: string;
  status: string;
  completed: boolean;
  createdAt: string;
  userId: number;
}

export interface Column {
  name: string;
  tasks: Task[];
} 