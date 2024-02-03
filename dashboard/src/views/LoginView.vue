<script lang="ts">
import { defineComponent } from "vue";
import InputComp from "@/components/InputComp.vue";
import ButtonComp from "@/components/ButtonComp.vue";
import { login } from "@/common/auth";

export default defineComponent({
	name: "LoginView",
	components: {
		InputComp,
		ButtonComp,
	},
	data() {
		return {
			username: "",
			password: "",
		};
	},
	methods: {
		login,
		async tryLogin() {
			try {
				await login({
					username: this.username,
					password: this.password,
				});
				this.$router.push({ name: "words" });
			} catch (error) {
				console.error(error);	
			}
		},
	},
});

</script>

<template>
	<div class="login-view">
		<div class="login-view__container">
			<h1>{{ $t('login-to-word-database') }}</h1>

			<InputComp
				v-model="username"
				:label="$t('login')"
				input-id="username"
			/>

			<InputComp
				v-model="password"
				type="password"
				input-id="password"
				:label="$t('password')"
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

    * {
      margin-block-end: 20px;
    }
  }
}

</style>
