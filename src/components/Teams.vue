<script setup>
import Loading from './loading/Loading.vue';
import LoadingBall from './loading/LoadingBall.vue';
import TrainerSelector from './subcomponents/TrainerSelector.vue';
</script>

<script>
  export default {
    name: 'Home',
    data() {
      return {
        loading: true,
        user: {},
        club: {},
        teams: [],


        generalError: {error: ""},
        team_creator_mode: false,
        trainer_selector_mode: false,

        new_team_form: {
          name: "",
          shield_url: "",
          category: "",
          sub_category: "",
          trainer: {},
        }
      }
    },
    methods: {
      async loadTeams() {
        const postData = {
          user_id: this.getUser.id,
          token: this.getUser.last_token_key,
        };
        try {
          const res = await fetch(`${this.$store.getters.getBaseURL}/teams/owner`, {
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
          

          this.teams = data;
          this.loading = false;

        } catch (err) {
          this.generalError.error = "No conexion error: " + err.message;
        }
      },
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
            await this.loadClub();
          }
        }, 1000);
      },
      generateShield(shield_url) {
        if(shield_url == null || shield_url == "") {
          return "https://upload.wikimedia.org/wikipedia/commons/7/7d/Heraldic_shield_placeholder.png";
        }
        return shield_url;
      },
      renderPhoto(url) {
        if(url == "" || url == null) {
          return "https://st3.depositphotos.com/6672868/13701/v/450/depositphotos_137014128-stock-illustration-user-profile-icon.jpg";
        }
        return url;
      },
      setFormTrainer(trainer) {
        this.new_team_form.trainer = trainer;
        this.trainer_selector_mode = false;
      }
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
  <div v-if="trainer_selector_mode" class="background_trainer">
    <TrainerSelector @trainer="setFormTrainer"></TrainerSelector>
  </div>


  <div v-if="team_creator_mode" class="team_creator_mode">
    <div class="team_creator_window">
      <div class="team_creator_container">
        <h3>Creador de Equipos</h3>
        <div @click="team_creator_mode = false" class="option_button">Salir</div>
      </div>
      <div class="team_creator_container">
        <div class="team_creator_input">
          <h5>Nombre</h5>
          <input v-model="new_team_form.name" placeholder="Nombre" type="new_team_name">
        </div>
        <div class="team_creator_input">
          <h5>URL Escudo</h5>
          <input v-model="new_team_form.shield_url" placeholder="http://images.org/image.jpg" type="new_team_shield">
        </div>
      </div>
      <div class="team_creator_container">
        <div class="team_creator_input">
          <h5>Categoria</h5>
          <select v-model="new_team_form.category" name="team_creator_category" id="team_creator_category">
            <option disabled value="">Selecciona</option>
            <option value="Prebenjamin">Prebenjamin</option>
            <option value="Benjamin">Benjamin</option>
            <option value="Alevin">Alevin</option>
            <option value="Infantil">Infantil</option>
            <option value="Cadete">Cadete</option>
            <option value="Juvenil">Juvenil</option>
            <option value="Regional">Regional - Aficicionado</option>
          </select>
        </div>
        <div class="team_creator_input">
          <h5>Sub-Categoria</h5>
          <select v-model="new_team_form.sub_category" name="team_creator_subcategory" id="team_creator_subcategory">
            <option disabled value="">Selecciona</option>
            <option v-if="new_team_form.category == 'Regional'" value="Preferente">Preferente</option>
            <option v-if="new_team_form.category == 'Juvenil'" value="Division de Honor">Division de Honor</option>
            <option v-if="new_team_form.category == 'Juvenil'" value="Liga Nacional">Liga Nacional</option>
            <option value="1º">1º</option>
            <option value="2º">2º</option>
            <option v-if="new_team_form.category != 'Regional'" value="3º">3º</option>
          </select>
        </div>
      </div>
      <div class="team_creator_container">
        <div class="team_creator_input">
          <h5>Entrenador</h5>
          <div v-if="new_team_form.trainer == null || new_team_form.trainer.id == null" @click="trainer_selector_mode = true" class="profile_selector">
            <div>+</div>
          </div>
          <div @click="trainer_selector_mode = true" v-else class="profile_selector">
            <img :src="renderPhoto(new_team_form.trainer.photo_url)" alt="">
            <h4>{{new_team_form.trainer.first_name + " " + new_team_form.trainer.last_name}}</h4>
          </div>
        </div>
      </div>
      <div class="team_creator_container">
        <div class="option_button" style="width: 100%; text-align: center;">CREAR</div>
      </div>
    </div>
  </div>
  <div class="teams_body">
    <div v-if="loading" class="loading">
        <LoadingBall></LoadingBall>
    </div>
    <div class="general_body" v-else>
      <div class="table_options">
        <div></div>
        <div @click="team_creator_mode = true" class="option_button">Añadir Equipo</div>
      </div>
      <div class="table">
          <div class="table_row">
            <div>Nombre</div>
            <div>Escudo</div>
            <div>Sub-categoria</div>
            <div>Categoria</div>
          </div>
          <div v-for="team in teams" class="table_row selectable">
            <div>{{team.team_name}}</div>
            <img :src="generateShield(team.shield_url)" alt="">
            <div>{{team.sub_category.sub_category_name}}</div>
            <div>{{team.category.category_name}}</div>
          </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.profile_selector > h4 {
  font-size: 1rem;
  margin: 0;
}
.profile_selector > img {
  width: 80%;
  box-sizing: border-box;
  aspect-ratio: 1/1;
  border-radius: 1rem;
}

.background_trainer {
  background-color: rgba(0, 0, 0, 0.13);
  width: 88%;
  height: 100%;
  z-index: 4;
  position: fixed;
  display: flex;
  align-items: center;
  justify-content: center;
}
.profile_selector {
  width: 8rem;
  height: 10rem;
  padding: .4rem;
  border-radius: 1rem;
  border: 2px solid grey;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 4rem;
  cursor: pointer;
  font-weight: 600;
  transition: .4s;
  flex-direction: column;
  gap: 1rem;
}
.profile_selector:hover {
  background-color: rgba(0, 0, 0, 0.117);
  transition: .4s;
}
.profile_selector:active {
  background-color: rgba(0, 0, 0, 0.3);
  transition: .4s;
}
.team_creator_input > select {
  width: 90%;
  height: 2rem;
}
.team_creator_input > input {
  width: 90%;
  height: 2rem;
}
.team_creator_input > h5 {
  color: rgb(90, 90, 90);
}
.team_creator_input {
  display: flex;
  flex-direction: column;
  width: 100%;

}
.team_creator_container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 3rem;
}
.team_creator_container:first-child {
  border-bottom: 1px solid grey;
  padding-bottom: 1rem;
  margin-bottom: 0;
}
.team_creator_window {
  box-sizing: border-box;
  width: 40%;
  min-height: 50%;
  background-color: white;
  border-radius: .4rem;
  padding: 1.4rem;
  display: flex;
  align-items: stretch;
  flex-direction: column;
  gap: 1rem;
}
.team_creator_mode {
  position: fixed;
  background-color: rgba(0, 0, 0, 0.525);
  z-index: 1;
  box-sizing: border-box;
  width: 88%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.option_button {
  border-radius: .4rem;
  border: 2px solid green;
  padding: .4rem 1rem;
  cursor: pointer;
  transition: .25s;
}
.option_button:hover {
  background-color: rgb(39, 160, 39);
  color: white;
  transition: .25s;
}
.option_button:active {
  color: white;
  background-color: green;
  transition: .25s;
}
.table_options {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: white;
  box-sizing: border-box;
  border-radius: .4rem;
  padding: 1rem;
}
.general_body {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 1rem;
}
.selectable {
  cursor: pointer;
  transition: .25s;
}
.selectable:last-child {
  border-bottom-right-radius: .4rem;
  border-bottom-left-radius: .4rem;
}
.selectable:hover {
  background-color: grey;
  transition: .25s;
}
.selectable:active {
  background-color: black;
  color: white;
  transition: .25s;
}
.table_row > img {
  height: 1.4rem;
  aspect-ratio: 1/1;
}
.table_row:first-child {
  color: grey;
  font-weight: bold;
}
.table_row {
  display: grid;
  grid-template-columns: 2fr 1fr 2fr 2fr;
  padding: 1rem;
}
.table {
  width: 100%;
  background-color: white;
  box-sizing: border-box;
  border-radius: .4rem;
  display: flex;
  flex-direction: column;
}
.loading {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.teams_body {
  width: 100%;
  box-sizing: border-box;
  padding: 1rem;
  min-height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}
</style>

