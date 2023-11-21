<script setup>
import Loading from './loading/Loading.vue';
</script>

<script>
  export default {
    name: 'Home',
    data() {
      return {
        loading: true,
        user: {},
        club: {},


        generalError: {error: ""},
      }
    },
    methods: {
      async loadClub() {
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
          this.postResult = JSON.stringify(data, null, 2);
          

          this.club = data;
          this.loading = false;

        } catch (err) {
          this.generalError.error = "No conexion error: " + err.message;
        }
      },
      async checkUserLoaded() {
        const intervalId = await setInterval(async () => {
          if (this.getUser.id != 0) {
            clearInterval(intervalId);
            this.user = this.getUser;
            await this.loadClub();
          }
        }, 1000);
      },
    },
    computed: {
      logged() {
        return this.$store.getters.getLogged;
      },
      getUser() {
        return this.$store.getters.getUser;
      },
      getClubImage() {
        if(!this.club.shield_url || this.club.shield_url == "") {
          return "https://guessthefootballplayer.com/Js/placeholder3.png";
        }
        return this.club.shield_url;
      }
    },
    async mounted() {
      await this.checkUserLoaded();
    }
  };
</script>

<template>
  <div class="teams_body">
    <div v-if="loading" class="mainBody">
        <Loading></Loading>
    </div>
    <div v-else>
      HELLO
    </div>
  </div>
</template>

<style scoped>

</style>

