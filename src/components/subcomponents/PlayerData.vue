<script setup>
import LoadingBall from '../loading/LoadingBall.vue';
</script>

<script>
  export default {
    name: 'PlayerData',
    props: {
      player: Object //player and player.team
    },
    data() {
      return {
        loading: true,
        user: {},

        form_data: {
          id: null,
          first_name: "",
          last_name: "",
          nationality: "",
          position: "",
          shirt_number: "",
        },

        generalError: {
          error: ""
        }
      }
    },
    watch: {
      player(newPlayer, oldPlayer) {
        this.form_data = newPlayer;
      }
    },
    methods: {
      exit() {
        this.$emit('exitPlayer');
      },
      async unasignPlayer() {
        const postData = {
          user_id: this.getUser.id,
          token: this.getUser.last_token_key,
          player: this.form_data
        };
        try {
          const res = await fetch(`${this.$store.getters.getBaseURL}/unasignPlayer/owner`, {
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
          
          this.exit();

        } catch (err) {
          this.generalError.error = "No conexion error: " + err.message;
        }
      },
      async checkUserLoaded() {
        const intervalId = await setInterval(async () => {
          if (this.getUser.id != 0) {
            clearInterval(intervalId);
            this.user = this.getUser;
            this.form_data = JSON.parse(JSON.stringify(this.player));
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
  <div class="playerData_container">
    <div :class="'player_data_box loading_' + loading">
      <div style="align-self: center; justify-self: center;" v-if="loading">
        <LoadingBall ></LoadingBall>
      </div>
      <div v-else class="player_data_box_container">
        <div style="border-bottom: 2px solid rgb(45, 76, 25);" class="player_row">
          <div>{{ player.first_name + " " + player.last_name }}</div>
          <div @click="exit" class="button">Salir</div>
        </div>
        <div class="form_row">
          <div class="form_input">
            <label for="first_name">Nombre</label>
            <input type="text" v-model="form_data.first_name">
          </div>
          <div class="form_input">
            <label for="first_name">Apellidos</label>
            <input type="text" v-model="form_data.last_name">
          </div>
        </div>
        <div class="form_row">
          <div class="form_input">
            <label for="first_name">Nacionalidad</label>
            <input type="text" v-model="form_data.nationality">
          </div>
          <div class="form_input">
            <label for="first_name">Numero de camiseta</label>
            <input type="text" v-model="form_data.shirt_number">
          </div>
        </div>
        <div class="form_row">
          <div class="form_input">
            <label for="first_name">Posicion</label>
            <select type="text" v-model="form_data.position"> 
              <option :value="null">Sin asignar</option>
              <option value="DD">Delantero Derecho</option>
              <option value="DC">Delantero Centro</option>
              <option value="DI">Delantero Izquierd</option>
              <option value="MD">Medicoampista Diestro</option>
              <option value="MC">Medicoampista Centro</option>
              <option value="MI">Medicoampista Izquierdo</option>
              <option value="DF D">Defensa Derecho</option>
              <option value="DF C">Defensa Central</option>
              <option value="DF I">Defensa Izquierdo</option>
              <option value="P">Portero</option>
            </select>
          </div>
        </div>
        <div class="form_row">
          <div @click="unasignPlayer" class="button red_button">Eliminar Del Equipo</div>
          <div class="button">Modificar Jugador</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.form_row {
  display: flex;
  justify-content: space-around;
  margin: 1rem;
}
input {
  font-size: 1.2rem;
}
.form_input {
  display: flex;
  flex-direction: column;
}
.button {
  font-weight: bold;
  padding: .6rem 1.6rem;
  border: 2px solid darkgreen;
  margin: .8rem;
  border-radius: .4rem;
  cursor: pointer;
  transition: .4s;
}
.button:hover {
  background-color: rgba(128, 128, 128, 0.226);
  transition: .4s;
}
.button:active {
  background-color: rgba(0, 100, 0);
  color: white;
  transition: .4s;
}
.red_button {
  border: 2px solid darkred;
  cursor: pointer;
}
.red_button:hover {
  background-color: rgba(128, 128, 128, 0.226);
}
.red_button:active {
  background-color: rgb(100, 0, 0);
}
.player_row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.player_data_box_container {
  display: flex;
  flex-direction: column;
  align-items: stretch;
}
.loading_true {
  align-items: center;
  justify-content: center;
}
.player_data_box {
  width: 70vh;
  min-height: 40vh;
  background-color: white;
  border-radius: .4rem;
  border: 4px solid rgb(45, 76, 25);
  padding: 1rem;
  display: flex;
  flex-direction: column;
  align-items: stretch;
}
.playerData_container {
  position: absolute;
  background-color: rgba(0, 0, 0, 0.164);
  width: 87.5%;
  height: 100%;
  box-sizing: border-box;
  z-index: 2;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>

