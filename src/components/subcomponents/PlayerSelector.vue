<script setup>
import LoadingBall from '../loading/LoadingBall.vue';
</script>

<script>
  export default {
    name: 'PlayerSelector',
    props: {
      club: Object
    },
    data() {
      return {
        loading: true,

        user: null,

      }
    },
    watch: {
      
    },
    methods: {
      exit() {
        this.$emit('exitPlayer');
      },
      async checkUserLoaded() {
        const intervalId = await setInterval(async () => {
          if (this.getUser.id != 0) {
            clearInterval(intervalId);
            this.user = this.getUser;
            //this.form_data = JSON.parse(JSON.stringify(this.player));
            this.loading = false
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
  <div class="ps_container">
    <div class="ps_title">
      <div class="ps_title_text">Selecionador de Jugadores</div>
      <div class="exit_button" @click="exit()">Salir</div>
    </div>
    <div v-if="loading" class="ps_data_container loading">
      <LoadingBall></LoadingBall>
    </div>
    <div v-else class="ps_data_container">

    </div>
    <div class="ok_button">Confirmar cambios</div>
  </div>
</template>

<style scoped>
.ps_container {
  width: 60rem;
  height: 34rem;
  background-color: white;
  border-radius: .4rem;
  padding: .8rem;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: space-between;
  gap: 1rem;
}
.ps_title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
  border-bottom: 1px solid grey;
}
.ps_title_text {
  font-weight: 700;
  font-size: 1.5rem;
}
.exit_button {
  padding: .4rem 2rem;
  color: black;
  border: 2px solid #1B5E20;
  cursor: pointer;
  border-radius: .4rem;
  transition: .4s;
}
.exit_button:hover {
  color: white;
  background-color: #1B5E20;
}
.ok_button {
  align-self: center;
  padding: 2rem 6rem;
  background-color: #1B5E20;
  border-radius: .6rem;
  color: white;
  border: 2px solid #1B5E20;
  cursor: pointer;
  transition: .4s;
}
.ok_button:hover {
  color: black;
  background-color: transparent;
}
.ps_data_container {
  display: grid;
  height: 100%;
  box-sizing: border-box;
  background-color: grey;
  overflow-y: scroll;
  grid-template-columns: 1fr 1fr;
  padding: .4rem;
  gap: .4rem;
}
.loading {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>

