<script lang="ts">
import { defineComponent } from "vue";
import InputComp from "@/components/InputComp.vue";
import ButtonComp from "@/components/ButtonComp.vue";
import ErrorComp from "@/components/ErrorComp.vue";
import { login } from "@/common/auth";

export default defineComponent({
	name: "LoginView",
	components: {
		InputComp,
		ButtonComp,
		ErrorComp,
	},
	data() {
		return {
			username: "",
			password: "",
			authError: undefined as string | undefined,
			usernameError: undefined as string | undefined,
			passwordError: undefined as string | undefined,
		};
	},
	watch: {
		username() {
			this.usernameError = undefined;
			this.authError = undefined;
		},
		password() {
			this.passwordError = undefined;
			this.authError = undefined;
		},
	},
	methods: {
		login,
		async tryLogin() {
			this.triggerValidation();

			if (this.usernameError || this.passwordError) {
				return;
			}

			try {
				await login({
					username: this.username,
					password: this.password,
				});
				this.$router.push({ name: "words" });
			} catch (error) {
				this.authError = this.$t("login-failed");
			}
		},
		triggerValidation() {
			const error = this.$t("required");
			if (!this.username) {
				this.usernameError = error;
			}
			if (!this.password) {
				this.passwordError = error;
			}
		},
	},
});

</script>

<template>
	<div class="login-view">
		<div class="login-view__container">
			<h1>{{ $t('login-to-word-database') }}</h1>

			<ErrorComp
				v-if="authError"
				:text="authError"
			/>

			<InputComp
				v-model="username"
				:label="$t('login')"
				:error-text="usernameError"
				:error="Boolean(authError)"
				input-id="username"
			/>

			<InputComp
				v-model="password"
				:label="$t('password')"
				:error-text="passwordError"
				:error="Boolean(authError)"
				type="password"
				input-id="password"
			/>

			<ButtonComp
				:label="$t('to-login')"
				full-width
				@click="tryLogin"
			/>
		</div>
	</div>
</template>

<style scoped lang="scss">
@import "@/styles/main.scss";

.login-view {
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
}

</style>
