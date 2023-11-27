<script setup>
import Loading from './loading/Loading.vue';
import LoadingBall from './loading/LoadingBall.vue';
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
        team_creator_mode: true,
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
  <div v-if="team_creator_mode" class="team_creator_mode">
    <div class="team_creator_window">
      <h3>Creador de Equipos</h3>
      <div class="team_creator_container">
        <div class="team_creator_input">
          <h5>Nombre</h5>
          <input placeholder="Nombre" type="new_team_name">
        </div>
        <div class="team_creator_input">
          <h5>URL Escudo</h5>
          <input placeholder="http://images.org/image.jpg" type="new_team_shield">
        </div>
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
        <div class="option_button">Añadir Equipo</div>
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
  justify-content: space-evenly;
  align-items: center;
  gap: 3rem;
}
.team_creator_window > h3 {
  border-bottom: 1px solid grey;
  padding-bottom: 1rem;
  margin-bottom: 0;
}
.team_creator_window {
  box-sizing: border-box;
  width: 40%;
  height: 50%;
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

