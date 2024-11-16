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

export enum TODO_STATUS {
  EN_ATTENTE = "EN_ATTENTE",
  EN_COURS = "EN_COURS",
  TERMINEE = "TERMINEE",
  ARCHIVEE = "ARCHIVEE"
} 