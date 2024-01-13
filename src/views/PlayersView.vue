<script setup>
import LoadingBall from '../components/loading/LoadingBall.vue';

</script>

<script>
  export default {
    name: 'PlayersView',
    data() {
      return {
        loading: true,
        user: {},

      }
    },
    methods: {
      async checkUserLoaded() {
        const intervalId = await setInterval(async () => {
          if (this.getUser.id != 0) {
            clearInterval(intervalId);
            this.user = this.getUser;
            
            this.loading = false;
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
  <main>
    <div class="pv_title">
      <div style="font-size: 1.6rem; font-weight: bold;">Administrador de Usuarios</div>
    </div>
    <div style="align-self: center;" v-if="loading"><LoadingBall></LoadingBall></div>
    <div class="pla_train_container" v-else>
      <div class="player_list">
        <div>Jugadores</div>
        <div class="add_button"> + Añadir jugador</div>
        
      </div>
      <div class="trainers_list">
        <div>Entrenadores</div>
        <div class="add_button"> + Añadir entrenador</div>

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
  font-size: 1.2rem;
}
.player_list > div, .trainers_list > div {
  padding: .4rem;
}
.add_button {
  text-align: center;
  background-color: rgba(0, 0, 0, 0.5);
  cursor: pointer;
  color: white;
  height: 2rem;
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
</style>
