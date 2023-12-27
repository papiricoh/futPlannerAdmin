<script setup>
import LoadingBall from '../loading/LoadingBall.vue';
</script>

<script>
  export default {
    name: 'PlayerSelector',
    props: {
      team_id: Number
    },
    data() {
      return {
        loading: true,

        user: null,

        players: [],
        selected_players: [],

        generalError: {error: null},
      }
    },
    watch: {
      
    },
    methods: {
      exit() {
        this.$emit('exitPlayer');
      },
      async loadPlayersData() {
        const postData = {
          user_id: this.getUser.id,
          token: this.getUser.last_token_key,
          team_id: this.team_id
        };
        try {
          const res = await fetch(`${this.$store.getters.getBaseURL}/getAvariablePlayers/owner`, {
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

          this.players = data;
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
            await this.loadPlayersData();
          }
        }, 1000);
      },
      renderPic(pic) {
        if(!pic || pic == "") {
          return "/profile_placeholder.jpg";
        }
        return pic;
      }
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
      <div class="ps_player_box" v-for="p in players">
        <div class="ps_name">
          <img :src="renderPic(p.photo_url)">
          <div class="ps_flname">
            <div>{{p.first_name}}</div>
            <div>{{p.last_name}}</div>
          </div>
        </div>
        <div class="ps_check"><font-awesome-icon :icon="['fas', 'check']" /></div>
      </div>
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
.ps_player_box {
  height: 10rem;
  box-sizing: border-box;
  border-radius: .6rem;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.315);
  border: 3px solid #1B5E20;
  padding: .75rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.ps_check {
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #1B5E20;
  padding: 2rem;
  font-size: 2rem;
  box-sizing: border-box;
  border-radius: 1rem;
  transition: .4s;
  cursor: pointer;
}

.ps_check:hover {
  background-color: #1B5E20;
  color: white;
}
.ps_check:active {
  background-color: transparent;
  color: black;
}

.ps_name {
  display: flex;
  align-items: center;
  gap: .5rem;
}

.ps_flname {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: .25rem;
}

.ps_name > img {
  height: 6rem;
  width: 6rem;
  object-fit: cover;
  border-radius: 1rem;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.3);
}

::-webkit-scrollbar {
  display: none;
}
</style>

