<script setup lang="ts">
import { ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { login } from "@/shared/auth";
import { InputComp } from "@/shared/ui/Input";
import { ButtonComp } from "@/shared/ui/Button";
import AllWordsCategoryImageComp from "@/components/Categories/AllWordsCategoryImageComp.vue";
import { CaptionComp } from "@/shared/ui/Caption";

const { t } = useI18n();
const router = useRouter();

const username = ref("");
const password = ref("");
const authError = ref<string | undefined>();
const usernameError = ref<string | undefined>();
const passwordError = ref<string | undefined>();

watch(username, () => {
  usernameError.value = undefined;
  authError.value = undefined;
});

watch(password, () => {
  passwordError.value = undefined;
  authError.value = undefined;
});

function triggerValidation() {
  const error = t("required");
  if (!username.value) {
    usernameError.value = error;
  }
  if (!password.value) {
    passwordError.value = error;
  }
}

async function tryLogin() {
  triggerValidation();

  if (usernameError.value || passwordError.value) {
    return;
  }

  try {
    await login({
      username: username.value,
      password: password.value,
    });
    router.push({ name: "words" });
  } catch (error) {
    authError.value = t("login-failed");
  }
}
</script>

<template>
  <div class="login-page">
    <div class="login-page__container">
      <div class="login-page__header">
        <AllWordsCategoryImageComp size="56px" />
        <h1>{{ t("login-to-word-database") }}</h1>

        <CaptionComp v-if="authError" type="error" :text="authError" />
      </div>

      <InputComp
        v-model="username"
        :label="t('login')"
        :error-text="usernameError"
        :error="Boolean(authError)"
        input-id="username"
      />

      <InputComp
        v-model="password"
        :label="t('password')"
        :error-text="passwordError"
        :error="Boolean(authError)"
        type="password"
        input-id="password"
      />

      <ButtonComp
        class="login-page__login-button"
        :label="t('to-login')"
        full-width
        @click="tryLogin"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.login-page {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100dvh;

  &__container {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 496px;
    padding: 20px;
    row-gap: 20px;
  }

  &__header {
    display: flex;
    flex-direction: column;
    align-items: center;
    row-gap: 12px;
  }

  &__login-button {
    margin-block-start: 12px;
  }
}
</style>
