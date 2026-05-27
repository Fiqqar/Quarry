import { defineStore } from "pinia";
import type { AuthUser, LoginInput, RegisterInput } from "~/types/auth";
import { ApiClientError, toSafeErrorMessage } from "~/utils/api-error";

type MaybeMeResponse = AuthUser | { user: AuthUser };

function isAuthUser(value: unknown): value is AuthUser {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Partial<AuthUser>;

  return typeof candidate.id === "string" && typeof candidate.email === "string";
}

function normalizeMeResponse(data: MaybeMeResponse) {
  if (isAuthUser(data)) {
    return data;
  }

  if ("user" in data && isAuthUser(data.user)) {
    return data.user;
  }

  throw new ApiClientError("Invalid current user response.", "INVALID_AUTH_RESPONSE", 500);
}

function readAuthErrorMessage(data: unknown, fallback: string) {
  if (!data || typeof data !== "object") {
    return fallback;
  }

  const record = data as Record<string, unknown>;

  if (typeof record.message === "string" && record.message.trim().length > 0) {
    return record.message;
  }

  if (record.error && typeof record.error === "object") {
    const error = record.error as Record<string, unknown>;

    if (typeof error.message === "string" && error.message.trim().length > 0) {
      return error.message;
    }
  }

  return fallback;
}

export const useAuthStore = defineStore("auth", () => {
  const api = useApi();
  const config = useRuntimeConfig();
  const user = ref<AuthUser | null>(null);
  const loading = ref(false);
  const initialized = ref(false);
  const error = ref<string | null>(null);
  const isAuthenticated = computed(() => Boolean(user.value));

  function authUrl(path: string) {
    return `${config.public.apiBaseUrl.replace(/\/$/, "")}${path}`;
  }

  async function authRequest(path: string, body?: Record<string, unknown>, fallback = "Auth request failed.") {
    const response = await $fetch.raw<unknown>(authUrl(path), {
      body,
      credentials: "include",
      ignoreResponseError: true,
      method: "POST",
      timeout: 8_000,
    });

    if (response.status >= 400) {
      throw new ApiClientError(readAuthErrorMessage(response._data, fallback), "AUTH_ERROR", response.status);
    }
  }

  async function fetchMe() {
    loading.value = true;
    error.value = null;

    try {
      const { data } = await api.get<MaybeMeResponse>("/auth/me");
      user.value = normalizeMeResponse(data);

      return user.value;
    } catch (fetchError) {
      user.value = null;

      if (!(fetchError instanceof ApiClientError && fetchError.statusCode === 401)) {
        error.value = toSafeErrorMessage(fetchError, "Unable to load current user.");
      }

      return null;
    } finally {
      initialized.value = true;
      loading.value = false;
    }
  }

  async function login(input: LoginInput) {
    loading.value = true;
    error.value = null;

    try {
      await authRequest("/auth/sign-in/email", input, "Invalid email or password.");
      await fetchMe();
    } catch (loginError) {
      const message = toSafeErrorMessage(loginError, "Invalid email or password.");

      error.value = message;
      throw new Error(message);
    } finally {
      loading.value = false;
    }
  }

  async function register(input: RegisterInput) {
    loading.value = true;
    error.value = null;

    try {
      await authRequest("/auth/sign-up/email", input, "Unable to create account.");
      await fetchMe();
    } catch (registerError) {
      const message = toSafeErrorMessage(registerError, "Unable to create account.");

      error.value = message;
      throw new Error(message);
    } finally {
      loading.value = false;
    }
  }

  async function logout() {
    loading.value = true;
    error.value = null;

    try {
      await authRequest("/auth/sign-out", undefined, "Unable to sign out.");
    } finally {
      user.value = null;
      initialized.value = true;
      loading.value = false;
    }
  }

  return {
    error,
    fetchMe,
    initialized,
    isAuthenticated,
    loading,
    login,
    logout,
    register,
    user,
  };
});
