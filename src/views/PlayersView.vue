<script setup>
import LoadingBall from '../components/loading/LoadingBall.vue';
import newUserForm from '../components/newUserForm.vue';

</script>

<script>
  export default {
    name: 'PlayersView',
    data() {
      return {
        loading: true,
        user: {},

        new_player_form: false,
        players: [],
        new_trainer_form: false,
        trainers: [],
      }
    },
    methods: {
      async checkUserLoaded() {
        const intervalId = await setInterval(async () => {
          if (this.getUser.id != 0) {
            clearInterval(intervalId);
            this.user = this.getUser;
            
            //LOAD PLAYERS AND TRAINERS:
            await this.reloadAll();
          }
        }, 500);
      },
      async reloadAll() {
        const postData = {
          user_id: this.getUser.id,
          token: this.getUser.last_token_key,
        };
        try {
          const res = await fetch(`${this.$store.getters.getBaseURL}/getAllUsers/owner`, {
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
          

          this.players = data.players;
          this.trainers = data.trainers;
          this.loading = false;

        } catch (err) {
          //TODO: this.generalError.error = "No conexion error: " + err.message;
        }
        this.new_trainer_form = false;
        this.new_player_form = false;
      }
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
  <main>
    <div class="pv_title">
      <div style="font-size: 1.6rem; font-weight: bold;">Administrador de Usuarios</div>
    </div>
    <div style="align-self: center;" v-if="loading"><LoadingBall></LoadingBall></div>
    <div class="pla_train_container" v-else>
      <div class="player_list">
        <div>Jugadores</div>
        <div v-if="!new_player_form" class="add_button" @click="new_player_form = true"> + Añadir jugador</div>
        <newUserForm @reload="reloadAll()" :type="'player'" :club_id="user.club_id" v-else></newUserForm>

        <div v-for="player in players" class="user_box">
          <div>{{ player.username }}</div>
          <div>{{ player.first_name }}</div>
          <div>{{ player.last_name }}</div>
          
        </div>
      </div>
      <div class="trainers_list">
        <div>Entrenadores</div>
        <div v-if="!new_trainer_form" class="add_button" @click="new_trainer_form = true"> + Añadir entrenador</div>
        <newUserForm @reload="reloadAll()" :type="'trainer'" :club_id="user.club_id" v-else></newUserForm>

        <div v-for="trainer in trainers" class="user_box">
          <div>{{ trainer.username }}</div>
          <div>{{ trainer.first_name }}</div>
          <div>{{ trainer.last_name }}</div>
          
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
main {
  display: flex;
  flex-direction: column;
  padding: 1rem;
  box-sizing: border-box;
  gap: 1rem;
}
.pv_title {
  width: 100%;
  background-color: white;
  padding: 1rem;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: .4rem;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.205);
}
.pla_train_container {
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.205);
  min-height: 1rem;
  background-color: white;
  padding: 1rem;
  border-radius: .4rem;
  box-sizing: border-box;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}
.player_list, .trainers_list {
  min-height: 2rem;
  padding: .4rem 0;
  box-sizing: border-box;
  border-radius: .4rem;
  background-color: rgba(0, 0, 0, 0.075);
  display: flex;
  align-items: stretch;
  flex-direction: column;
}
.player_list > div:first-child, .trainers_list > div:first-child {
  font-weight: bold;
  font-size: 1.6rem;
  margin: 0 1rem;
}
.player_list > div, .trainers_list > div {
  padding: .4rem;
}
.add_button {
  text-align: center;
  background-color: rgba(0, 0, 0, 0.5);
  cursor: pointer;
  color: white;
  height: 4rem;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: .4s;
}
.add_button:hover {
  color: black;
  background-color: white;
}
.add_button:active {
  color: white;
  background-color: black;
}
.user_box {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  gap: 1rem;
}
</style>
