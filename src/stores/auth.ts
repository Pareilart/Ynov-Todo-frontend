import { defineStore } from "pinia";
import { ref } from "vue";
import { useApi } from "@/composable/useApi";
import type { ResponseApi } from "@/types/reponseApi";
import type { User } from "@/types/user";
export const useAuthStore = defineStore(
  "auth",
  () => {
    const data = ref<User | null>(null);
    const { post } = useApi();

    const isTokenExpired = (token: string): boolean => {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        const expirationTime = payload.exp * 1000;
        return Date.now() >= expirationTime;
      } catch {
        return true;
      }
    };

    const login = async (email: string, password: string) => {
      try {
        const {
          success,
          data: responseData,
          message,
        } = (await post("/api/users/login", {
          email,
          password,
        })) as ResponseApi;

        if (success && responseData) {
          data.value = responseData as User;
        }

        return { success, message };
      } catch (error) {
        return {
          success: false,
          message: error instanceof Error ? error.message : "Erreur inconnue",
        };
      }
    };

    const signup = async (email: string, password: string, name: string) => {
      try {
        const {
          success,
          data: responseData,
          message,
        } = (await post("/api/users/signup", {
          email,
          password,
          name,
        })) as ResponseApi;

        if (success && responseData) {
          data.value = responseData as User;
        }

        return { success, message };
      } catch (error) {
        return {
          success: false,
          message: error instanceof Error ? error.message : "Erreur inconnue",
        };
      }
    }

    const logout = async () => {
      data.value = null;

      return { success: true, message: "Déconnexion réussie" };
    };

    const checkAuth = () => {
      if (!data.value?.token) {
        data.value = null;
        return false;
      }

      if (isTokenExpired(data.value.token)) {
        data.value = null;
        return false;
      }

      return true;
    };

    return { data, login, logout, checkAuth, signup };
  },
  { persist: true }
);
