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
  <div class="home">
    <div class="resumeComponent">
      <div v-if="loading">
        <Loading></Loading>
      </div>
      <div v-else class="loadedResumeComponent">
        <img :src="getClubImage" alt="">
        <div>{{ club.club_name }}</div>
      </div>
    </div>
    <div class="transparentBack">
      <div v-if="loading">
        <Loading></Loading>
      </div>
      <div v-else>
        HOLA
      </div>
    </div>

    <div v-if="loading" class="mainBody">
        <Loading></Loading>
    </div>
    <div v-else>
      HELLO
    </div>
  </div>
</template>

<style scoped>
.transparentBack {
  width: 100%;
  height: 100%;
  background-color: transparent;
  border: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}
.loadedResumeComponent > div {
  font-size: 2rem;
}
.loadedResumeComponent > img {
  width: 35%;
  aspect-ratio: 1/1;
}
.loadedResumeComponent {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  box-sizing: border-box;
  justify-content: space-around;
}
.resumeComponent {
  width: 100%;
  height: 100%;
  border: 2px solid rgb(230, 230, 230);
  border-radius: .3rem;
  box-sizing: border-box;
  padding: 1rem;
  background-color: white;
  display: flex;
  justify-content: center;
  align-items: center;
}
.mainBody {
  grid-column: 1/3;
  padding: 1rem;
  display: flex;
  flex-direction: column;
}
.home {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 3fr;
  height: 100%;
  gap: 2rem;
  margin: 1rem;
}
</style>

