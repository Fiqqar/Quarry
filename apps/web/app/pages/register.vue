<script setup lang="ts">
definePageMeta({
  layout: "auth",
  middleware: "guest",
});

const auth = useAuthStore();
const form = reactive({
  email: "",
  name: "",
  password: "",
});
const formError = ref<string | null>(null);

function validateForm() {
  if (form.name.trim().length < 2) {
    return "Name must be at least 2 characters.";
  }

  if (!form.email.includes("@")) {
    return "Enter a valid email address.";
  }

  if (form.password.length < 8) {
    return "Password must be at least 8 characters.";
  }

  return null;
}

async function submitRegister() {
  formError.value = validateForm();

  if (formError.value) {
    return;
  }

  try {
    await auth.register({
      email: form.email,
      name: form.name.trim(),
      password: form.password,
    });
    await navigateTo("/dashboard");
  } catch (error) {
    formError.value = error instanceof Error ? error.message : "Unable to create account.";
  }
}
</script>

<template>
  <form class="auth-form" @submit.prevent="submitRegister">
    <div>
      <h1>Create account</h1>
      <p>Start with a private single-user workspace.</p>
    </div>

    <ErrorState v-if="formError" title="Registration failed" :message="formError" />

    <AppInput
      id="register-name"
      v-model="form.name"
      autocomplete="name"
      label="Name"
      placeholder="Quarry User"
      required
    />
    <AppInput
      id="register-email"
      v-model="form.email"
      autocomplete="email"
      label="Email"
      placeholder="researcher@example.com"
      required
      type="email"
    />
    <AppInput
      id="register-password"
      v-model="form.password"
      autocomplete="new-password"
      label="Password"
      placeholder="At least 8 characters"
      required
      type="password"
    />

    <AppButton block :loading="auth.loading" type="submit">Create account</AppButton>

    <p class="auth-form__link">
      Already have an account?
      <NuxtLink to="/login">Sign in</NuxtLink>
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
