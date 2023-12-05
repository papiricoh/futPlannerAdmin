<script setup>
import LoadingBall from '../loading/LoadingBall.vue';
</script>

<script>
  export default {
    name: 'TeamData',
    props: {
      team_id: Number,
    },
    data() {
      return {
        loading: true,
        user: {},
        team: {},
        trainer: {},

        
      }
    },
    methods: {
      renderTrainerPhoto(photo) {
        if(photo == null || photo == "") {
          return "/profile_placeholder.jpg"
        }
        return photo;
      },
      async loadTeamData() {
        const postData = {
          user_id: this.getUser.id,
          token: this.getUser.last_token_key,
          team_id: this.team_id
        };
        try {
          const res = await fetch(`${this.$store.getters.getBaseURL}/fullTeam/owner/id`, {
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
          

          this.team = data;
          this.loading = false;
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
            await this.loadTeamData();
          }
        }, 1000);
      },
    },
    computed: {
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
  <div v-if="loading">
    <LoadingBall class="loading_padding"></LoadingBall>
    
  </div>
  <div class="data_container" v-else>
    <div class="data_row">
      <div class="data_box">
        <div class="data_title">
          <h3>NOMBRE</h3>
          <h4>Categoria - Num</h4>
        </div>
        <div class="trainer_box">
          <img :src="renderTrainerPhoto(null)" alt="">
          <div>NOMBRE APELLIDOS</div>
        </div>
      </div>
      <div class="data_box">

      </div>
    </div>
  </div>
</template>

<style scoped>
.trainer_box > div {
  overflow-x: hidden;
}
.trainer_box > img {
  object-fit: cover;
  width: 8rem;
  height: 8rem;
  border-radius: .4rem;
}
.trainer_box {
  min-width: 6rem;
  min-height: 8rem;
  border: 2px solid rgba(0, 0, 0, 0.3);
  border-radius: .4rem;
  display: flex;
  align-items: center;
  padding: 1rem;
  gap: 2rem;
}
.data_title {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.data_box {
  min-height: 4rem;
  width: 100%;
  border-radius: .2rem;
  padding: 1rem;
  background-color: rgba(128, 128, 128, 0.2);
}
.data_row {
  width: 100%;
  box-sizing: border-box;
  grid: 1rem;
  min-height: 4rem;
  display: flex;
  align-items: center;
  justify-content: stretch;
  gap: 1rem;
}
.data_container {
  min-height: 4rem;
  width: 100%;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  box-sizing: border-box;
}
.loading_padding {
  padding: 1rem;
}
</style>

