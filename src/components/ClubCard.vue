<script setup>
import LoadingBall from '../components/loading/LoadingBall.vue';

</script>

<script>
  export default {
    name: 'ClubCard',
    data() {
      return {
        loading: true,
        club: {
            club_name: "Club",
            shield_url: "",
            user_count: 1
        }
        
      }
    },
    methods: {
      async checkUserLoaded() {
        const intervalId = await setInterval(async () => {
          if (this.getUser.id != 0) {
            clearInterval(intervalId);
            this.user = this.getUser;

            const postData = {
                user_id: this.getUser.id,
                token: this.getUser.last_token_key,
            };
            try {
                const res = await fetch(`${this.$store.getters.getBaseURL}/club/owner`, {
                    method: "post",
                    headers: {
                    "Content-Type": "application/json"
                    },
                    body: JSON.stringify(postData),
                });
                if (!res.ok) {
                    throw new Error(`An error has occurred: ${res.status} - ${res.statusText}`);
                }
                const data = await res.json();
                
                this.club = data;
                this.loading = false;

            } catch (err) {
                //TODO: this.generalError.error = "No conexion error: " + err.message;
            }
          }
        }, 500);
      },
    },
    computed: {
      getUser() {
        return this.$store.getters.getUser;
      },
    },
    async mounted() {
      await this.checkUserLoaded();
    }
  };
</script>

<template>
  <div v-if="!loading" class="cc_card">
    <img :src="club.shield_url" alt="" class="cc_img">
    <div class="cc_data_c">
        <div style="font-size: 2rem; font-weight: bold;">{{ club.club_name }}</div>
        <div>Cantidad de miembros: {{ club.user_count }}</div>
    </div>
  </div>
  <div v-else class="cc_card" style="align-items: center; justify-content: center;">
    <LoadingBall></LoadingBall>
  </div>
</template>

<style scoped>
.cc_card {
    display: flex;
    gap: 1rem;
    padding: 1rem;
    margin: 1rem;
}
.cc_img {
    height: 10rem;
    border-radius: 2rem;
    box-shadow: 0 0 4px black;
}
.cc_data_c {
  display: flex;
  gap: 1rem;
  flex-direction: column;
}
</style>

