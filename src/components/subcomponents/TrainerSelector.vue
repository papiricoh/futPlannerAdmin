<script setup>
import LoadingBall from '../loading/LoadingBall.vue';
</script>

<script>
  export default {
    name: 'Home',
    data() {
      return {
        loading: true,
        user: {},
        trainers: [],

        generalError: "",
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
          await this.loadTeams();

        } catch (err) {
          this.generalError.error = "No conexion error: " + err.message;
        }
      },
      async checkUserLoaded() {
        const intervalId = await setInterval(async () => {
          if (this.getUser.id != 0) {
            clearInterval(intervalId);
            this.user = this.getUser;
            //await this.loadClub();
          }
        }, 1000);
      }
    },
    computed: {
      logged() {
        return this.$store.getters.getLogged;
      },
      getUser() {
        return this.$store.getters.getUser;
      }
    },
    async mounted() {
      await this.checkUserLoaded();
    }
  };
</script>

<template>
  <div class="main_container">
    <div class="title">
      <h3>Entrenadores</h3>
      <div class="button">Salir</div>
    </div>
    <div class="trainer_list">
      <div class="trainer_card">
        <img src="https://st3.depositphotos.com/6672868/13701/v/450/depositphotos_137014128-stock-illustration-user-profile-icon.jpg" alt="">
        <h4>Pablo Lopez</h4>
        <div class="button">ASIGNAR</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.trainer_card > h4 {
  max-height: 5rem;
  overflow: hidden;
}
.trainer_card > * {
  margin: .4rem;
  box-sizing: border-box;
}
.trainer_card > img {
  width: 80%;
  aspect-ratio: 1/1;
  border-radius: 1rem;
}
.trainer_card {
  height: 95%;
  aspect-ratio: 2/3;
  border: 2px solid grey;
  border-radius: .6rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.trainer_list {
  width: 100%;
  height: 100%;
  overflow-y: hidden;
  overflow-x: scroll;
  display: flex;
  gap: 1rem;
  align-items: center;
}
.button {
  border: 2px solid darkgreen;
  padding: .4rem 1rem;
  border-radius: .4rem;
  cursor: pointer;
  transition: .4s;
}
.button:hover {
  background-color: rgba(0, 138, 34, 0.692);
  transition: .4s;
}
.button:active {
  background-color: rgb(0, 138, 34);
  color: white;
  transition: .4s;
}
.title {
  padding: 1rem;
  margin-bottom: 1rem;
  border-bottom: 2px solid black;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
h3 {
  margin: 0;
}
.main_container {
  height: 40%;
  width: 60%;
  background-color: white;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  padding: 2rem;
  border-radius: .4rem;
}
</style>

