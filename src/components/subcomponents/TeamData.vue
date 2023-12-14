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
        trainer: null,

        generalError: {
          error: ""
        }
      }
    },
    watch: {
      
    },
    methods: {
      async restart() {
        this.loading = true;
        await this.loadTeamData();
      },
      editPlayer(player) {
        this.$emit('editPlayer', player);
      },
      renderTrainerPhoto(photo) {
        if(photo == null || photo == "") {
          return "/profile_placeholder.jpg"
        }
        return photo;
      },
      openTrainers() {
        this.$emit('openTeamTrainers', this.team);
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
      async remove_trainer() {
        if(this.team.trainer == null ) {
          return;
        }
        const postData = {
          user_id: this.getUser.id,
          token: this.getUser.last_token_key,
          trainer: this.team.trainer
        };
        try {
          const res = await fetch(`${this.$store.getters.getBaseURL}/removeTrainerFromTeam/owner`, {
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
          

          this.$emit('restartTeamWindow');

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
        }, 500);
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
          <h3>{{team.team_name}}</h3>
          <h4>{{team.subcategory}} - {{team.category}}</h4>
        </div>
        <div v-if="team.trainer != null" class="trainer_box">
          <img :src="renderTrainerPhoto(team.trainer.photo_url)" alt="">
          <div>
            <div>Entrenador:</div>
            <div style="font-size: x-large; font-weight: bold;">{{team.trainer.first_name + " " + team.trainer.last_name}}</div>
            <br>
            <div @click="remove_trainer()" class="remove_button">Destituir</div>
          </div>
        </div>
        <div v-else style="justify-content: center;" class="trainer_box_empty">
          <div style="font-size: 1.2rem;">Sin entrenador</div>
          <div @click="openTrainers()" class="add_trainer">Añadir</div>
        </div>
      </div>
      <div class="data_box">
        <div class="data_heading">
          <div class="button">Añadir Jugador</div>
        </div>
        <div class="players_row" style="font-weight: bold;">
          <div>Numero</div>
          <div>Nombre</div>
          <div>Apellidos</div>
          <div>Posición</div>
        </div>
        <div @click="editPlayer(p)" v-for="p in team.players" class="players_row selectable">
          <div v-if="p.shirt_number">{{p.shirt_number}}</div>
          <div v-else>Sin numero</div>
          <div>{{p.first_name}}</div>
          <div>{{p.last_name}}</div>
          <div v-if="p.position">{{p.position}}</div>
          <div v-else>Sin asignar</div>
        </div>
        <div v-if="team.players == null" style="text-align: center; padding: 1rem;">Sin jugadores</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
::selection {
  color: inherit;
}
.data_heading {
  display: flex;
  align-items: center;
  justify-content: center;
}
.button {
  padding: .6rem 1.2rem;
  border: 2px solid darkgreen;
  margin: .6rem;
  border-radius: .4rem;
  cursor: pointer;
  transition: .4s;
  font-weight: bold;
}
.button:hover {
  background-color: #2E7D32;
  transition: .4s;
}
.button:active {
  background-color: rgba(5, 59, 0, 0.816);
  transition: .4s;
  color: white;
}
.players_row:first-child {
  border-top-right-radius: .2rem;
  border-top-left-radius: .2rem;
}
.players_row:last-child {
  border-bottom-right-radius: .2rem;
  border-bottom-left-radius: .2rem;
}
.players_row {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  padding: 1rem .4rem;
  background-color: rgba(128, 128, 128, 0.3);
}

.players_row:nth-child(2n) {
  background-color: rgba(128, 128, 128, 0.12);
}
.selectable {
  cursor: pointer;
  transition: .2s;
}
.selectable:hover {
  background-color: #2E7D32;
  color: #E8F5E9;
  transition: .2s;
}
.selectable:active {
  background-color: rgba(0, 0, 0, 0.775);
  color: white;
  transition: .2s;
}
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
.trainer_box_empty {
  min-width: 6rem;
  min-height: 8rem;
  border: 2px solid rgba(0, 0, 0, 0.3);
  border-radius: .4rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
  gap: .4rem;
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
  display: flex;
  flex-direction: column;
}
.data_row {
  width: 100%;
  box-sizing: border-box;
  grid: 1rem;
  min-height: 4rem;
  display: flex;
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
.add_trainer {
  cursor: pointer;
  transition: .3s;
}
.add_trainer:hover {
  color: #1B5E20;
  font-weight: bold;
  transition: .3s;
  text-decoration: underline;
}
.add_trainer:active {
  color: black;
  font-weight: bold;
  transition: .3s;
}
.remove_button {
  cursor: pointer;
  transition: .3s;
}
.remove_button:hover {
  color: #C62828;
  font-weight: bold;
  transition: .3s;
  text-decoration: underline;
}
.remove_button:active {
  color: black;
  font-weight: bold;
  transition: .3s;
}
</style>

