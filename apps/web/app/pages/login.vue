<script setup lang="ts">
definePageMeta({
  layout: "auth",
  middleware: "guest",
});

const auth = useAuthStore();
const form = reactive({
  email: "",
  password: "",
});
const formError = ref<string | null>(null);

function validateForm() {
  if (!form.email.includes("@")) {
    return "Enter a valid email address.";
  }

  if (form.password.length === 0) {
    return "Password is required.";
  }

  return null;
}

async function submitLogin() {
  formError.value = validateForm();

  if (formError.value) {
    return;
  }

  try {
    await auth.login({
      email: form.email,
      password: form.password,
    });
    await navigateTo("/dashboard");
  } catch (error) {
    formError.value = error instanceof Error ? error.message : "Invalid email or password.";
  }
}
</script>

<template>
  <form class="auth-form" @submit.prevent="submitLogin">
    <div>
      <h1>Sign in</h1>
      <p>Use your Quarry account to continue.</p>
    </div>

    <ErrorState v-if="formError" title="Sign in failed" :message="formError" />

    <AppInput
      id="login-email"
      v-model="form.email"
      autocomplete="email"
      label="Email"
      placeholder="researcher@example.com"
      required
      type="email"
    />
    <AppInput
      id="login-password"
      v-model="form.password"
      autocomplete="current-password"
      label="Password"
      placeholder="Password"
      required
      type="password"
    />

    <AppButton block :loading="auth.loading" type="submit">Sign in</AppButton>

    <p class="auth-form__link">
      New to Quarry?
      <NuxtLink to="/register">Create account</NuxtLink>
    </p>
  </form>
</template>

<style scoped>
.auth-form {
  display: grid;
  gap: 16px;
}

h1 {
  color: var(--q-text);
  font-size: 24px;
  font-weight: 800;
  margin: 0 0 6px;
}

p {
  color: var(--q-text-muted);
  margin: 0;
}

.auth-form__link {
  text-align: center;
}

.auth-form__link a {
  color: var(--q-amber);
  font-weight: 800;
}
</style>
