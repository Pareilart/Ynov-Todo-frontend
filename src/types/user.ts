export interface User {
  user: {
    id: number;
    name: string;
    email: string;
    createdAt: string;
  };
  token: string;
  refreshToken: string;
}
