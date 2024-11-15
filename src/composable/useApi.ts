import { ref } from "vue";

interface ApiOptions {
  headers?: HeadersInit;
  authToken?: string;
}

interface ApiResponse<D = any> {
  success: boolean;
  data: D | null;
  message: string;
}

export function useApi(options: ApiOptions = {}) {
  const isLoading = ref(false);
  const error = ref<any>(null);

  const baseURL = import.meta.env.VITE_APP_API_URL;
  const defaultHeaders = {
    "Content-Type": "application/json",
    ...(options.authToken && { Authorization: `Bearer ${options.authToken}` }),
    ...options.headers,
  };

  const handleResponse = async <D>(response: Response): Promise<ApiResponse<D>> => {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Erreur HTTP: ${response.status}`);
    }
    const result = await response.json();
    return result as ApiResponse<D>;
  };

  const fetchData = async <D>(endpoint: string, options = {}) => {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await fetch(`${baseURL}${endpoint}`, {
        headers: defaultHeaders,
        ...options,
      });
      const data = await handleResponse<D>(response);
      if (!data.success) {
        error.value = data.message;
        throw new Error(data.message);
      }
      return data;
    } catch (e) {
      if (e instanceof Error) {
        error.value = e.message;
      } else {
        error.value = "Une erreur inconnue est survenue";
      }
      throw e;
    } finally {
      isLoading.value = false;
    }
  };

  const get = (endpoint: string) => {
    return fetchData(endpoint);
  };

  const post = (endpoint: string, data: any) => {
    return fetchData(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
    });
  };

  const put = (endpoint: string, data: any) => {
    return fetchData(endpoint, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  };

  const patch = (endpoint: string, data?: any) => {
    return fetchData(endpoint, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  };

  const del = (endpoint: string) => {
    return fetchData(endpoint, {
      method: "DELETE",
    });
  };

  return {
    isLoading,
    error,
    get,
    post,
    put,
    patch,
    delete: del,
  };
}
