export interface ResponseApi {
  success: boolean;
  message: string;
  data?: {
    user: any;
  };
}
