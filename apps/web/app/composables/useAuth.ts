import { storeToRefs } from "pinia";

export function useAuth() {
  const auth = useAuthStore();
  const refs = storeToRefs(auth);

  return {
    ...refs,
    fetchMe: auth.fetchMe,
    login: auth.login,
    logout: auth.logout,
    register: auth.register,
  };
}
