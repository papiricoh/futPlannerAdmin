<script setup>
import Loading from './loading/Loading.vue';
import LoadingBall from './loading/LoadingBall.vue';
import TrainerSelector from './subcomponents/TrainerSelector.vue';
import TeamData from './subcomponents/TeamData.vue';
import PlayerData from './subcomponents/PlayerData.vue';
import PlayerSelector from './subcomponents/PlayerSelector.vue';
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
        categories: [],


        generalError: {error: ""},
        team_creator_mode: false,
        trainer_selector_mode: false,
        selected_team: null,
        
        player_data_mode: false,
        player_editor_player: null,
        team_trainer_selector_mode: false,
        team_trainer_team: {},
        team_player_selector_mode: false, //DEBUG
        team_player_selector_team_id: null,

        new_team_form: {
          name: "",
          shield_file: null,
          shield_url: "",
          category: null,
          sub_category: null,
          trainer: {},
          loading: false
        }
      }
    },
    methods: {
      triggerFileInput() {
        this.$refs.fileInput.click();
      },
      openTeamTrainers(team) {
        this.team_trainer_team = team;
        this.team_trainer_selector_mode = true;
      },
      async restartTeamWindow() {
        const team_id = this.selected_team;
        this.selected_team = null;
        this.player_data_mode = false;
        this.team_player_selector_mode = false;
        await new Promise(resolve => setTimeout(resolve, 200));
        this.selected_team = team_id;
      },
      handleFileUpload(event) {
        this.new_team_form.shield_url = "";
        this.new_team_form.shield_file = null;
        const uploadedFile = event.target.files[0];
        if (uploadedFile && uploadedFile.type.startsWith('image/')) {
          this.new_team_form.shield_file = uploadedFile;
          this.createImageURL(uploadedFile);
        }
      },
      createImageURL(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.new_team_form.shield_url = e.target.result;
        };
        reader.readAsDataURL(file);
      },
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

          this.teams = data;
          this.loadCategories();
          this.loading = false;

        } catch (err) {
          this.generalError.error = "No conexion error: " + err.message;
        }
      },
      async loadCategories() {
        fetch(`${this.$store.getters.getBaseURL}/categories`)
          .then(response => {
            if (!response.ok) {
              throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
          })
          .then(data => {
            this.categories = data;
          })
          .catch(error => {
            this.generalError.error = error;
          });
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
          

          this.club = data;
          await this.loadTeams();

        } catch (err) {
          this.generalError.error = "No conexion error: " + err.message;
        }
      },
      async submitTeam() {
        const postData = {
          user_id: this.getUser.id,
          token: this.getUser.last_token_key,
          team_name: this.new_team_form.name,
          team_sub_category_id: this.new_team_form.sub_category.id,
          team_trainer: this.new_team_form.trainer,
        };
        
        this.new_team_form.loading = true;

        try {
          const res = await fetch(`${this.$store.getters.getBaseURL}/newTeam/owner`, {
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
          
          this.team_creator_mode = false;
          this.loading = true;
          await this.loadTeams();
          this.loading = false;

          this.new_team_form = {
            name: "",
            shield_file: null,
            shield_url: "",
            category: null,
            sub_category: null,
            trainer: {},
            loading: false
          }
          

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
        }, 500);
      },
      renderPhoto(url) {
        if(url == "" || url == null) {
          return "/profile_placeholder.jpg";
        }
        return url;
      },
      setFormTrainer(trainer) {
        this.new_team_form.trainer = trainer;
        this.trainer_selector_mode = false;
      },
      async setTeamTrainer(trainer) {
        if(this.team_trainer_team == null) {
          const team_id = this.selected_team;
          this.selected_team = null;
          this.team_trainer_selector_mode = false;
          await new Promise(resolve => setTimeout(resolve, 200));
          this.selected_team = team_id;
          return;
        }
        //FETCH WITH this.team_trainer_team
        await fetch(`${this.$store.getters.getBaseURL}/changeTrainerTeam/owner`, {
          method: "post",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            user_id: this.getUser.id,
            token: this.getUser.last_token_key,
            trainer: trainer,
            team_id: this.team_trainer_team.id
          }),
        }).then(async response => response.json())
        .then(async data => {
          const team_id = this.selected_team;
          this.selected_team = null;
          this.team_trainer_selector_mode = false;
          await new Promise(resolve => setTimeout(resolve, 200));
          this.selected_team = team_id;
          
        });
      },
      getSubcategories(cat_id) {
        for (let index = 0; index < this.categories.length; index++) {
          if(this.categories[index].id == cat_id) {
            return this.categories[index].sub_categories;
          }
        }
        return null;
      },
      editPlayer(player) {
        this.player_editor_player = player;
        this.player_data_mode = true;
      },
      select_team(id) {
        if(this.selected_team === id) {
          this.selected_team = null;
        }else {
          this.selected_team = id;
        }
      },
      openTeamPlayerSelector(team_id) {
        this.team_player_selector_team_id = team_id;
        this.team_player_selector_mode = true;
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
  <div v-if="player_data_mode">
    <PlayerData @exitPlayer="restartTeamWindow" :player="player_editor_player"></PlayerData>
  </div>
  <div v-if="trainer_selector_mode" class="background_trainer">
    <TrainerSelector @trainer="setFormTrainer"></TrainerSelector>
  </div>
  <div v-if="team_trainer_selector_mode" class="background_trainer">
    <TrainerSelector @trainer="setTeamTrainer"></TrainerSelector>
  </div>
  <div v-if="team_player_selector_mode" class="background_trainer">
    <PlayerSelector :team_id="team_player_selector_team_id" @exitPlayer="restartTeamWindow"></PlayerSelector>
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
          <input v-model="new_team_form.name" style="width: 98%;" placeholder="Nombre" type="new_team_name">
        </div>
      </div>
      <div class="team_creator_container">
        <div class="team_creator_input">
          <h5>Categoria</h5>
          <select v-model="new_team_form.category" name="team_creator_category" id="team_creator_category">
            <option disabled value="">Selecciona</option>
            <option v-for="category in categories" :value="category">{{category.category_name}}</option>
          </select>
        </div>
        <div v-if="new_team_form.category != null" class="team_creator_input">
          <h5>Sub-Categoria</h5>
          <select v-model="new_team_form.sub_category" name="team_creator_subcategory" id="team_creator_subcategory">
            <option disabled value="">Selecciona</option>
            <option v-for="subCategory in getSubcategories(new_team_form.category.id)" :value="subCategory">{{subCategory.sub_category_name}}</option>
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
        <!-- <div class="team_creator_input">
          <h5>Escudo (Opcional)</h5>
          <input ref="fileInput"  type="file" name="photo" @change="handleFileUpload" style="display: none;"/>
          <img v-if="new_team_form.shield_url != ''" class="team_creator_img" :src="new_team_form.shield_url" alt="Imagen Previsualizada" @click="triggerFileInput" />
          <div v-else class="team_creator_img" @click="triggerFileInput">+</div>
        </div> -->
      </div>
      <div class="team_creator_container">
        <div v-if="new_team_form.loading" class="option_button" >CARGANDO...</div>
        <div v-else class="option_button" @click="submitTeam()" style="width: 100%; text-align: center;">CREAR</div>
      </div>
    </div>
  </div>
  <div class="teams_body">
    <div v-if="loading" class="loading">
        <LoadingBall></LoadingBall>
    </div>
    <div class="general_body" v-else>
      <div class="table_options">
        <div style="font-size: 1.6rem; font-weight: bold;">Administrador de Equipos</div>
        <div @click="team_creator_mode = true" class="option_button">Añadir Equipo</div>
      </div>
      <div class="table">
          <div class="table_row_container">
            <div class="table_row">
              <div>Nombre</div>
              <div>Escudo</div>
              <div>Categoria</div>
              <div>Sub-categoria</div>
            </div>
          </div>
          <div v-for="team in teams" :key="team.id" class="table_row_container">
            <div @click="select_team(team.id)" class="table_row selectable">
              <div>{{team.team_name}}</div>
              <img :src="getClubImage" alt="">
              <div>{{team.category.category_name}}</div>
              <div>{{team.sub_category.sub_category_name}}</div>
            </div>
            <div v-if="team.id === selected_team" class="selected_team">
              <TeamData @addPlayer="openTeamPlayerSelector" @restartTeamWindow="restartTeamWindow" @openTeamTrainers="openTeamTrainers" @editPlayer="editPlayer" :team_id="team.id"></TeamData>
            </div>
          </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.selected_team {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.table_row_container {
  display: flex;
  flex-direction: column;
  align-items: stretch;
}
.team_creator_img {
  object-fit: cover;
  height: 8rem;
  width: 8rem;
  margin: 1.4rem 0;
  border: 2px solid grey;
  border-radius: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 4rem;
  font-weight: bold;
  cursor: pointer;
}
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
  background-color: rgba(0, 0, 0, 0.33);
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
.table_row_container:last-child > .selectable{
  border-bottom-right-radius: .4rem;
  border-bottom-left-radius: .4rem;
}
.table_row_container:last-child {
  border-bottom-right-radius: .4rem;
  border-bottom-left-radius: .4rem;
}
.selectable:hover {
  background-color: #2E7D32;
  color: #E8F5E9;
  transition: .25s;
}
.selectable:active {
  background-color: rgba(0, 0, 0, 0.775);
  color: white;
  transition: .25s;
}
.table_row > img {
  object-fit: cover;
  height: 1.2rem;
  width: 1.2rem;
  border: 1px solid grey;
  border-radius: .4rem;
}
.table_row_container:first-child {
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

