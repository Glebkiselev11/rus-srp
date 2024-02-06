<script lang="ts">
import { RouterView } from "vue-router";
import { defineComponent } from "vue";
import axios from "axios";
import { TOKEN_KEY } from "./common/auth";

export default defineComponent({
	name: "App",
	components: {
		RouterView,
	},
	created() {
		axios.interceptors.request.use((config) => {
			const token = localStorage.getItem(TOKEN_KEY);
			if (token) {
				config.headers.Authorization = `Bearer ${token}`;
			}
			return config;
		});

		axios.interceptors.response.use(
			(response) => {
				return response;
			},
			(error) => {
				if (error.response.status === 401) {
					this.$router.push({ name: "login" });
				}
				return error;
			},
		);
	},
});

</script>

<template>
	<RouterView />
</template>
